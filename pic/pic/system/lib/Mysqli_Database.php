<?php
/**
 * $Id: mysqli.php 22009 2014-08-23 09:28:21Z microhuang $
 ============================================================================
 * 四大目标：
 * 1、语句来源可追溯；
 * 2、灵活的数据拆分；
 * 3、对底层服务透明；
 * 4、强制参数绑定；
 * ==========================================================================
 * 不支持事物
 * 非mysqlnd不支持字段自动绑定，sql语句中谨慎使用*号
 * 投影表达式字段强烈建议使用规范的别名
 */
 
class Mysqli_Database {
    var $query_log      = array();
    var $_query_count   = 0;
    private $_links     = null;
    private $_sql       = null;
    
    private static $instance;
    public static function &get_instance() {
        if (!self::$instance) {
            self::$instance = new Mysqli_Database();
        }
        return self::$instance;
    }
    /**
     * Set up the database connection
     */
    /*
    public function __construct($sql_rewrite=array()){
        //$this->connection = $this->connect('localhost', 'root', 'molbase1010', 'molbase_local', true);
        //$this->connection = $this->connect('localhost', 'root', '', 'polly', true);
        $this->_sql_rewrite=$sql_rewrite;
    }
    */

    /**
     * Connect to the database, with or without a persistant connection
     * @param  String  $host       Mysql server hostname
     * @param  String  $user       Mysql username
     * @param  String  $pass       Mysql password
     * @param  String  $db         Database to use
     * @param  boolean $persistant Create a persistant connection
     * @return Object              Mysqli
     * phptype(dbsyntax)://username:password@protocol+hostspec/database?option=value
     * mysqi://root@123456@tcp(127.0.0.1:3307)/mall?pconnect=1
     */
    private function connect($host, $user, $pass, $db, $port = '3306', $persistant = true, $charset = 'utf8'){
        $host = $persistant === true ? 'p:'.$host : $host;

        $mysqli = new mysqli($host, $user, $pass, $db, $port);
        
        if($charset!='latin1')
        {
            $mysqli->query("SET character_set_connection=$charset, character_set_results=$charset, character_set_client=binary");
			//$this->set_mysql_charset($charset);
        }
        $mysqli->query("SET sql_mode=''");

        if($mysqli->connect_error)
            throw new Exception('Connection Error: '.$mysqli->connect_error);

        return $mysqli;
    }
    
