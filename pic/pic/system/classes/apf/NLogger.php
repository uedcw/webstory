<?php

/**
 *
 * net logger for anjuke v2
 *
 * Usage :
 *
 *   APF::get_instance()->get_nlogger()->log($tagname, $logcontent);
 *
 * Configuration :
 *
 *  Filename : nlogger.php
 *
 *  Items :
 *    tag_prefix : self-explanatory. Default value is ''.
 *    threhold : threhold value of flushing log to destination.
 *               To save cost of TCP connection, NLogger does not
 *               write to destination immediately when you call log function,
 *               while flush to destination
 *               after threhold times of log function was invoked.
 *               Default value is 10.
 *    host : net logger destination host.
 *    port : net logger destination port.
 *    disabled : Whether disable nlogger, default value is FALSE.
 *              Set disabled to TRUE while you don't wanna write any net logger.
 *
 */

class APF_NLogger {
    const CONFIG_F_LOGGER = "nlogger";

    const CONFIG_N_TAG_PREFIX = "tag_prefix";
    const CONFIG_N_THREHOLD = "threhold";

    const CONFIG_N_HOST = "host";
    const CONFIG_N_PORT = "port";

    const CONFIG_N_DISABLED = "disabled";

    private $tag_prefix;
    private $threhold;
    private $log_times;
    private $logs = array();
    private $logger;
    private $disabled;

    public function __construct() {

        $disabled = @APF::get_instance()->get_config(self::CONFIG_N_DISABLED, self::CONFIG_F_LOGGER);
        $this->disabled = (bool) $disabled;

        if ($disabled) {
            return;
        }

        $threhold = @intval(APF::get_instance()->get_config(self::CONFIG_N_THREHOLD, self::CONFIG_F_LOGGER));
        $this->threhold = $threhold ? $threhold : 10;

        $tag_prefix = @APF::get_instance()->get_config(self::CONFIG_N_TAG_PREFIX, self::CONFIG_F_LOGGER);
        $this->tag_prefix = $tag_prefix ? $tag_prefix : '';

        $host = @(APF::get_instance()->get_config(self::CONFIG_N_HOST, self::CONFIG_F_LOGGER));
        $port = @(APF::get_instance()->get_config(self::CONFIG_N_PORT, self::CONFIG_F_LOGGER));
        $this->logger = FluentLogger::open($host, $port);

        APF::get_instance()->register_shutdown_function(array($this, 'shutdown'));
    }

    public function __destruct() {
    }

    /**
     * @param tag string
     * @param data mixed string or array
     * @param force boolean write log immediately
     */
    public function log($tag, $data, $force = FALSE) {

        if ($this->disabled) {
            return TRUE;
        }

        $this->logs[] = array($tag, $data);
        $this->log_times ++;

        if (($this->log_times >= $this->threhold) || $force) {
            $this->flush();
        }

        return TRUE;
    }

    /**
     * flush log
     */
    protected function flush() {
        foreach ($this->logs as $log) {
            $this->logger->post($this->tag_prefix . $log[0], $log[1]);
        }

        $this->logs = array();
        $this->log_times = 0;
    }


    /**
     * shut down hook
     * flush logs
     */
    public function shutdown() {
        if ($this->log_times > 0) {
            $this->flush();
        }
    }

}
