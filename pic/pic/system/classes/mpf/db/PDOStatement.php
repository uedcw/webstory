<?php
mpf_require_class('MPF_Performance');
class MPF_DB_PDOStatement extends PDOStatement {
    private $i = 0;
    protected function __construct($pdo) {
        $this->pdo = $pdo;
    }

    protected $pdo;

    public function execute($input_parameters=NULL) {
        if (MPF::get_instance()->is_debug_enabled()) {
            MPF::get_instance()->debug(__CLASS__ .'['. $this->pdo->config['dsn'] .'|'.$this->pdo->get_name().']'. "->execute: " . $this->queryString);
        }
        $logger = MPF::get_instance()->get_logger();
        $logger->debug(__CLASS__, '['. $this->pdo->get_name() .']->execute: ', $this->queryString);
        MPF::get_instance()->pf_benchmark_inc_begin('dbtime');
        $start = microtime(true);
        $ret = parent::execute($input_parameters);
        $end = microtime(true);
        MPF::get_instance()->pf_benchmark_inc_end('dbtime');
        //add by hexin for record SQL execute time
        MPF::get_instance()->pf_benchmark("sql_time",array($this->i=>$end-$start));
        // 按照惯用格式记录sql执行时间和占用内存
        // added by htlv
        $tmp_time = $end - $start;
        $tmp_mem = memory_get_usage();
        mpf_require_class('MPF_Performance');
        MPF::get_instance()->pf_benchmark("sql_time_af",array($this->i=>array(
            'sql' => $this->_sql,
            MPF_Performance::MESSAGE_TIME => $tmp_time,
            MPF_Performance::MESSAGE_MEMORY => $tmp_mem
        )));
        if (!$ret) {
            $error_info = parent::errorInfo();
            /**
             * remove duplicated error log
            $logger->error(__CLASS__, '['. $this->pdo->get_name() .']->execute: ', $this->queryString);
            $_error_info = preg_replace("#[\r\n \t]+#",' ',print_r($error_info,true));
            $logger->error(__CLASS__, '['. $this->pdo->get_name() .']->execute: ', $_error_info);
            */
            if (parent::errorCode() !== '00000') {
                throw new MPF_Exception_SqlException(parent::errorCode(),$this->pdo->get_name().' | '.$this->pdo->config['dsn'].' | '.$this->queryString.' | '.join(' | ',$error_info));
            }
        }

        return $ret;
    }

    public function set_i($i){
        $this->i = intval($i);
    }
}