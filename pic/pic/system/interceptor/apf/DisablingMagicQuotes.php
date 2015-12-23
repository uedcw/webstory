<?php
apf_require_class("APF");
/**
 * 去掉魔术引号转意拦截器
 */
class APF_DisablingMagicQuotesInterceptor extends APF_Interceptor {
    public function before() {
        // http://cn2.php.net/manual/en/security.magicquotes.disabling.php
        if (get_magic_quotes_gpc()) {
            function stripslashes_deep($value) {
                $value = is_array($value) ?
                            array_map('stripslashes_deep', $value) :
                            stripslashes($value);

                return $value;
            }

            $_POST = array_map('stripslashes_deep', $_POST);
            $_GET = array_map('stripslashes_deep', $_GET);
            $_COOKIE = array_map('stripslashes_deep', $_COOKIE);
            $_REQUEST = array_map('stripslashes_deep', $_REQUEST);
        }
        return self::STEP_CONTINUE;
    }

    public function after() {
        return self::STEP_CONTINUE;
    }
}
