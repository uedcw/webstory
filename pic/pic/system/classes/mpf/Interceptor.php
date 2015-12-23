<?php
class MPF_Interceptor {

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
        return MPF_Interceptor::STEP_CONTINUE;
    }

    public function after() {
        return MPF_Interceptor::STEP_CONTINUE;
    }
}