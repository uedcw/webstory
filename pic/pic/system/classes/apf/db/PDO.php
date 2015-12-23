<?php
apf_require_class("APF_DB_PDOStatement");
apf_require_class("APF_Exception_SqlException");
class APF_DB_PDO extends PDO {
    private $i = 0;
    public function __construct($dsn, $username="", $password="", $driver_options=array()) {
        /*if ($username == 'caixh') {
            APF::get_instance()->get_logger()->error("PDO error:" . $dsn . "," . $_SERVER['REQUEST_URI']);
        }*/
        parent::__construct($dsn, $username, $password, $driver_options);
        $this->setAttribute(PDO::ATTR_STATEMENT_CLASS, array('APF_DB_PDOStatement', array($this)));
        $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
        $this->setAttribute(PDO::MYSQL_ATTR_USE_BUFFERED_QUERY, true);
    }

    public function exec($statement) {
        if(isset($this->dsn) and stristr($this->dsn,'anjuke_db') and preg_match('/\sajk_propertys\s/i',$statement)) {
            if(stristr($statement,'select CITYID') or stristr($statement,'insert') or stristr($statement,'update ')) {
            } else {
                $dir='/home/www/logs/propsql';
                if(!is_dir($dir)){
                    mkdir($dir,0755,true);

                    $content='-=-=-=-=-=-=-=-=-=-='.PHP_EOL;
                    $content.='DSN: '.$this->dsn.PHP_EOL;
                    $content.='URI: '.$_SERVER['REQUEST_URI'].PHP_EOL;
                    $content.='JOB: '.var_export($_SERVER['argv'],true).PHP_EOL;
                    $content.='SQL: '.$statement.PHP_EOL;
                    file_put_contents($dir.'/'.date('Ymd'),$content,FILE_APPEND);
                }
            }
        }

        if (APF::get_instance()->is_debug_enabled()) {
            APF::get_instance()->debug(__CLASS__ .'['. $this->name .']'. "->exec: $statement");
        }

        $logger = APF::get_instance()->get_logger();
        $logger->debug(__CLASS__, '['. $this->name .']->exec: ', $statement);
        $stmt = parent::exec($statement);

        if ($stmt instanceof PDOStatement) {
            $stmt->setFetchMode($this->default_fetch_mode);
        } else {
            $error_info = parent::errorInfo();
            if (parent::errorCode() !== '00000') {
                throw new APF_Exception_SqlException(parent::errorCode(),$this->get_name().' | '.$this->config['dsn'].' | '.$statement.' | '.join(' | ',$error_info));
            }
        }

        return $stmt;
    }

    private $_sql = null;
    public function prepare($statement, $driver_options=array()) {
        if(isset($this->dsn) and stristr($this->dsn,'anjuke_db') and preg_match('/\sajk_propertys\s/i',$statement)){
            if(stristr($statement,'select CITYID') or stristr($statement,'insert') or stristr($statement,'update ')){

            }else{
                $dir='/home/www/logs/propsql';
                if(!is_dir($dir)){
                    mkdir($dir,0755,true);
                }
                $content='-=-=-=-=-=-=-=-=-=-='.PHP_EOL;
                $content.='DSN: '.$this->dsn.PHP_EOL;
                $content.='URI: '.$_SERVER['REQUEST_URI'].PHP_EOL;
                $content.='JOB: '.var_export($_SERVER['argv'],true).PHP_EOL;
                $content.='SQL: '.$statement.PHP_EOL;
                file_put_contents($dir.'/'.date('Ymd'),$content,FILE_APPEND);
            }
        }

        //add by jackie for record SQL
        APF::get_instance()->pf_benchmark("sql",array($this->i=>$statement));
        $stmt = parent::prepare($statement, $driver_options);
        if ($stmt instanceof PDOStatement) {
            $stmt->setFetchMode($this->default_fetch_mode);
        }
        //add by hexin for record SQL execute time
        $stmt->set_i($this->i);
        $this->i++;
        $stmt->_sql = $statement;
        return $stmt;
    }

    public function query($statement, $pdo=NULL, $object=NULL) {
        if (APF::get_instance()->is_debug_enabled()) {
            APF::get_instance()->debug(__CLASS__ .'['. $this->config['dsn'] .'|'.$this->name.']'. "->query: $statement");
        }
        $logger = APF::get_instance()->get_logger();
        $logger->debug(__CLASS__, '['. $this->name .']->query: ', $statement);
        if($pdo != NULL && $object != NULL){
            $stmt = parent::query($statement, $pdo, $object);
        }else{
            $stmt = parent::query($statement);
        }
            if ($stmt instanceof PDOStatement) {
            $stmt->setFetchMode($this->default_fetch_mode);
        }
        return $stmt;
    }

    public function set_name($name) {
        $this->name = $name;
        $this->config = APF::get_instance()->get_config($name, "database");
    }

    public function get_name() {
        return $this->name;
    }

    private $name;

    public $config;

    public function set_default_fetch_mode($mode) {
        $this->default_fetch_mode = $mode;
    }

    private $default_fetch_mode = PDO::FETCH_BOTH;
}
