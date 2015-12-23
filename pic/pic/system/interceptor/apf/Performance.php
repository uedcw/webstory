<?php
apf_require_class("APF_Performance");

class APF_PerformanceInterceptor extends APF_Interceptor {
    public function before() {
        if (!$this->is_allow_performance()) {
            return self::STEP_CONTINUE;
        }
        $apf = APF::get_instance();
        $rate = @$apf->get_config("performance_rate");
        if(empty($rate)) {
            $rate = 100;
        }
        $rand = rand(1,$rate);
        if($rand == 1) {
            $request = $apf->get_request();
            $apf -> set_performance($this->create_performance());
        }
        return self::STEP_CONTINUE;
    }

    public function after() {
        return self::STEP_CONTINUE;
    }

    protected function create_performance() {
        return new APF_Performance();
    }

    protected function is_allow_performance() {
        $apf = APF::get_instance();
        $request = $apf->get_request();
        $allow_patterns = @$apf->get_config("performance_is_allow");

        if(@$allow_patterns) {
            return TRUE;
        }
        return FALSE;
    }
}