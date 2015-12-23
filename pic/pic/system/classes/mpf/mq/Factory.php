<?php
mpf_require_class("MPF");
class MPF_MQ_Factory {
    /**
     * @return APF_MQ_Factory
     */
    public static function &get_instance() {
        if (!self::$instance) {
            self::$instance = new MPF_MQ_Factory();
        }
        return self::$instance;
    }

    private static $instance;

    //

    /**
     * @return APF_MQ_Stomp
     */
    public function get_stomp($name="default") {
        if (!isset($this->stomp[$name])) {
            $this->stomp[$name] = $this->load_stomp($name);
        }
        return $this->stomp[$name];
    }

    /**
     * @return APF_MQ_Stomp
     */
    public function load_stomp($name="default") {
        $cfg = MPF::get_instance()->get_config($name, 'mq');
        mpf_require_class('MPF_MQ_Stomp');
        $stomp = new MPF_MQ_Stomp($cfg['uri']);
        return $stomp;
    }

    /**
     * @var APF_MQ_Stomp
     */
    private $stomp_list = array();

    //

    private function __construct() {
    }

    public function __destruct() {
    }
}