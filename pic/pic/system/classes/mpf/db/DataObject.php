<?php

abstract class MPF_DB_DataObject
{
    protected static $splittable = false;
    public $splitSuffix = '';

    public static $enable_cache = true;
    public $cache_expire = 86400;

    public $isLoaded = false;

    /**
     * 构造函数
     *
     * @param string $splitSuffix
     *
     * @throws Exception
     */
    public function __construct($splitSuffix = '') {
        if (self::is_splittable() && !$splitSuffix) {
            throw new Exception(get_called_class() . ' is splittable. Split suffix is needed.');
        }

        $this->splitSuffix = $splitSuffix;
        $this->init();
    }

    /**
     * Magic Setter
     *
     * @param $name
     * @param $value
     * @return $this
     * @throws Exception
     */
    public function __set($name, $value)
    {
        $method = "set$name";
        if (method_exists($this, $method)) {
            return $this->$method($value);
        } elseif (in_array($name, $this->properties())) {
            $this->$name = $value;
            return $this;
        } else {
            throw new Exception("$name is not " . get_called_class() . "'s property.");
        }
    }

    /**
     * Magic Getter
     *
     * @param $name
     * @return mixed
     * @throws Exception
     */
    public function __get($name)
    {
        $method = "get$name";
        if (method_exists($this, $method)) {
            return $this->$method();
        } elseif (in_array($name, $this->properties())) {
            return $this->$name;
        } else {
            throw new Exception("$name is not " . get_called_class() . "'s property.");
        }
    }

    /**
     * 创建Model对象
     *
     * @param array $data
     * @param string $splitSuffix
     *
     * @return APF_DB_DataObject
     *
     * @throws Exception
     */
    public static function create($data, $splitSuffix = '')
    {
        $model = new static($splitSuffix);

        $mapping = static::get_mapping($splitSuffix);

        unset($data[$mapping['key']]);
        foreach ($data as $key => $value) {
            $model->$key = $value;
        }

        return $model;
    }


    /**
     * 保存记录
     *
     * @param array $data
     *
     * @return int
     */
    public function save($data = array()) {
        $key = $this->key();

        unset($data[$key]);
        foreach ($data as $key => $value) {
            $this->$key = $value;
        }

        if (!$this->isLoaded || is_null($this->$key)) {
            return $this->insert();
        } else {
            if(isset($this->update_time)) {
                $this->update_time = date("Y-m-d H:i:s");
            }

            return $this->update();
        }
    }

    /**
     * 插入新记录
     *
     * @return int
     */
    protected function insert() {
        $accessor = $this->init_accessor();

        foreach ($this->properties() as $property) {
            if (!is_null($this->$property)){
                $accessor->set_field($property, $this->$property);
            }
        }

        $rs = $accessor->insert();
        $key = $this->key();
        $this->$key = $accessor->connection->lastInsertId();

        $this->isLoaded = true;

        if (static::$enable_cache) $this->cache_update(); // TODO some insert use mysql default value, cache just get null...
        return $rs;
    }

    /**
     * 更新记录
     *
     * @return int
     */
    protected function update() {
        $class = get_called_class();
        if ($class::cache_enable()) $this->cache_update();

        $accessor = $this->init_accessor();
        foreach ($this->properties() as $property) {
            if (!is_null($this->$property)){
                $accessor->set_field($property, $this->$property);
            }
        }

        return $accessor->filter($this->key(), $this->get_primary_key())
            ->update();
    }

    /**
     * 删除记录
     *
     * @return int
     */
    public function delete() {
        $class = get_called_class();
        if ($class::cache_enable()) $this->cache_delete();

        return $this->init_accessor()
            ->filter($this->key(), $this->get_primary_key())
            ->delete();
    }

    /**
     * 初始化对象属性的默认值
     */
    protected function init() {
        foreach ($this->properties() as $property) {
            $this->$property = null;
        }
    }

    /**
     * 获取主键的值
     *
     * @return mixed
     * @throws Exception
     */
    protected function get_primary_key() {
        $key = $this->key();

        if (is_null($this->$key)) {
            throw new Exception('obj must have key first!', '010');
        }

        return $this->$key;
    }

    /**
     * 获取表名
     *
     * @return string
     */
    protected function table() {
        $mapping = static::get_mapping($this->splitSuffix);
        return $mapping['table'];
    }

    /**
     * 获取主键名称（对象属性）
     *
     * @return string
     */
    protected function key() {
        $mapping = static::get_mapping($this->splitSuffix);
        return $mapping['key'];
    }

    /**
     * 对象属性列表
     *
     * @return array
     */
    protected function properties() {
        return array_keys($this->columns());
    }

    /**
     * 对象属性和表字段映射
     *
     * @return array
     */
    protected function columns() {
        $mapping = static::get_mapping($this->splitSuffix);
        return $mapping['columns'];
    }

    /**
     * 是否开启缓存
     *
     * @return bool
     */
    public static function cache_enable() {
        return (static::$enable_cache && !MPF::get_instance()->get_config('disable_obj_cache'));
    }

    /**
     * 更新单行缓存
     */
    protected function cache_update() {
        MPF::get_instance()->debug("update row cache");
        $cache = MPF_Cache_Factory::get_instance()->get_memcache();
        $cache->set($cache->get_obj_key(get_called_class(), $this->get_primary_key()), $this, 0, $this->cache_expire);
    }

    /**
     * 删除单行缓存
     */
    protected function cache_delete() {
        MPF::get_instance()->debug("delete row cache");
        $cache = MPF_Cache_Factory::get_instance()->get_memcache();
        $cache->delete($cache->get_obj_key(get_called_class(), $this->get_primary_key()));
    }

    /**
     * 获取PDO的配置名称
     *
     * @param string
     */
    public static function get_pdo_name($da) {
        if ($da->read_only && !$da->force_master) {
            return static::get_pdo_slave_name();
        }

        return static::get_pdo_master_name();
    }

    /**
     * 获取PDO的Slave配置名称
     *
     * @throws Exception
     */
    public static function get_pdo_slave_name() {
        throw new Exception('this function must be override', '009');
    }

    /**
     * 获取PDO的Master配置名称
     *
     * @throws Exception
     */
    public static function get_pdo_master_name() {
        throw new Exception('this function must be override', '009');
    }

    /**
     * 对象属性和表字段映射
     *
     * @param string $splitSuffix
     *
     * @return array
     *   - table 表名
     *   - key 主键名（对象属性）
     *   - columns 属性字段映射
     *       - property => column
     *
     * @throws Exception
     */
    public static function get_mapping($splitSuffix = '') {
        throw new Exception('this function must be override', '009');
    }

    /**
     * 是否分表
     *
     * @return bool
     */
    public static function is_splittable()
    {
        return static::$splittable;
    }

    /**
     * 获取MysqlAccessor实例
     *
     * @param string $splitSuffix 分表后缀
     *
     * @return APF_DB_MysqlAccessor
     */
    public static function data_access($splitSuffix = '') {
        $accessor = static::get_accessor();
        return $accessor::use_model(get_called_class(), $splitSuffix);
    }

    public static function get_accessor(){
        return 'MPF_DB_MysqlAccessor';
    }

    /**
     * 初始化MysqlAccessor实例
     *
     * @return APF_DB_MysqlAccessor
     */
    protected function init_accessor()
    {
        return self::data_access($this->splitSuffix);
    }

}
