<?php
mpf_require_class("MPF");

class MPF_CompressInterceptor extends MPF_Interceptor {
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