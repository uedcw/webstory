<?php
class MPF_DB_Factory {
    /**
     * @return APF_DB_Factory
     */
    public static function &get_instance() {
        if (!self::$instance) {
            self::$instance = new MPF_DB_Factory();
        }
        return self::$instance;
    }

    private static $instance;

    //
    public function get_db($sql_rewrite=null)
    {
        mpf_require_file('Mysqli_Database.php');
        $db = Mysqli_Database::get_instance();
        $db->_sql_rewrite = $sql_rewrite;
        return $db;
    }

    /**
     * Returns pdo instance by given name. only one instance of pdo will be created for one name.
     *
     * @param string $name
     * @return APF_DB_PDO
     */
    public function get_pdo($name="default") {
        if (!isset($this->pdo_list[$name])) {
            $this->pdo_list[$name] = $this->load_pdo($name);
        }
        return $this->pdo_list[$name];
    }

    /**
     * Returns new instance of pdo
     *
     * @param string $name
     * @return APF_DB_PDO
     */
    public function load_pdo($name="default") {
        $mpf = MPF::get_instance();
        if ($mpf->is_debug_enabled()) {
            $mpf->benchmark_begin(__CLASS__ . ": open pdo '$name'");
        }
        $dbcfg = MPF::get_instance()->get_config($name, "database");
        mpf_require_class($this->pdo_class);
        $pdo = new $this->pdo_class(
            $dbcfg['dsn'],
            @$dbcfg['username'],
            @$dbcfg['password'],
            isset($dbcfg['driver_options']) ? $dbcfg['driver_options'] : array());

        $pdo->set_name($name);

        if (isset($dbcfg['default_fetch_mode'])) {
            $pdo->set_default_fetch_mode($dbcfg['default_fetch_mode']);
        }

        if (isset($dbcfg['init_statements'])) {
            foreach ($dbcfg['init_statements'] as $sql) {
                $pdo->exec($sql);
            }
        }

        if ($mpf->is_debug_enabled()) {
            $mpf->benchmark_end(__CLASS__ . ": open pdo '$name'");
        }

        return $pdo;
    }

    public function close_pdo($name="default") {
        if (!isset($this->pdo_list[$name])) {
            return;
        }
        unset($this->pdo_list[$name]);
    }

    public $pdo_list = array();

    //add by jackie
    public function close_pdo_all() {
        if(!empty($this->pdo_list)) {
            foreach(array_keys($this->pdo_list) as $name) {
                unset($this->pdo_list[$name]);
            }
        }
    }

    private function set_pdo_class($class) {
        $this->pdo_class = $class;
    }

    private $pdo_class = "MPF_DB_PDO";

    //

    private function __construct() {
    }

    public function __destruct() {
    }
}
