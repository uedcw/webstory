<?php
mpf_require_class("MPF_Xhprof");

class MPF_XhprofInterceptor extends MPF_Interceptor {
    const TRIGGER_PARAMETER_NAME = 'xhprof';
    const TRIGGER_COOKIE_NAME = 'xhprof';

    public function before() {
        if (!$this->is_allow_xhprof()) {
            return self::STEP_CONTINUE;
        }

        $mpf = MPF::get_instance();

        $request = $mpf->get_request();
        $response = $mpf->get_response();

        $xhprof_param = @$request->get_parameter(self::TRIGGER_PARAMETER_NAME);
        $xhprof_cookie = @$request->get_cookie(self::TRIGGER_COOKIE_NAME);

        if (isset($xhprof_param) && $xhprof_param == 0) {
            if (isset($xhprof_cookie)) {
                $response->remove_cookie(self::TRIGGER_COOKIE_NAME);
            }
            return self::STEP_CONTINUE;
        }

        if (isset($xhprof_param) && $xhprof_param > 0) {
            $this->create_xhprof();
            $response->set_cookie(self::TRIGGER_COOKIE_NAME, $xhprof_param);
            return self::STEP_CONTINUE;
        }

        if (isset($xhprof_cookie) && $xhprof_cookie > 0) {
            $this->create_xhprof();
        } else {
            if (isset($xhprof_cookie)) {
                $response->remove_cookie(self::TRIGGER_COOKIE_NAME);
            }
        }

        return self::STEP_CONTINUE;
    }

    public function after() {
        return self::STEP_CONTINUE;
    }

    protected function create_xhprof() {
        return new MPF_Xhprof();
    }

    protected function is_allow_xhprof() {
        return true;
        
        $mpf = MPF::get_instance();
        $xhprof_allow_on = @$mpf->get_config("xhprof_allow_on");
        if(!$xhprof_allow_on) return FALSE;
        
        $request = $mpf->get_request();
        $client_ip = $request->get_client_ip();
        $allow_patterns = @$mpf->get_config("xhprof_allow_patterns");
        if (is_array($allow_patterns)) {
            foreach ($allow_patterns as $pattern) {
                if (preg_match($pattern, $client_ip)) {
                    return TRUE;
                }
            }
        }
        return FALSE;
    }
}
