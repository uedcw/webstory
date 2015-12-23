<?php
class APF_Cache_Memcache extends Memcache {

    private $key_list;
    private $read_keys;

    public function get_key_list () {
        return $this->key_list;
    }
    public function get ($key,&$flag = null) {
        $this->_log_read_keys($key);
        $list = @parent::get($key,$flag);
        return $list;
    }
    private function _log_read_keys ($key) {
        if (is_array($this->read_keys)) {
            if (!in_array($key,$this->read_keys)) {
                $this->read_keys[] = $key;
            }
        } else {
            $this->read_keys = array();
            $this->read_keys[] = $key;
        }
    }
    public function get_read_keys () {
        return $this->read_keys;
    }
    public function set_with_collect ($key , $var , $flag = 0 , $expire = 0) {
        $this->_log($key);
        return parent::set ($key,$var,$flag,$expire);
    }

    public function get_obj_key($obj_name, $key) {
        return "obj_cache::{$obj_name}::{$key}::V2";
    }

    private function _log ($key) {
        if (is_array($this->key_list)) {
            if (!in_array($key,$this->key_list)) {
                $this->key_list[] = $key;
            }
        } else {
            $this->key_list = array();
            $this->key_list[] = $key;
        }
    }
}