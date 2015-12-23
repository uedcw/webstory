<?php

apf_require_file('PhpAmqpLib.php');

class APF_AMQPLIB_Factory {

    const CONF_F_AMQP = 'amqp';

    private function __construct(){}

    /**
     * @return APF_AMQP_Factory
     */
    public static function &get_instance() {
        if (!self::$instance) {
            self::$instance = new APF_AMQPLIB_Factory();
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
     * @return AMQPChannel
     */
    public function get_channel($name='default') {
        if (!isset($this->channel_list[$name])) {
            $this->channel_list[$name] = $this->load_channel($name);
        }
        return $this->channel_list[$name];
    }
    private $channel_list;

    /**
     * @return AMQPConnection
     */
    private function load_connection($name) {
        if (!class_exists('AMQPConnection')) {
            throw new Exception('APF_AMQPLIB_Factory Exception: AMQPConnection not found');
        }

        $config = APF::get_instance()->get_config($name, self::CONF_F_AMQP);
        if (!isset($config['host'])) {
            throw new Exception('APF_AMQPLIB_Factory Exception: host undefined');
        }

        $con = new AMQPConnection($config['host'], $config['port'], $config['login'], $config['password']);

        return $con;
    }

    /**
     * @return AMQPChannel
     */
    private function load_channel($name) {
        $config = APF::get_instance()->get_config($name, self::CONF_F_AMQP);
        $con = $this->get_connection($name);
        $ch = $con->channel();
        $ch->access_request($config['vhost'], false, false, true, true);
        return $ch;
    }

    public function __destruct() {
        if (is_array($this->channel_list) && !empty($this->channel_list)) {
            foreach ($this->channel_list as $name => $ch) {
                $ch->close();
            }
        }

        if (is_array($this->connection_list) && !empty($this->connection_list)) {
            foreach ($this->connection_list as $name => $con) {
                $con->close();
            }
        }
    }
}
