<?php
class APF_Http_Client_Factory {
    /**
     * @return APF_Http_Client_Factory
     */
    public static function &get_instance () {
        if (!self::$instance) {
            self::$instance = new APF_Http_Client_Factory();
        }
        return self::$instance;
    }

    private static $instance;
    private static $curl;
    /**
     * @return APF_Http_Client_Curl
     */
    public function get_curl () {
        if (!self::$curl) {
            self::$curl = $this->load_curl();
        }
        return self::$curl;
    }

    /**
     * @return APF_Http_Client_Curl
     */
    public function load_curl () {
        apf_require_class("APF_Http_Client_Curl");
        $curl = new APF_Http_Client_Curl();
        return $curl;
    }
}