<?php
class MPF_Performance {
    const DEFAULT_BENCHMARK = 'all';     //一次完整的请求

    const MESSAGE_TIME = 't';
    const MESSAGE_MEMORY = 'm';
    const MESSAGE_COUNT = 'c';

    const BENCHMARK_BEGIN = 'b';
    const BENCHMARK_END = 'e';
    const BENCHMARK_BEGIN_MEMORY = 'bm';
    const BENCHMARK_END_MEMORY = 'em';

    const NAME_KEY    = "name";
    const REQUEST_NAME = "request";
    const CONTENT_KEY = "content";

    const MACHINE_NAME_KEY = "machine";
    const RELEASE_VERSION_KEY = "release";
    const APP_NAME_KEY = "appname";

    private $benchmarks = array();
    private $messages = array();
    private $logs = array();

    public function __construct() {
        MPF::get_instance()->register_shutdown_function(array($this, "shutdown"));
    }

    public function shutdown() {
        $url = $this->get_deliver_url();
        if(!$url) {
            return;
        }

        $this->handle_propety();
        $logs = $this->get_logs();
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_HTTPHEADER, array(
            "Content-type:application/x-www-form-urlencoded; charset=utf-8"
        ));
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 3);
        curl_setopt($curl, CURLOPT_TIMEOUT, 3);
        curl_setopt($curl, CURLOPT_POST, 1);



        if ($logs) {
            $fields = "";
            foreach ($logs as $log) {
                $json = json_encode($log);
                $fields .= "json=" . urlencode($json) . "&";
            }
            curl_setopt($curl, CURLOPT_URL, $url);
            curl_setopt($curl, CURLOPT_POSTFIELDS, $fields);
            $res = curl_exec($curl);
        }
        curl_close($curl);
    }

    private function handle_propety() {
        $mpf = MPF::get_instance();
        $bk = $this->get_benchmarks();
        $name = get_class($mpf->get_current_controller());
        foreach($bk as $key=>$val) {
            if(!$val[self::BENCHMARK_END]){
                $val[self::BENCHMARK_END] = microtime(true);
                $val[self::BENCHMARK_END_MEMORY] = $this->get_memory_usage();
            }
            $this->messages[$key][self::MESSAGE_TIME] = $val[self::BENCHMARK_END]-$val[self::BENCHMARK_BEGIN];
            $this->messages[$key][self::MESSAGE_MEMORY] = $val[self::BENCHMARK_END_MEMORY]-$val[self::BENCHMARK_BEGIN_MEMORY];
        }
        $messages = $this->get_messages();
        $this->logs['performance_main'] = $messages;
        $this->logs['created'] = date("Y-m-d H:i:s");
        $this->logs[self::NAME_KEY] = "performance";    //日志格式sojourner.log.performance:{}
        $this->logs[self::REQUEST_NAME] = $name;
        //add by xinhe
        $this->logs['method']=$_SERVER['REQUEST_METHOD'];

        $request = $mpf->get_request();

        if (defined("MACHINE_NAME")) {
            $this->logs[self::MACHINE_NAME_KEY] = (string)MACHINE_NAME;
        }
        if (defined("RELEASE_VERSION")) {
            $this->logs[self::RELEASE_VERSION_KEY] = (string)RELEASE_VERSION;
        }
        if (defined("APP_NAME")) {
            $this->logs[self::APP_NAME_KEY] = (string)APP_NAME;
            if($this->logs[self::APP_NAME_KEY] == "image") {
                $this->logs[self::NAME_KEY] = "dfs";
            }
        }
    }

    public function benchmark_begin($name) {
        $this->benchmarks[$name][self::BENCHMARK_BEGIN] = microtime(true);
        $this->benchmarks[$name][self::BENCHMARK_BEGIN_MEMORY] = $this->get_memory_usage();
    }

    public function benchmark_end($name) {
        $this->benchmarks[$name][self::BENCHMARK_END] = microtime(true);
        $this->benchmarks[$name][self::BENCHMARK_END_MEMORY] = $this->get_memory_usage();
    }

    public function benchmark($name,$mixed=NULL) {
        if(is_array($mixed)){
            foreach($mixed as $key=>$value) {
                $this->messages[$name][$key] = $value;
            }
        }elseif($mixed){
            $this->messages[$name] = $mixed;
        }
    }

    public function benchmark_inc_begin($name) {
        $this->benchmark_begin($name);
    }

    public function benchmark_inc_end($name) {
        $this->benchmark_end($name);
        if(!isset($this->messages[$name])){
            $this->messages[$name][self::MESSAGE_TIME] = 0;
            $this->messages[$name][self::MESSAGE_MEMORY] = 0;
            $this->messages[$name][self::MESSAGE_COUNT] = 0;
        }
        $this->messages[$name][self::MESSAGE_TIME] += $this->benchmarks[$name][self::BENCHMARK_END]-$this->benchmarks[$name][self::BENCHMARK_BEGIN];
        $this->messages[$name][self::MESSAGE_MEMORY] += $this->benchmarks[$name][self::BENCHMARK_END_MEMORY]-$this->benchmarks[$name][self::BENCHMARK_BEGIN_MEMORY];
        $this->messages[$name][self::MESSAGE_COUNT] += 1;
        unset($this->benchmarks[$name]);
    }

    protected function get_memory_usage() {
        return function_exists('memory_get_usage') ? memory_get_usage() : 0;
    }

    public function get_benchmarks() {
        return $this->benchmarks;
    }

    public function get_messages() {
        return $this->messages;
    }

    public function get_logs() {
        $finall_logs[] = $this->logs;
        return $finall_logs;
    }

    public function get_deliver_url() {
        $url = @MPF::get_instance()->get_config("sojourner_log_url", "mq");
        return $url;
    }
}