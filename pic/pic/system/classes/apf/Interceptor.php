<?php
class APF_Interceptor {

    const STEP_CONTINUE = 1;
    const STEP_BREAK    = 2;
    const STEP_EXIT     = 3;

    public function __construct() {
    }

    public function __destruct() {
    }

    public function init() {
    }

    public function destory() {
    }

    public function before() {
        return APF_Interceptor::STEP_CONTINUE;
    }

    public function after() {
        return APF_Interceptor::STEP_CONTINUE;
    }
}