<?php
apf_require_class("APF_Xhprof");

class APF_XhprofInterceptor extends APF_Interceptor {
    const TRIGGER_PARAMETER_NAME = 'xhprof';
    const TRIGGER_COOKIE_NAME = 'xhprof';

    public function before() {
        if (!$this->is_allow_xhprof()) {
            return self::STEP_CONTINUE;
        }

        $apf = APF::get_instance();

        $request = $apf->get_request();
        $response = $apf->get_response();

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
        return new APF_Xhprof();
    }

    protected function is_allow_xhprof() {
        return true;
        
        $apf = APF::get_instance();
        $xhprof_allow_on = @$apf->get_config("xhprof_allow_on");
        if(!$xhprof_allow_on) return FALSE;
        
        $request = $apf->get_request();
        $client_ip = $request->get_client_ip();
        $allow_patterns = @$apf->get_config("xhprof_allow_patterns");
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