    var $_sql_rewrite=array();
    private function sql_rewrite($sql)
    {
        $cfg=null;
        if(!$this->_sql_rewrite)
        {
            $this->_sql_rewrite = MPF::get_instance()->get_config("sql_rewrite","sql");
        }
        foreach($this->_sql_rewrite as $server=>$pattern)
        {
                foreach($pattern as $k=>$v){
                        if(preg_match($v[0],$sql,$matches)&&preg_last_error()==PREG_NO_ERROR){
                                $matches[0]=null;
                                if(array_key_exists(1,$v)&&$v[1]){foreach($v[1] as $vk=>$vv){if($matches[$vk])$matches[$vk]=$vv;}}
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
        $this->connection=null;
        foreach ($cfg as $c) {
            if(is_array($this->_links)&&array_key_exists($c,$this->_links)){$this->connection=$this->_links[$c];break;}
        }
        if($this->connection===null)
        {
            if(count($cfg)>1){
            $cfg=$cfg[rand(1,count($cfg))-1];
            }else{
            $cfg=$cfg[0];
            }
            $_settings=parse_url($cfg);
            if (empty($_settings['pass']))
            {
                $_settings['pass'] = '';
            }
            else
            {
                $_settings['pass'] = urldecode($_settings['pass']);
            }
            $_settings ['user'] = urldecode($_settings['user']);
            if (empty($_settings['path']))
            {
                trigger_error('Invalid database name.', E_USER_ERROR);
            }
            else
            {
                $_settings['path'] = str_replace('/', '', $_settings['path']);
            }
            @list($_settings['pconnect'],$_settings['host'])=explode(':',$_settings['host']);
            if(!$_settings['host']){$_settings['host']=$_settings['pconnect'];$_settings['pconnect']=null;}
            $_settings['charset'] = (defined('CHARSET')) ? CHARSET : 'utf8';
            
            $this->connection = $this->connect($_settings['host'], $_settings['user'], $_settings['pass'], $_settings['path'], $_settings['port'], $_settings['pconnect'], $_settings['charset']);
            $this->_links[$cfg] = $this->connection;
            //var_dump($this->connection);exit;
        }
        //echo $cfg;exit;
        return false;
    }

    /**
     * Execute an SQL statement for execution.
     * @param  String $sql An SQL query
     * @return Object      $this
     */
    public function query($sql){
        $matches=array();
        if(preg_match('/(\'.*\')|(\".*\")/',$sql,$matches))
        {
            throw new Exception("SQL Safety Alarm: {$sql}!");
        }
        if($this->_autocommit==false)
        {
            $this->sql_rewrite($sql);
        }
        $this->num_rows = 0;
        $this->affected_rows = -1;

        if(is_object($this->connection)){
            $t=0;
            //$a=array('sq'=>$sql,'start_time'=>time(),'end_time'=>&$t);
            $this->query_log[] = array('sql'=>$sql,'start_time'=>time(),'end_time'=>&$t);
            
            $stmt = $this->connection->query($sql);
            
            $t=time();
            
            # Affected rows has to go here for query :o
            $this->affected_rows = $this->connection->affected_rows;
            $this->stmt = $stmt;
            return $this;
        }
        else {
            throw new Exception;
        }
    }

    /**
     * Prepare an SQL statement
     * @param  String $sql An SQL query
     * @return Object      $this
     */
    public function prepare($sql){
        $this->_sql=$sql;
        $matches=array();
        if(preg_match('/(\'.*\')|(\".*\")/',$sql,$matches))
        {
            throw new Exception('SQL Safety Alarm: {$sql}');
        }
        if($this->_autocommit==false)
        {
            $this->sql_rewrite($sql);
        }
        $this->num_rows = 0;
        $this->affected_rows = -1;

        if(is_object($this->connection)){
            # Ready the stmt
            $this->stmt = $this->connection->prepare($sql);
            if(!is_object($this->stmt))
            {
                throw new Exception("SQL prepare error: {$sql}");
            }
            return $this;
        }
        else {
            throw new Exception;
        }
    }

    /**
     * Escapes the arguments passed in and executes a prepared Query.
     * @param Mixed $var   The value to be bound to the first SQL ?
     * @param Mixed $...   Each subsequent value to be bound to ?
     * @return Object      $this
     */
    public function execute(){
        if(is_object($this->connection) && is_object($this->stmt)){
            # Ready the params
            if(count($args = func_get_args()) > 0){
                $types = array();
                $params = array();

                foreach($args as $arg){
                    if(is_array($arg))
                    {//二维数组传参支持 -- insert多行
                        foreach($arg as $a)
                        {
                    $types[] = is_int($a) ? 'i' : (is_float($a) ? 'd' : 's');
                    $params[] = $this->connection->real_escape_string($a);
                        }
                    }
                    else
                    {
                    $types[] = is_int($arg) ? 'i' : (is_float($arg) ? 'd' : 's');
                    $params[] = $this->connection->real_escape_string($arg);
                    }
                }

                # Stick the types at the start of the params
                array_unshift($params, implode($types));

                # Call bind_param (avoiding the pass_by_reference crap)
                call_user_func_array(
                    array($this->stmt, 'bind_param'),
                    $this->_pass_by_reference($params)
                );
            }

            $t=0;
            $this->query_log[] = array('sql'=>$this->_sql,'start_time'=>time(),'end_time'=>&$t);
            if($this->stmt->execute()){
                $t=time();
                # Affected rows to be run after execute for prepares
                $this->affected_rows = $this->stmt->affected_rows;
                return $this;
            }
            else {
                $t=time();
                throw new Exception;
            }
        }
        else {
            throw new Exception;
        }
    }
    
    /**
     * @param array $arr     field_name...
     * 在非mysqlnd驱动下，无法自动获得字段名称，请提供字段的位置信息。so，虽然可以在sql语句中使用*号，但强烈不建议使用*号。
     */
    public function bind_result($arr)
    {
        $this->_bind_result=$arr;
        return $this;
    }

    /**
     * Fetch all results as an array, the type of array depend on the $method passed through.
     * @param  string  $method     Optional perameter to indicate what type of array to return.'assoc' is the default and returns an accociative array, 'row' returns a numeric array and 'array' returns an array of both.
     * @param  boolean $close_stmt Optional perameter to indicate if the statement should be destroyed after execution.
     * @return Array              Array of database results
     */
    public function results($method = 'assoc', $close_stmt = false, $pri=''){
        if(is_object($this->stmt)){
            $stmt_type = get_class($this->stmt);

            # Grab the result prepare() & query()
            switch($stmt_type){
                case 'mysqli_stmt':
                    if(function_exists('mysqli_stmt_get_result'))  //mysqlnd
                    {
                        $result = $this->stmt->get_result();
                        $close_result = 'close';
                    }
                    else{
                        //处理字段绑定
                        $bind_result=array();
                        //$bind_result = array_fill(0,$this->stmt->field_count,null);
                        for($i=0;$i<$this->stmt->field_count;$i++)
                        {
                            if($this->_bind_result[$i]) $k=$this->_bind_result[$i];
                            else $k=$i;
                            $bind_result[$k]=null;
                        }
                        call_user_func_array(array($this->stmt,'bind_result'),$this->_pass_by_reference($bind_result));
                    }
                    break;

                case 'mysqli_result':
                    $result = $this->stmt;
                    $close_result = 'free';
                    break;

                default:
                    throw new Exception;
            }

            if($result)
            {
                $this->num_rows = $result->num_rows;

                # Set the results type
                switch($method) {
                case 'assoc':
                    $method = 'fetch_assoc';
                    break;

                case 'row':
                    $method = 'fetch_row';
                    break;

                default:
                    $method = 'fetch_array';
                    break;
                }

                $results = array();
                while($row = $result->$method()){
                    if($pri)
                    $results[$row[$pri]] = $row;
                    else
                    $results[] = $row;
                }

                $result->$close_result();
            }
            else
            {
                $this->num_rows = null;
                while($row=$this->stmt->fetch())
                {
                    $tmp=array();
                    foreach($bind_result as $k=>$v)
                    {
                        $tmp[$k]=$v;
                    }
                    if($tmp)
                    {
                        if($pri)
                        $results[$tmp[$pri]] = $tmp;
                        else
                        $results[]=$tmp;
                    }
                }
                $this->num_rows += 1;
            }
            return $results;
        }
        else {
            throw new Exception;
        }
    }

    /**
     * Turns off auto-committing database modifications, starting a new transaction.
     * @return bool Dependant on the how successful the autocommit() call was
     */
    private $_autocommit = false;
    public function start_transaction(){
        if(is_object($this->connection)){
            $this->_autocommit=true;
            return $this->connection->autocommit(false);
            //return $this->connection->query('BEGIN');
        }
    }

    /**
     * Commits the current transaction and turns auto-committing database modifications on, ending transactions.
     * @return bool Dependant on the how successful the autocommit() call was
     */
    public function commit(){
        if(is_object($this->connection)){
            $this->_autocommit=false;
            # Commit!
            if($this->connection->commit()){
                return $this->connection->autocommit(true);
            }
            else {
                $this->connection->autocommit(true);
                throw new Exception;
            }
            //return $this->connection->query('COMMIT');
        }
    }

    /**
     * Rolls back current transaction and turns auto-committing database modifications on, ending transactions.
     * @return bool Dependant on the how successful the autocommit() call was
     */
    public function rollback(){
        if(is_object($this->connection)){
            $this->_autocommit=false;
            # Commit!
            if($this->connection->rollback()){
                return $this->connection->autocommit(true);
            }
            else {
                $this->connection->autocommit(true);
                throw new Exception;
            }
            //return $this->conneciton->query('ROLLBACK');
        }
    }

    /**
     * Return the number of rows in statements result set.
     * @return integer The number of rows
     */
    public function num_rows(){
        return $this->num_rows;
    }

    /**
     * Gets the number of affected rows in a previous MySQL operation.
     * @return integer The affected rows
     */
    public function affected_rows(){
        return $this->affected_rows;
    }

    /**
     * Returns the auto generated id used in the last query.
     * @return integer The last auto generated id
     */
    public function insert_id(){
        if(is_object($this->connection)){
            return $this->connection->insert_id;
        }
    }

    /**
     * Fixes the call_user_func_array & bind_param pass by reference crap.
     * @param  array $arr The array to be referenced
     * @return array      A referenced array
     */
    private function _pass_by_reference(&$arr){
        $refs = array();
        foreach($arr as $key => $value){
            $refs[$key] = &$arr[$key];
        }
        return $refs;
    }
    
    //以下只为兼容性
    
    function fetch_array()
    {
        return $this->stmt->results('array');
    }
    function fetch_assoc()
    {
        return $this->stmt->results('assoc');
    }
    function fetch_row()
    {
        return $this->stmt->results('row');
    }
    function fetch()
    {
        return $this->stmt->results();
    }
    function fetchRow()
    {
        return $this->stmt->results('assoc');
    }
    function fetch_fields()
    {
        return $this->stmt->results('fields');
    }
    
    function getOne($sql)
    {
        return $this->query($sql)->results('array');
    }
    function getAll($sql)
    {
        return $this->query($sql)->results('array');
    }
    function getRow($sql)
    {
        return $this->query($sql)->results('array');
    }
    function getCol($sql)
    {
        return $this->query($sql)->results('array');
    }
}