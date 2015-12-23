<?php
class APF_AMQP_Factory {

    const CONF_F_AMQP = 'amqp';

    private function __construct(){}

    /**
     * @return APF_AMQP_Factory
     */
    public static function &get_instance() {
        if (!self::$instance) {
            self::$instance = new APF_Amqp_Factory();
        }
        return self::$instance;
    }
    private static $instance;

    /**
     * @return AMQPConnection
     */
    public function get_connection($name='default') {
        if (!isset($this->connection_list[$name])) {
            $this->connection_list[$name] = $this->load_connection($name);
        }
        return $this->connection_list[$name];
    }
    private $connection_list;

    /**
     * @return AMQPConnection
     */
    private function load_connection($name) {
        if (!class_exists('AMQPConnection')) {
            throw new Exception('APF_AMQP_Factory Exception: AMQPConnection not found');
        }

        $config = APF::get_instance()->get_config($name, self::CONF_F_AMQP);
        if (!isset($config['host'])) {
            throw new Exception('APF_AMQP_Factory Exception: host undefined');
        }

        $con = new AMQPConnection($config);
        $rst = $con->connect();

        if ($rst == false) {
            throw new AMQPException('APF_AMQP_Factory AMQPException: can not connect to server');
        }

        return $con;
    }

    public function __destruct() {
        if (is_array($this->connection_list) && !empty($this->connection_list)) {
            foreach ($this->connection_list as $name => $con) {
                $con->disconnect();
            }
        }
    }
}