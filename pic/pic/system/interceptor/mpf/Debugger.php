<?php
mpf_require_class("MPF_Debugger");

class MPF_DebuggerInterceptor extends MPF_Interceptor {
    const TRIGGER_PARAMETER_NAME = 'debug';
    const TRIGGER_COOKIE_NAME = 'debug';
    const TRIGGER_MEMORY_LIMIT = 'memory_limit';
	const TRIGGER_DISPALY_ERRORS = 'display_errors';

    public function before() {
        if (!$this->is_allow_debug()) {
            return self::STEP_CONTINUE;
        }

        $mpf = MPF::get_instance();

        $request = $mpf->get_request();
        $response = $mpf->get_response();

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
        
        $display_errors = @$request->get_parameter(self::TRIGGER_DISPALY_ERRORS);
        if($display_errors) {
            error_reporting(E_ALL&~E_DEPRECATED^E_NOTICE^E_WARNING);
            ini_set('display_errors',1);
        }
        
        if (isset($debug_param) && $debug_param > 0) {
            $mpf->set_debugger($this->create_debugger());
            $response->set_cookie(self::TRIGGER_COOKIE_NAME, $debug_param);
            return self::STEP_CONTINUE;
        }
        if (isset($debug_cookie) && $debug_cookie > 0) {
            $mpf->set_debugger($this->create_debugger());
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
        return new MPF_Debugger();
    }

    protected function is_allow_debug() {
        $mpf = MPF::get_instance();
        $request = $mpf->get_request();
        $client_ip = $request->get_client_ip();
        $allow_patterns = @$mpf->get_config("debug_allow_patterns");
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
