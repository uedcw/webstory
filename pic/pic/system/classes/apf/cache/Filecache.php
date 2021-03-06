<?php
apf_require_class("APF_Util_CodecUtils");
class APF_Cache_Filecache {
    const MAX_SECONDS = 2592000;

    public function __construct() {
    }

    public function __destruct() {
    }

    public function add($key, $var, $flag, $expire=0) {
/*        $path = $this->get_path_by_key($key);
        if (!mkdir($path, 0755, true)) {
            return FALSE;
        }*/

          $path = $this->cache_dir;  //add by minjiewang 2011-12-19

        $created = time();
        if ($expire > 0 && $expire <= self::MAX_SECONDS) {
            $expire += $created;
        }

        $data_body = serialize($var);
        $data_head = pack('LL', $created, $expire);

        $filename = $path . '/' . $this->get_file_by_key($key);
        $fp = fopen($filename, 'w');
        if (!$fp) {
            return FALSE;
        }
        flock($fp, LOCK_EX);
        fwrite($fp, pack('C', strlen($data_head)));
        fwrite($fp, $data_head);
        fwrite($fp, $data_body);
        fclose($fp);
        return $ret ? TRUE : FALSE;
    }

    public function delete($key, $timeout=0) {
        // TODO: LOCK?
        //$path=$this->get_path_by_key($key);
        $path = $this->cache_dir;  //add by minjiewang 2011-12-19
        $filename =  $path. '/' . $this->get_file_by_key($key);
        if (file_exists($filename)) {
            unlink($filename);
        }
    }

    public function flush() {
        // TODO:
        unlink($this->cache_dir);
    }

    public function get($key) {
/*        $path = $this->get_path_by_key($key);
        if (!is_dir($path)) {
            return FALSE;
        }*/

        $path = $this->cache_dir;  //add by minjiewang 2011-12-19

        $filename = $path . '/' . $this->get_file_by_key($key);
        if (!file_exists($filename)) {
            return FALSE;
        }

        $fp = fopen($filename, 'r');
        if (!$fp) {
            return FALSE;
        }

        flock($fp, LOCK_SH);

        $head_length = ord(fread($fp, 1));
        $data_head = fread($fp, $head_length);
        list($created, $expire) = unpack('L/L', $data_head);
/*        if ($expire > 0 && $expire < $created) {
            // item expired
            return NULL;
        }*/
        
        if ($expire > 0 && $expire < time()) {
            $this->delete($key);
            return NULL;
        }

        while (!feof($fp)) {
            $data_body .= fread($fp, 8192);
        }

        fclose($fp);

        $var = unserialize($data_body);
        return $var;
    }

    public function replace($key, $var, $flag, $expire=0) {
        $path = $this->get_path_by_key($key);
        if (!is_dir($path)) {
            return FALSE;
        }

        $filename = $path . '/' . $this->get_file_by_key($key);
        if (!file_exists($filename)) {
            return FALSE;
        }

        return $this->add($key, $var, $flag, $expire);
    }

    public function set($key, $var, $flag, $expire=0) {
        return $this->add($key, $var, $flag, $expire);
    }

    protected function get_file_by_key($key) {
        $file = APF_Util_CodecUtils::hex_encode(substr($key, 0, 100));
        return "$file.apfcache";
    }

    protected function get_path_by_key($key) {
        $path = md5($key);
        $path = preg_replace('/[a-z0-9]{2}/', '/\0', $path);
        return $this->cache_dir . $path;
    }

    //

    public function set_cache_dir($dir) {
        $this->cache_dir = $dir;
    }

    private $cache_dir = "/tmp/apfcache";
}