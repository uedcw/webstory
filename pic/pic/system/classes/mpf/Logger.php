<?php
class MPF_Logger {
    const CONFIG_F_LOGGER = "logger";
    const CONFIG_N_DEFAULT = "default";
    const CONFIG_N_PREFIX = "prefix";

    public function __construct() {
        $priority = @MPF::get_instance()->get_config(self::CONFIG_N_DEFAULT, self::CONFIG_F_LOGGER);
        $this->priority = $priority ? $priority : LOG_WARNING;
    }

    public function __destruct() {
    }

    /**
     * @param name string
     * @param messages string
     */
    public function debug() {
        $args = func_get_args();
        $args = array_merge(array(LOG_DEBUG), $args);
        return call_user_func_array(array(&$this, 'log'), $args);
    }

    /**
     * @param name string
     * @param messages string
     */
    public function info() {
        $args = func_get_args();
        $args = array_merge(array(LOG_INFO), $args);
        return call_user_func_array(array(&$this, 'log'), $args);
    }

    /**
     * @param name string
     * @param messages string
     */
    public function notice() {
        $args = func_get_args();
        $args = array_merge(array(LOG_NOTICE), $args);
        return call_user_func_array(array(&$this, 'log'), $args);
    }

    /**
     * @param name string
     * @param messages string
     */
    public function warn() {
        $args = func_get_args();
        $args = array_merge(array(LOG_WARNING), $args);
        return call_user_func_array(array(&$this, 'log'), $args);
    }

    /**
     * @param name string
     * @param messages string
     */
    public function error() {
        $args = func_get_args();
        $args = array_merge(array(LOG_ERR), $args);
        return call_user_func_array(array(&$this, 'log'), $args);
    }

    /**
     * @param name string
     * @param messages string
     */
    public function fatal() {
        $args = func_get_args();
        $args = array_merge(array(LOG_CRIT), $args);
        return call_user_func_array(array(&$this, 'log'), $args);
    }

    /**
     * @param priority int
     * @param name string
     * @param messages string
     */
    protected function log() {
        $num = func_num_args();
        if ($num <= 1) {
            return false;
        }
        $args = func_get_args();
        $priority = $args[0];
        $name = $args[1];

        if (isset($this->priorities[$name])) {
            $allow_priority = $this->priorities[$name];
        } else {
            $allow_priority = $this->priority;
            $prefixes = @MPF::get_instance()->get_config(self::CONFIG_N_PREFIX, self::CONFIG_F_LOGGER);
            if ($prefixes) {
                foreach ($prefixes as $key=>$value) {
                    if (strncmp($key, $name, strlen($key)) == 0) {
                        $allow_priority = $value;
                        $this->priorities[$name] = $allow_priority;
                        break;
                    }
                }
            }
        }

        if ($priority > $allow_priority) {
            return false;
        }

        $message="[$priority] [$name] ";
        for ($i=2; $i<$num; $i++) {
            $message .= $args[$i];
        }
        //大部分系统允许写入的单条最大日志是1024,所以对大日志进行分割。
        //add by wbsong
        $message_array = str_split($message,900);
        //define_syslog_variables();
        openlog("MPF", LOG_PID, LOG_USER);
        foreach ($message_array as $key=>$msg) {
            //安居客论坛出了一次问题，require 一个不存在的类，导致输出了很多日志，
            //进而导致网站服务器相应不过来，现在改为输出9次，基本上错误信息就全了
            //添加后面省略的数量
            if ($key > 8 ) {
                syslog($priority, "===too many messages No necessary to output===[".@count($message_array)."]");
                break;
            }
            syslog($priority, $msg);
        }
        closelog();

        return true;
    }

    private $priority;
    private $priorities = array();
}
