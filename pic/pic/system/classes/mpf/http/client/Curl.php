<?php
class MPF_Http_Client_Curl {

    private $curl;
    private $url;
    /**
     * @return APF_Http_Client_Curl
     */
    public function __construct() {
        $this->curl = curl_init();
        $this->init();
    }

    public function init () {
        $this->set_attribute(CURLOPT_HTTPHEADER, array(
            "Content-type:text/xml; charset=utf-8"
        ));
        $this->set_attribute(CURLOPT_RETURNTRANSFER, 1);
        $this->set_attribute(CURLOPT_CONNECTTIMEOUT, 10);
        $this->set_attribute(CURLOPT_TIMEOUT, 10);
    }

    /**
     * 请求curl
     * @var string
     */
    private $_url = null;
    public function set_url ($url) {
        $this->_url = $url;
        $this->url = $url;
        curl_setopt($this->curl,CURLOPT_URL,$url);
    }

    public function set_attribute ($name,$value) {
        curl_setopt($this->curl,$name,$value);
    }
    
    public function set_timeout($time){
        $this->set_attribute(CURLOPT_TIMEOUT,$time);
    }

    /**
     * @return boolean
     */
    public function execute() {
        $this->response_text = curl_exec($this->curl);
        $this->curl_info = curl_getinfo($this->curl);
        if ($this->curl_info['http_code'] == 200) {//!curl_errno($this->curl)
            return true;
        } else {
            $this->curl_errno = curl_errno($this->curl);
            $this->curl_error = curl_error($this->curl);
            return false;
        }
    }
	
	public file_create($filename, $mimetype = '', $postname = '') {
		/*if (!function_exists('curl_file_create')) {
			function curl_file_create($filename, $mimetype = '', $postname = '') {
				return "@$filename;filename="
					. ($postname ?: basename($filename))
					. ($mimetype ? ";type=$mimetype" : '');
			}
		}*/
		$cfile = curl_file_create($filename,$mimetype);
		$data = array($postname => $cfile);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	}
	
	public function escape($str) {
		return curl_escape($this->curl,$str);
	}
	
	public function unescape($str) {
		return curl_unescape($this->curl,$str);
	}
	
	public version() {
		return curl_version();
	}

    private $response_text;
    private $curl_info;
    private $curl_errno;
    private $curl_error;

    public function get_response_text () {
        return $this->response_text;
    }

    public function get_curl_info () {
        return $this->curl_info;
    }
    
    public function get_curl_errno() {
        return $this->curl_errno;
    }
    
    public function get_curl_error() {
        return $this->curl_error;
    }

    public function __destruct() {
        curl_close($this->curl);
    }
}