<?php
class MPF_DFS_Factory {
    const CONFIG_F_DFS = "dfs";
    const CONFIG_N_CLASS = "class";

    /**
     * @return APF_DFS_Factory
     */
    public static function &get_instance() {
        if (!self::$instance) {
            self::$instance = new MPF_DFS_Factory();
        }
        return self::$instance;
    }

    private static $instance;

    //

    /**
     * 获取DFS实例.
     *
     * @param string $name
     * @return APF_DFS_DFS
     */
    public function get_dfs($name="default") {
        if (!isset($this->dfs_list[$name])) {
            $this->dfs_list[$name] = $this->create_dfs($name);
        }
        return $this->dfs_list[$name];
    }

    /**
     * 创建DFS实例. 根据name,从配置文件获取信息创建实例.
     *
     * @param string $name
     * @return APF_DB_PDO
     */
    protected function create_dfs($name) {
        $mpf = MPF::get_instance();

        $config = $mpf->get_config($name, self::CONFIG_F_DFS);
        if (!isset($config[self::CONFIG_N_CLASS])) {
            throw new Exception("class not provided for dfs::$name");
        }
        $class = $config[self::CONFIG_N_CLASS];
        mpf_require_class($class);
        $dfs = new $class();
        $dfs->init($config);
        return $dfs;
    }

    /**
     *
     * @var APF_DFS_DFS
     */
    protected $dfs_list = array();

    //

    private function __construct() {
    }

    public function __destruct() {
    }
}