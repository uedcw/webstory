<?php
mpf_require_class("MPF_Debugger");
mpf_require_class("MPF_Component");
//apf_require_controller("My_CacheUpdater");
class MPF_Debugger_DebugComponent extends MPF_Component {
    public static function use_styles() {
        $path = mpf_classname_to_path(__CLASS__);
        return array($path."Debug.css");
    }

    public function get_view() {
        //$memcache_keys = $this->get_memcache_keys();
        //$this->assign_data("memcache_keys",$memcache_keys);
        //$debugger = APF::get_instance()->get_debugger();
        //APF::get_instance()->benchmark_end($debugger::DEFAULT_BENCHMARK);
        return "Debug";
    }

    public function build_cache_updater_url () {
        $base_domain = MPF::get_instance()->get_config("base_domain");
        $url = "http://my." . $base_domain . BASE_URI."/tools/cache/updater";
        return $url;
    }

    public function get_benchmarks() {
        $benchmarks = MPF::get_instance()->get_debugger()->get_benchmarks();
        return $benchmarks ? $benchmarks : array();
    }

    public function get_messages() {
        $messages = MPF::get_instance()->get_debugger()->get_messages();
        return $messages ? $messages : array();
    }

    public function get_memcache_keys () {
        mpf_require_class("MPF_Cache_Factory");
        $keys = MPF_Cache_Factory::get_instance()->get_memcache()->get_read_keys();
        return $keys?$keys:array();
    }

    public function print_variable($var) {
        $this->var_id++;
        if (is_array($var)) {
            $id = $this->get_html_id() . '_' . $this->var_id;
            echo '<a href="javascript:;" onclick="SystemToggle(\'' . $id . '\')">Array</a>';
            echo '<pre id="' . $id . '" style="display:none"">';
            if (is_array($var)) {
                print_r($var);
            } else {
            var_dump($var);
            }
            echo '</pre>';
        } else {
            print_r($var);
        }
    }

    private $var_id = 0;
}
