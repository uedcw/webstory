<?php
apf_require_class("APF");

class APF_CompressInterceptor extends APF_Interceptor {
    public function before() {
        if (function_exists("ob_gzhandler")) {
            ob_start("ob_gzhandler");
        }
        return self::STEP_CONTINUE;
    }

    public function after() {
        return self::STEP_CONTINUE;
    }
}