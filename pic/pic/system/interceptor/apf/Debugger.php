<?php
apf_require_class("APF_Debugger");

class APF_DebuggerInterceptor extends APF_Interceptor {
    const TRIGGER_PARAMETER_NAME = 'debug';
    const TRIGGER_COOKIE_NAME = 'debug';
    const TRIGGER_MEMORY_LIMIT = 'memory_limit';

    public function before() {
        if (!$this->is_allow_debug()) {
            return self::STEP_CONTINUE;
        }

        $apf = APF::get_instance();

        $request = $apf->get_request();
        $response = $apf->get_response();

        $debug_param = @$request->get_parameter(self::TRIGGER_PARAMETER_NAME);
        $debug_cookie = @$request->get_cookie(self::TRIGGER_COOKIE_NAME);
    
        if (isset($debug_param) && $debug_param == 0) {
            // disable debug output, remove debug cookie
            if (isset($debug_cookie)) {
                $response->remove_cookie(self::TRIGGER_COOKIE_NAME);
            }
            return self::STEP_CONTINUE;
        }
        
        $memory_limit = @$request->get_parameter(self::TRIGGER_MEMORY_LIMIT);
        $memory_limit = @floatval($memory_limit);
        if (0 < $memory_limit && 10240) {/* 1~10240M */
            ini_set('memory_limit', $memory_limit.'M');
        }
        if (isset($debug_param) && $debug_param > 0) {
            $apf->set_debugger($this->create_debugger());
            $response->set_cookie(self::TRIGGER_COOKIE_NAME, $debug_param);
            return self::STEP_CONTINUE;
        }
        if (isset($debug_cookie) && $debug_cookie > 0) {
            $apf->set_debugger($this->create_debugger());
        } else {
            if (isset($debug_cookie)) {
                $response->remove_cookie(self::TRIGGER_COOKIE_NAME);
            }
        }

        return self::STEP_CONTINUE;
    }

    public function after() {
        return self::STEP_CONTINUE;
    }

    protected function create_debugger() {
        return new APF_Debugger();
    }

    protected function is_allow_debug() {
        $apf = APF::get_instance();
        $request = $apf->get_request();
        $client_ip = $request->get_client_ip();
        $allow_patterns = @$apf->get_config("debug_allow_patterns");
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
