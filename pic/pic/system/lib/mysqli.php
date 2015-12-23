<?php

/**
 * $Id: mysqli.php 22009 2014-08-23 09:28:21Z microhuang $
 ============================================================================
 * 三大目标：
 * 1、语句来源可追溯；
 * 2、灵活的数据拆分；
 * 3、对底层服务透明；
 * ==========================================================================
 */

class cls_mysqli
{
    var $max_cache_time = 300; // 最大的缓存时间，以秒为单位
    var $cache_dir      = 'temp/query_caches/';
    var $query_log      = array();
    var $root_path      = '';
    var $current_sql    =''; //当前的SQL

    var $error_message  = array();
    var $version        = '';
    var $starttime      = 0;
    var $timeline       = 0;
    var $timezone       = 0;

    /* Private attributes */
    var $_link_id       = NULL;
    var $_stmt          = NULL;
    var $_settings      = array();
    var $_query_count   = 0;
    var $_dbhash        = '';
    var $_platform      = '';

    var $_sql_rewrite=array();
    var $_links=array();

    var $mysql_config_cache_file_time = 0;
    var $mysql_disable_cache_tables = array(); // 不允许被缓存的表，遇到将不会进行缓存
    
    private static $instance;
    public static function &get_instance() {
        if (!self::$instance) {
            self::$instance = new cls_mysqli();
        }
        return self::$instance;
    }
    function __construct()
    {
        $this->cls_mysqli();
    }

    /**
     * db构造函数
     *
     * @author  wj
     *
     * @return  void
     **/
    function cls_mysqli()
    {
        if (!defined('DB_PREFIX'))
        {
            $this->ErrorMsg('Have not define DB_PREFIX');
        }
        $this->cache_dir = WEB_PATH . '/temp/query_caches/';
        $this->root_path = WEB_PATH . '/';

        include_once(WEB_PATH . '/data/sql.php');
        $sql_rewrite && $this->_sql_rewrite=$sql_rewrite;
    }

