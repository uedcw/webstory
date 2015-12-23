<?php
/**
 * 控制器接口，而非抽象类……
 * @author microhuang
 *
 */
abstract class APF_Controller {
    public function __construct() {
    }

    public function __destruct() {
    }

    public function get_interceptor_index_name () {
        return __CLASS__;
    }
    
    public function __toString()
    {
        $cn = get_class($this);
        return trim(substr($cn,0,strlen($cn)-10),'_');
    }

    abstract public function handle_request();
}