<?php
class APF_Debugger {
    const DEFAULT_BENCHMARK = 'APF -- DEBUGGER';

    const MESSAGE_TIME = 't';
    const MESSAGE_CONTENT = 'c';
    const MESSAGE_MEMORY = 'm';
    
    const BENCHMARK_COUNT = 'i';

    const BENCHMARK_BEGIN = 'b';
    const BENCHMARK_END = 'e';
    const BENCHMARK_BEGIN_MEMORY = 'bm';
    const BENCHMARK_END_MEMORY = 'em';

    public function __construct() {
        $this->benchmark_begin(self::DEFAULT_BENCHMARK);
        APF::get_instance()->register_shutdown_function(array($this, "shutdown"));
    }

    public function shutdown() {
        $this->benchmark_end(self::DEFAULT_BENCHMARK);
        $apf = APF::get_instance();
        $apf->component(NULL, 'APF_Debugger_Debug');
    }

    public function debug($message) {
        $this->messages[] = array(
            self::MESSAGE_TIME=>microtime(true) - $this->benchmarks[self::DEFAULT_BENCHMARK][self::BENCHMARK_BEGIN],
            self::MESSAGE_CONTENT=>$message,
            self::MESSAGE_MEMORY=>$this->get_memory_usage()
        );
    }

    public function benchmark_begin($name) {
        if(isset($this->benchmarks[$name][self::BENCHMARK_END])){$lt=$this->benchmarks[$name][self::BENCHMARK_END]-$this->benchmarks[$name][self::BENCHMARK_BEGIN];}else{$lt=0;}    //inc
        $this->benchmarks[$name][self::BENCHMARK_BEGIN] = microtime(true);
        $this->benchmarks[$name][self::BENCHMARK_BEGIN] = $this->benchmarks[$name][self::BENCHMARK_BEGIN] - $lt;    //inc
        $this->benchmarks[$name][self::BENCHMARK_BEGIN_MEMORY] = $this->get_memory_usage();
        $this->benchmarks[$name][self::BENCHMARK_COUNT] += 1;
    }

    public function benchmark($name,$mixed=NULL) {
        if(is_array($mixed)){
            foreach($mixed as $key=>$value) {
                $this->benchmarks[$name][$key] = $value;
            }
        }elseif($mixed){
            $this->benchmarks[$name] = $mixed;
        }
    }

    public function benchmark_end($name) {
        $this->benchmarks[$name][self::BENCHMARK_END] = microtime(true);
        $this->benchmarks[$name][self::BENCHMARK_END_MEMORY] = $this->get_memory_usage();
    }

    protected function get_memory_usage() {
        return function_exists('memory_get_usage') ? memory_get_usage() : 0;
    }

    public function get_messages() {
        return $this->messages;
    }

    public function get_benchmarks() {
        return $this->benchmarks;
    }

    private $messages;
    private $benchmarks;
}