    /**
     * 连接数据库
     *
     * author wj
     * param  string  $dbhost   数据库主机名
     * param  string  $dbuser   数据库用户名
     * param  string  $dbpw     数据库密码
     * param  string  $charset  数据库字符集
     * param  string  $pconnect 持久链接,1为开启,0为关闭
     * param  string  $quiet    安静模式,1为开启,0为关闭
     * return bool
     **/
    function connect($dbhost, $dbport, $dbuser, $dbpw, $dbname = '', $charset = 'utf8', $pconnect = 0, $quiet = 0)
    {
        if ($pconnect)
        {
            if (!($this->_link_id = @mysqli_pconnect('p:'.$dbhost, $dbuser, $dbpw, $dbname, $dbport)))
            {
                if (!$quiet)
                {
                    $this->ErrorMsg();
                }

                return false;
            }
        }
        else
        {
            $this->_link_id = mysqli_connect($dbhost, $dbuser, $dbpw, $dbname, $dbport);
            if (PHP_VERSION < '4.2')
            {
                mt_srand((double)microtime() * 1000000); // 对 PHP 4.2 以下的版本进行随机数函数的初始化工作
            }

            if (!$this->_link_id)
            {
                if (!$quiet)
                {
                    $this->ErrorMsg();
                }

                return false;
            }
        }

        $this->_dbhash  = md5(WEB_PATH . $dbhost . $dbuser . $dbpw . $dbname);
        $this->version  = mysqli_get_server_info($this->_link_id);

        /* 如果mysql 版本是 4.1+ 以上，需要对字符集进行初始化 */
        if ($this->version > '4.1')
        {
            if ($charset != 'latin1')
            {
                mysqli_query($this->_link_id, "SET character_set_connection=$charset, character_set_results=$charset, character_set_client=binary");
            }
            if ($this->version > '5.0.1')
            {
                mysqli_query($this->_link_id, "SET sql_mode=''");
            }
        }

        $sqlcache_config_file = $this->cache_dir . 'config_file_' . $this->_dbhash . '.php';

        if (is_file($sqlcache_config_file))
        {
            include($sqlcache_config_file);
        }

        $this->starttime = time();

        if ($this->max_cache_time && $this->starttime > $this->mysql_config_cache_file_time + $this->max_cache_time)
        {
            if ($dbhost != '.')
            {
                (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN')?$this->_platform = 'WINDOWS':$this->_platform = 'OTHER';
                /*$result = mysqli_query($this->_link_id, "SHOW VARIABLES LIKE 'basedir'");
                $row    = mysqli_fetch_assoc($result);
                if (!empty($row['Value']{1}) && $row['Value']{1} == ':' && !empty($row['Value']{2}) && $row['Value']{2} == "\\")
                {
                    $this->_platform = 'WINDOWS';
                }
                else
                {
                    $this->_platform = 'OTHER';
                }*/
            }
            else
            {
                $this->_platform = 'WINDOWS';
            }

            if ($this->_platform == 'OTHER' &&
                ($dbhost != '.' && strtolower($dbhost) != 'localhost:3306' && $dbhost != '127.0.0.1:3306') ||
                (PHP_VERSION >= '5.1' && date_default_timezone_get() == 'UTC'))
            {
                $result = mysqli_query($this->_link_id, "SELECT UNIX_TIMESTAMP() AS timeline, UNIX_TIMESTAMP('" . date('Y-m-d H:i:s', $this->starttime) . "') AS timezone");
                $row    = mysqli_fetch_assoc($result);

                if ($dbhost != '.' && strtolower($dbhost) != 'localhost:3306' && $dbhost != '127.0.0.1:3306')
                {
                    $this->timeline = $this->starttime - $row['timeline'];
                }

                if (PHP_VERSION >= '5.1' && date_default_timezone_get() == 'UTC')
                {
                    $this->timezone = $this->starttime - $row['timezone'];
                }
            }

            $content = '<' . "?php\r\n" .
                       '$this->mysql_config_cache_file_time = ' . $this->starttime . ";\r\n" .
                       '$this->timeline = ' . $this->timeline . ";\r\n" .
                       '$this->timezone = ' . $this->timezone . ";\r\n" .
                       '$this->_platform = ' . "'" . $this->_platform . "';\r\n?" . '>';

            @file_put_contents($sqlcache_config_file, $content, LOCK_EX);
        }

        /* 选择数据库 */
        if ($dbname)
        {
            if (mysqli_select_db($this->_link_id, $dbname) === false )
            {
                if (!$quiet)
                {
                    $this->ErrorMsg();
                }

                return false;
            }
            else
            {
                return true;
            }
        }
        else
        {
            return true;
        }
    }

    function select_database($dbname)
    {
        return mysqli_select_db($this->_link_id, $dbname);
    }

    function set_mysql_charset($charset)
    {
        /* 如果mysql 版本是 4.1+ 以上，需要对字符集进行初始化 */
        if ($this->version > '4.1')
        {
            if (in_array(strtolower($charset), array('gbk', 'big5', 'utf-8', 'utf8')))
            {
                $charset = str_replace('-', '', $charset);
            }
            if ($charset != 'latin1')
            {
                mysqli_query($this->_link_id, "SET character_set_connection=$charset, character_set_results=$charset, character_set_client=binary");
            }
        }
    }

    function fetch_array($query, $result_type = MYSQLI_ASSOC)
    {
        return mysqli_fetch_array($query, $result_type);
    }

    function fetch_assoc($query)
    {
        return mysqli_fetch_assoc($query);
    }

    function get_current_sql(){
        return $this->current_sql;
    }

    function sql_rewrite(&$sql){
        /*$this->_sql_rewrite=array(
                DB_CONFIG=>array(
                        array('/(?i)(SELECT mol_weight FROM search_moldata WHERE mol_id = [0-9]+ LIMIT )(1)/',array(2=>'100')),
                ),
                DB_SLAVE=>array(
                        array('/(?i)^(select )([\s\S]{1,})/',),   //保留内容必须放在括号中
                ),
        );*/
        $cfg=null;
        foreach($this->_sql_rewrite as $server=>$pattern){
                foreach($pattern as $k=>$v){
                        if(preg_match($v[0],$sql,$matches)&&preg_last_error()==PREG_NO_ERROR){
                                $matches[0]=null;
                                if($v[1]){foreach($v[1] as $vk=>$vv){if($matches[$vk])$matches[$vk]=$vv;}}
                                $sql=implode('',$matches);
                                $cfg=$server;
                                break 2;
                        }
                        elseif(preg_last_error()!=PREG_NO_ERROR)
                        {
                            trigger_error('Rewrite error', E_USER_ERROR);
                        }
                }
        }
        if(!$cfg){
            if (!defined('DB_CONFIG'))
            {
                trigger_error('Hacking attempt', E_USER_ERROR);
            }
            $cfg = DB_CONFIG;
        }
        $cfg=array_map('trim',explode("\n",$cfg));
        $this->_link_id=null;
        foreach ($cfg as $c) {
            if($this->_links[$c]!==null){$this->_link_id=$this->_links[$c];$cfg=$c;break;}
        }
        if ($this->_link_id === NULL)
        {
            if(count($cfg)>1){
            $cfg=$cfg[rand(1,count($cfg))-1];
            }else{
            $cfg=$cfg[0];
            }
            $this->_settings = parse_url($cfg);
            if (empty($this->_settings['pass']))
            {
                $this->_settings['pass'] = '';
            }
            else
            {
                $this->_settings['pass'] = urldecode($this->_settings['pass']);
            }
            $this->_settings ['user'] = urldecode($this->_settings['user']);

            if (empty($this->_settings['path']))
            {
                trigger_error('Invalid database name.', E_USER_ERROR);
            }
            else
            {
                $this->_settings['path'] = str_replace('/', '', $this->_settings['path']);
            }
            list($this->_settings['pconnect'],$this->_settings['host'])=explode(':',$this->_settings['host']);
            if(!$this->_settings['host']){$this->_settings['host']=$this->_settings['pconnect'];$this->_settings['pconnect']=null;}
            $this->_settings['charset'] = (defined('CHARSET')) ? CHARSET : 'utf8';
            $this->connect($this->_settings['host'], $this->_settings['port'], $this->_settings['user'], $this->_settings['pass'], $this->_settings['path'], $this->_settings['charset'], $this->_settings['pconnect']);
            $this->_links[$cfg]=$this->_link_id;
            $this->_settings = array();
        }
        return $cfg;
    }

    function stmt_init()
    {
        $this->_stmt=mysqli_stmt_init($this->_link_id);
    }
    function prepare($sql)
    {
        return mysqli_stmt_prepare($this->_stmt,$sql);
    }    
    private function _pass_by_reference(&$arr)
    {
        $refs = array();
        foreach($arr as $key => $value)
        {
            $refs[$key] = &$arr[$key];   
        }
        return $refs;
    }
    function bind_param(&$arr)
    {
        $arr=func_get_args();
        if($arr)
        {
            $arr=array_unshift($arr,$this->_stmt);
            call_user_func_array('mysqli_stmt_bind_param',$this->_pass_by_reference($arr));
        }
    }
    function execute(){
        mysqli_stmt_execute($this->_stmt);
    }
    function bind_result($result)
    {
        mysqli_stmt_bind_result($this->_stmt,$result);
    }
    function fetch()
    {
        return mysqli_stmt_fetch($this->_stmt);
    }
    
    function query($sql, $type = '', $times=0)
    {
        //print_r($sql);echo '<br>';echo '<br>';print_r($type);exit;
        $cfg=$this->sql_rewrite($sql);
        //var_dump($cfg);
        //var_dump($sql);
        /*if ($this->_link_id === NULL)
        {
            $this->connect($this->_settings['host'], $this->_settings['port'], $this->_settings['user'], $this->_settings['pass'], $this->_settings['path'], $this->_settings['charset'], $this->_settings['pconnect']);
            $this->_links[$cfg]=$this->_link_id;
            $this->_settings = array();
        }*/

        $this->_query_count++;
        if ($this->_query_count <= 99)
        {
            $this->query_log[] = $sql;
        }
        elseif ($this->_query_count == 100)
        {
                        $this->query_log[100] = '...';
                }
                
        /* 当当前的时间大于类初始化时间的时候，自动执行 ping 这个自动重新连接操作 */
        if (PHP_VERSION >= '4.3' && time() > $this->starttime + 1)
        {
            if(mysqli_ping($this->_link_id)){$this->starttime = time();}
        }

        $sql = $this->prefix($sql); // 处理表名前缀
                $this->current_sql=$sql;
                //echo '<br>';print_r($sql);echo '<br>';
        if (!($query = mysqli_query($this->_link_id, $sql)))
        {
            $errno = mysqli_connect_errno();
            $error = mysqli_connect_error();
            if (($errno == 126 || $errno == 145 || $errno == 1062 || $errno == 1194 || $errno == 1034 || $errno == 1035)
                && $times == 0 && (preg_match('/\'\.?\\\\?([\w_]+)\\\\?([\w_]+)\'/', $error, $match) !== false))
            {
                //echo "REPAIR TABLE $match[2]<br>";
                /* 如果错误类型为可修复，则尝试修复这个表 */
                if (isset($match[2]))
                {
                    mysqli_query("REPAIR TABLE $match[2]");
                    $query = $this->query($sql, $type, 1);
                }
            }
            elseif ($errno == 2006)
            {
                $this->ErrorMsg();exit;
            }
            else
            {
                if ($type != 'SILENT')
                {
                    $trace  = debug_backtrace();
                    $msg    = 'MySQL Error[' .mysqli_connect_errno($this->_link_id). ']: ' . mysqli_connect_error($this->_link_id). "\nMySQL Query:" .$sql;
                    $msg    .= "\nWrong File:  " .$trace[0]['file']. "[" .$trace[0]['line']. "]";

                    trigger_error($msg, E_USER_ERROR);

                    return false;
                }
            }
        }

        /* 记录sql log */
        if (defined('DEBUG_MODE') && (DEBUG_MODE & 8) == 8)
        {
            $logfilename = $this->root_path . 'temp/logs/mysql_query_' . $this->_dbhash . '_' . date('Y_m_d') . '.log';
            $str = $sql . "\n\n";
            $str .= json_encode($_SERVER) . "\n\n";

            if (PHP_VERSION >= '5.0')
            {
                file_put_contents($logfilename, $str, FILE_APPEND|LOCK_EX);
            }
            else
            {
                $fp = @fopen($logfilename, 'ab+');
                if ($fp)
                {
                    fwrite($fp, $str);
                    fclose($fp);
                }
            }
        }

        return $query;
    }

    //表名解析漏洞？
    function prefix($sql)
    {
        return preg_replace('/\s\`ecm_(.+?)\`([,|\s]?)/', ' ' .DB_PREFIX. '$1$2', $sql);
    }

    function affected_rows()
    {
        return mysqli_affected_rows($this->_link_id);
    }

    function error()
    {
        return mysqli_connect_error($this->_link_id);
    }

    function errno()
    {
        return mysqli_connect_errno($this->_link_id);
    }

    function result($query, $row)
    {
        return @mysqli_result($query, $row);
    }

    function num_rows($query)
    {
        return mysqli_num_rows($query);
    }

    function num_fields($query)
    {
        return mysqli_num_fields($query);
    }

    function free_result($query)
    {
        return mysqli_free_result($query);
    }

    function insert_id()
    {
        return mysqli_insert_id($this->_link_id);
    }

    function fetchRow($query)
    {
        return mysqli_fetch_assoc($query);
    }

    function fetch_fields($query)
    {
        return mysqli_fetch_field($query);
    }

    function version()
    {
        return $this->version;
    }

    function ping()
    {
        if (PHP_VERSION >= '4.3')
        {
            return mysqli_ping($this->_link_id);
        }
        else
        {
            return false;
        }
    }

    function escape_string($unescaped_string)
    {
        return mysqli_real_escape_string($this->_link_id,$unescaped_string);
    }

    function close()
    {
        return mysqli_close($this->_link_id);
    }

    function ErrorMsg($message = '', $sql = '')
    {
        if ($message)
        {
            echo "<b>ECMall info</b>: $message\n\n";
        }
        else
        {
            static $last_errno = null;
            $error = mysqli_connect_error();
            $error_no = mysqli_connect_errno();
            if ($last_errno == $error_no)
            {
                exit;
            }
            if ($last_errno === null)
            {
                $last_errno = $error_no;
            }
            //Lang::load(lang_file('common'));

            echo "<b>MySQL server error report:</b><br />";
            echo "Error:",$error, "<br />";
            echo "Errno:", $error_no, "<br />";
            //echo '<a href="http://ecmall.shopex.cn/help/faq.php?type=mysql&amp;dberrno=' . $error_no . '&amp;dberror=' . urlencode($error) . '" target="_blank">'. Lang::get('mysql_error_report') . '</a>';
        }

        exit;
    }

/* 仿真 Adodb 函数 */
    function selectLimit($sql, $num, $start = 0)
    {
        if ($start == 0)
        {
            $sql .= ' LIMIT ' . $num;
        }
        else
        {
            $sql .= ' LIMIT ' . $start . ', ' . $num;
        }

        return $this->query($sql);
    }

    function getOne($sql, $limited = false)
    {
        if ($limited == true)
        {
            $sql = trim($sql . ' LIMIT 1');
        }

        $res = $this->query($sql);
        if ($res !== false)
        {
            $row = mysqli_fetch_row($res);

            if ($row !== false)
            {
                return $row[0];
            }
            else
            {
                return '';
            }
        }
        else
        {
            return false;
        }
    }

    function getOneCached($sql, $cached = 'FILEFIRST')
    {
        $sql = trim($sql . ' LIMIT 1');

        $cachefirst = ($cached == 'FILEFIRST' || ($cached == 'MYSQLFIRST' && $this->_platform != 'WINDOWS')) && $this->max_cache_time;
        if (!$cachefirst)
        {
            return $this->getOne($sql, true);
        }
        else
        {
            $result = $this->getSqlCacheData($sql, $cached);
            if (empty($result['storecache']) == true)
            {
                return $result['data'];
            }
        }

        $arr = $this->getOne($sql, true);

        if ($arr !== false && $cachefirst)
        {
            $this->setSqlCacheData($result, $arr);
        }

        return $arr;
    }

    function getAll($sql)
    {
        $res = $this->query($sql);
        if ($res !== false)
        {
            $arr = array();
            while ($row = mysqli_fetch_assoc($res))
            {
                $arr[] = $row;
            }
            return $arr;
        }
        else
        {
            return false;
        }
    }
    /**
     *  以主键索引形式返回结果集
     *
     *  @author Garbin
     *  @param  string $sql_statement
     *  @return array
     */
    function getAllWithIndex($sql_statement, $index_key)
    {
        $query = $this->query($sql_statement, 'UNBUFFERED');
        $rtn = array();
        while ($row = $this->fetch_array($query))
        {
            if (is_array($index_key))
            {
                $index = '';
                foreach ($index_key as $k)
                {
                    $index .= $index == '' ? $row[$k] : '_' . $row[$k];
                }
                $rtn[$index]           = $row;
            }
            else
            {
                $rtn[$row[$index_key]] = $row;
            }
        }

        return $rtn;
    }

    function getAllCached($sql, $cached = 'FILEFIRST')
    {
        $cachefirst = ($cached == 'FILEFIRST' || ($cached == 'MYSQLFIRST' && $this->_platform != 'WINDOWS')) && $this->max_cache_time;
        if (!$cachefirst)
        {
            return $this->getAll($sql);
        }
        else
        {
            $result = $this->getSqlCacheData($sql, $cached);
            if (empty($result['storecache']) == true)
            {
                return $result['data'];
            }
        }

        $arr = $this->getAll($sql);

        if ($arr !== false && $cachefirst)
        {
            $this->setSqlCacheData($result, $arr);
        }

        return $arr;
    }

    function getRow($sql, $limited = false)
    {
        if ($limited == true)
        {
            $sql = trim($sql . ' LIMIT 1');
        }

        $res = $this->query($sql);
        if ($res !== false)
        {
            return mysqli_fetch_assoc($res);
        }
        else
        {
            return false;
        }
    }

    function getRowCached($sql, $cached = 'FILEFIRST')
    {
        $sql = trim($sql . ' LIMIT 1');

        $cachefirst = ($cached == 'FILEFIRST' || ($cached == 'MYSQLFIRST' && $this->_platform != 'WINDOWS')) && $this->max_cache_time;
        if (!$cachefirst)
        {
            return $this->getRow($sql, true);
        }
        else
        {
            $result = $this->getSqlCacheData($sql, $cached);
            if (empty($result['storecache']) == true)
            {
                return $result['data'];
            }
        }

        $arr = $this->getRow($sql, true);

        if ($arr !== false && $cachefirst)
        {
            $this->setSqlCacheData($result, $arr);
        }

        return $arr;
    }

    function getCol($sql)
    {
        $res = $this->query($sql);
        if ($res !== false)
        {
            $arr = array();
            while ($row = mysqli_fetch_row($res))
            {
                $arr[] = $row[0];
            }

            return $arr;
        }
        else
        {
            return false;
        }
    }

    function getColCached($sql, $cached = 'FILEFIRST')
    {
        $cachefirst = ($cached == 'FILEFIRST' || ($cached == 'MYSQLFIRST' && $this->_platform != 'WINDOWS')) && $this->max_cache_time;
        if (!$cachefirst)
        {
            return $this->getCol($sql);
        }
        else
        {
            $result = $this->getSqlCacheData($sql, $cached);
            if (empty($result['storecache']) == true)
            {
                return $result['data'];
            }
        }

        $arr = $this->getCol($sql);

        if ($arr !== false && $cachefirst)
        {
            $this->setSqlCacheData($result, $arr);
        }

        return $arr;
    }

    function autoExecute($table, $field_values, $mode = 'INSERT', $where = '', $querymode = '')
    {
        $field_names = $this->getCol('DESC ' . $table);

        $sql = '';
        if ($mode == 'INSERT')
        {
            $fields = $values = array();
            foreach ($field_names AS $value)
            {
                if (array_key_exists($value, $field_values) == true)
                {
                    $fields[] = $value;
                    $values[] = "'" . $field_values[$value] . "'";
                }
            }

            if (!empty($fields))
            {
                $sql = 'INSERT INTO ' . $table . ' (' . implode(', ', $fields) . ') VALUES (' . implode(', ', $values) . ')';
            }
        }
        else
        {
            $sets = array();
            foreach ($field_names AS $value)
            {
                if (array_key_exists($value, $field_values) == true)
                {
                    $sets[] = $value . " = '" . $field_values[$value] . "'";
                }
            }

            if (!empty($sets))
            {
                $sql = 'UPDATE ' . $table . ' SET ' . implode(', ', $sets) . ' WHERE ' . $where;
            }
        }

        if ($sql)
        {
            return $this->query($sql, $querymode);
        }
        else
        {
            return false;
        }
    }

    function autoReplace($table, $field_values, $update_values, $where = '', $querymode = '')
    {
        $field_descs = $this->getAll('DESC ' . $table);

        $primary_keys = array();
        foreach ($field_descs AS $value)
        {
            $field_names[] = $value['Field'];
            if ($value['Key'] == 'PRI')
            {
                $primary_keys[] = $value['Field'];
            }
        }

        $fields = $values = array();
        foreach ($field_names AS $value)
        {
            if (array_key_exists($value, $field_values) == true)
            {
                $fields[] = $value;
                $values[] = "'" . $field_values[$value] . "'";
            }
        }

        $sets = array();
        foreach ($update_values AS $key => $value)
        {
            if (array_key_exists($key, $field_values) == true)
            {
                if (is_int($value) || is_float($value))
                {
                    $sets[] = $key . ' = ' . $key . ' + ' . $value;
                }
                else
                {
                    $sets[] = $key . " = '" . $value . "'";
                }
            }
        }

        $sql = '';
        if (empty($primary_keys))
        {
            if (!empty($fields))
            {
                $sql = 'INSERT INTO ' . $table . ' (' . implode(', ', $fields) . ') VALUES (' . implode(', ', $values) . ')';
            }
        }
        else
        {
            if ($this->version() >= '4.1')
            {
                if (!empty($fields))
                {
                    $sql = 'INSERT INTO ' . $table . ' (' . implode(', ', $fields) . ') VALUES (' . implode(', ', $values) . ')';
                    if (!empty($sets))
                    {
                        $sql .=  'ON DUPLICATE KEY UPDATE ' . implode(', ', $sets);
                    }
                }
            }
            else
            {
                if (empty($where))
                {
                    $where = array();
                    foreach ($primary_keys AS $value)
                    {
                        if (is_numeric($value))
                        {
                            $where[] = $value . ' = ' . $field_values[$value];
                        }
                        else
                        {
                            $where[] = $value . " = '" . $field_values[$value] . "'";
                        }
                    }
                    $where = implode(' AND ', $where);
                }

                if ($where && (!empty($sets) || !empty($fields)))
                {
                    if (intval($this->getOne("SELECT COUNT(*) FROM $table WHERE $where")) > 0)
                    {
                        if (!empty($sets))
                        {
                            $sql = 'UPDATE ' . $table . ' SET ' . implode(', ', $sets) . ' WHERE ' . $where;
                        }
                    }
                    else
                    {
                        if (!empty($fields))
                        {
                            $sql = 'REPLACE INTO ' . $table . ' (' . implode(', ', $fields) . ') VALUES (' . implode(', ', $values) . ')';
                        }
                    }
                }
            }
        }

        if ($sql)
        {
            return $this->query($sql, $querymode);
        }
        else
        {
            return false;
        }
    }

    function setMaxCacheTime($second)
    {
        $this->max_cache_time = $second;
    }

    function getMaxCacheTime()
    {
        return $this->max_cache_time;
    }

    /**
     * 获取数据记录集缓存
     *
     * author redstone
     * param  string  $sql     查询语句
     * param  string  $cached  缓存选项
     * return array
     **/
    function getSqlCacheData($sql, $cached = '')
    {
        $sql = trim($sql);

        $result = array();
        $result['filename'] = $this->cache_dir . abs(crc32($this->_dbhash . $sql)) . '_' . md5($this->_dbhash . $sql) . '.php';
        if (file_exists($result['filename']) && ($data = file_get_contents($result['filename'])) && isset($data{23}))
        {
            $filetime = substr($data, 13, 10);
            $data     = substr($data, 23);

            if (($cached == 'FILEFIRST' && time() > $filetime + $this->max_cache_time) ||
                ($cached == 'MYSQLFIRST' && $this->table_lastupdate($this->get_table_name($sql)) > $filetime))
            {
                $result['storecache'] = true;
            }
            else
            {
                $result['data'] = @unserialize($data);
                if ($result['data'] === false)
                {
                    $result['storecache'] = true;
                }
                else
                {
                    $result['storecache'] = false;
                }
            }
        }
        else
        {
            $result['storecache'] = true;
        }

        return $result;
    }

    function setSqlCacheData($result, $data)
    {
        if ($result['storecache'] === true && $result['filename'])
        {
            @file_put_contents($result['filename'], '<?php exit;?>' . time() . serialize($data), LOCK_EX);
            clearstatcache();
        }
    }

    /* 获取 SQL 语句中最后更新的表的时间，有多个表的情况下，返回最新的表的时间 */
    function table_lastupdate($tables)
    {
        if ($this->_link_id === NULL)
        {
            $this->connect($this->_settings['host'], $this->_settings['user'], $this->_settings['pass'], $this->_settings['path'], $this->_settings['charset'], $this->_settings['pconnect']);
            $this->_settings = array();
        }

        $lastupdatetime = '0000-00-00 00:00:00';

        $tables = str_replace('`', '', $tables);
        $this->mysql_disable_cache_tables = str_replace('`', '', $this->mysql_disable_cache_tables);

        foreach ($tables AS $table)
        {
            if (in_array($table, $this->mysql_disable_cache_tables) == true)
            {
                $lastupdatetime = '2037-12-31 23:59:59';

                break;
            }

            if (strpos($table, '.') !== false)
            {
                $tmp = explode('.', $table);
                $sql = 'SHOW TABLE STATUS FROM `' . trim($tmp[0]) . "` LIKE '" . trim($tmp[1]) . "'";
            }
            else
            {
                $sql = "SHOW TABLE STATUS LIKE '" . trim($table) . "'";
            }
            $result = mysqli_query($this->_link_id, $sql);

            $row = mysqli_fetch_assoc($result);
            if ($row['Update_time'] > $lastupdatetime)
            {
                $lastupdatetime = $row['Update_time'];
            }
        }
        $lastupdatetime = strtotime($lastupdatetime) - $this->timezone + $this->timeline;

        return $lastupdatetime;
    }

    function get_table_name($query_item)
    {
        $query_item = trim($query_item);
        $table_names = array();

        /* 判断语句中是不是含有 JOIN */
        if (stristr($query_item, ' JOIN ') == '')
        {
            /* 解析一般的 SELECT FROM 语句 */
            if (preg_match('/^SELECT.*?FROM\s*((?:`?\w+`?\s*\.\s*)?`?\w+`?(?:(?:\s*AS)?\s*`?\w+`?)?(?:\s*,\s*(?:`?\w+`?\s*\.\s*)?`?\w+`?(?:(?:\s*AS)?\s*`?\w+`?)?)*)/is', $query_item, $table_names))
            {
                $table_names = preg_replace('/((?:`?\w+`?\s*\.\s*)?`?\w+`?)[^,]*/', '\1', $table_names[1]);

                return preg_split('/\s*,\s*/', $table_names);
            }
        }
        else
        {
            /* 对含有 JOIN 的语句进行解析 */
            if (preg_match('/^SELECT.*?FROM\s*((?:`?\w+`?\s*\.\s*)?`?\w+`?)(?:(?:\s*AS)?\s*`?\w+`?)?.*?JOIN.*$/is', $query_item, $table_names))
            {
                $other_table_names = array();
                preg_match_all('/JOIN\s*((?:`?\w+`?\s*\.\s*)?`?\w+`?)\s*/i', $query_item, $other_table_names);

                return array_merge(array($table_names[1]), $other_table_names[1]);
            }
        }

        return $table_names;
    }

    /* 设置不允许进行缓存的表 */
    function set_disable_cache_tables($tables)
    {
        if (!is_array($tables))
        {
            $tables = explode(',', $tables);
        }

        foreach ($tables AS $table)
        {
            $this->mysql_disable_cache_tables[] = $table;
        }

        array_unique($this->mysql_disable_cache_tables);
    }

    /*
     * @mysql 事务BEGIN
     * */
    function start_transaction(){
        return mysqli_query($this->_link_id,'BEGIN') or exit(mysqli_connect_error());
    }

    /*
     * @mysql 提交事务
     * */
    function commit(){
        return mysqli_query($this->_link_id,"COMMIT") or exit(mysqli_connect_errorl_error());
    }

    /*
     * @mysql 回滚事务
     * */
    function rollback(){
        return  mysqli_query($this->_link_id,'ROLLBACK') or exit(mysqli_connect_error());
    }
}

?>
