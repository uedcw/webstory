<?php
mpf_require_class("MPF_Performance");

class MPF_PerformanceInterceptor extends MPF_Interceptor {
    public function before() {
        if (!$this->is_allow_performance()) {
            return self::STEP_CONTINUE;
        }
        $mpf = MPF::get_instance();
        $rate = @$mpf->get_config("performance_rate");
        if(empty($rate)) {
            $rate = 100;
        }
        $rand = rand(1,$rate);
        if($rand == 1) {
            $request = $mpf->get_request();
            $mpf -> set_performance($this->create_performance());
        }
        return self::STEP_CONTINUE;
    }

    public function after() {
        return self::STEP_CONTINUE;
    }

    protected function create_performance() {
        return new MPF_Performance();
    }

    protected function is_allow_performance() {
        $mpf = MPF::get_instance();
        $request = $mpf->get_request();
        $allow_patterns = @$mpf->get_config("performance_is_allow");

        if(@$allow_patterns) {
            return TRUE;
        }
        return FALSE;
    }
}