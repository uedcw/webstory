<?php
/**
 * $Id: MPF.php 26 2010-07-25 14:10:33Z microhuang $
 */
mpf_require_class("MPF_Interceptor");

final class MPF {
    const VERSION = '1.5.20150506';
    //const DEFAULT_BENCHMARK = "MPF";
    const HTML_ID_PREFIX = "mpf_id_";

    /**
     * Returns MPF instance.
     *
     * @return MPF The instance of MPF
     */
    public static function &get_instance() {
        if (!self::$instance) {
            self::$instance = new MPF();
        }
        return self::$instance;
    }

    private static $instance;
    /**
     * MPF主入口，实例化请求类、响应类，然后执行真正的框架流程
     */

    public function run() {
        //爬虫控制
        if($this->get_config('SESSION_START'))
        {
            mpf_require_file('spider.php');
            if(!is_spider()) 
            {
                $session_domain = $this->get_config('SESSION_DOMAIN');
                if(!$session_domain) $session_domain = $_SERVER['SERVER_NAME'];
                ini_set('session.cookie_domain',$session_domain);
                session_start();
            }
        }
        
        $this->prepare();
        
        //$this->process_vews();//Interceptor...

        if (!$this->dispatch()) {
            echo "Error";
        }
    }
    
    /**
     * run() <==> prepare() && dispatch()
     */
    public function prepare(){
        mpf_require_class($this->request_class);
        mpf_require_class($this->response_class);

        $this->request = new $this->request_class();
        $this->response = new $this->response_class();

        mpf_require_class($this->router_class);
        $router = new $this->router_class();
        $this->router = $router;

        return true;
    }
    
    /**
     * 框架真正的主方法。依次执行各个拦截器的before方法、控制器方法、拦截器逆序after方法，
     * 以及页面方法。最后做清理工作。
     */
    public function dispatch() {
        $class = $this->router->mapping();
        $controller = $this->get_controller($class);
        if (!$controller) {
            return false;
        }
        $this->current_controller = $controller;

        $interceptores = @$this->get_config($class, "interceptor");

        if ($interceptores) {
            $interceptor_classes = $this->get_interceptor_classes($class);
        } else {
            $basic_class = $controller->get_interceptor_index_name();
            $interceptor_classes = $this->get_interceptor_classes($basic_class);
        }

        $step = MPF_Interceptor::STEP_CONTINUE;
        foreach ($interceptor_classes as $interceptor_class) {
            $interceptor = $this->load_interceptor($interceptor_class);
            if (!$interceptor) {
                continue;
            }
            $interceptors[] = $interceptor;
            $this->debug("interceptor::before(): " . get_class($interceptor));
            $step = $interceptor->before();
            if ($step != MPF_Interceptor::STEP_CONTINUE) {
                break;
            }
        }

        if (!$this->is_debug_enabled()) {
            unset($this->debug_config);
            $this->trace_config = false;
        }

        if ($step != MPF_Interceptor::STEP_EXIT) {
            while (true) {
                $this->debug("controller::handle_request(): " . get_class($controller));
                $this->benchmark_begin("controller::handle_request(): " . get_class($controller));
                // 标记控制器执行开始
                $this->pf_benchmark_begin("controller");
                $result = $controller->handle_request();
                // 标记控制器执行结束
                $this->pf_benchmark_end("controller");
                $this->benchmark_end("controller::handle_request(): " . get_class($controller));
                if ($result instanceof MPF_Controller) {
                    $controller = $result;
                    continue;
                }
                break;
            }
            if (is_string($result)) {
                if (class_exists('MPF_DB_Factory', false)) {
                    MPF_DB_Factory::get_instance()->close_pdo_all();
                }
                // 标记页面开始
                $this->pf_benchmark_begin("page");
                $this->page($result);
                // 标记页面结束
                $this->pf_benchmark_end("page");
            }
        }

        $step = MPF_Interceptor::STEP_CONTINUE;
        if (isset($interceptors)) {
            $interceptors = array_reverse($interceptors);
            foreach ($interceptors as $interceptor) {
                $step = $interceptor->after();
                $this->debug("interceptor::after(): " . get_class($interceptor));
                if ($step != MPF_Interceptor::STEP_CONTINUE) {
                    break;
                }
            }
        }

        return true;
    }

    /**
     * 获取特定控制器的拦截器
     * @param string $class 类名
     * @return multitype:multitype: Ambigous <string, multitype:>
     */
    protected function get_interceptor_classes($class) {
        $final_interceptor_classes = array();

        $global_interceptor_classes = @$this->get_config("global", "interceptor");
        if ($global_interceptor_classes && !is_array($global_interceptor_classes)) {
            $global_interceptor_classes = array($global_interceptor_classes);
        }
        $interceptor_classes = @$this->get_config($class, "interceptor");
        if (!isset($interceptor_classes)) {
            $interceptor_classes = @$this->get_config("default", "interceptor");
        }
        if ($interceptor_classes && !is_array($interceptor_classes)) {
            $interceptor_classes = array($interceptor_classes);
        }

        if($global_interceptor_classes){ foreach ($global_interceptor_classes as $value) {
            $final_interceptor_classes[$value] = $value;
        } }
        if($interceptor_classes){ foreach ($interceptor_classes as $value) {
            if (preg_match('/^!/', $value)) {
                $value = substr($value, 1);
                unset($final_interceptor_classes[$value]);
            } else {
                $final_interceptor_classes[$value] = $value;
            }
        } }
        return $final_interceptor_classes;
        // return array_merge($global_interceptor_classes, $interceptor_classes);
    }

    //

    /**
     * @return MPF_Controller the instance of current executing controller
     */
    public function get_current_controller() {
        return $this->current_controller;
    }

    /**
     * @var MPF_Controller
     */
    private $current_controller;
    
    /**
     * get singal object of given class
     * @param string $className
     * @return $className
     */
    public function get_class($className) {
        if (array_key_exists($className, $this->classes)){
            $class = $this->classes[$className];
        }elseif (mpf_require_class($className)) {
            $class = new $className();
            $this->classes[$className] = $class;
        }else{
            //exception
            $errorMsg = 'class '.$className.' not found';
            throw new Exception($errorMsg, '2222');
        }
        return $class;
    }
    
    /**
     * array of classes
     * @var array(); key = className; value = class object;
     */
    private $classes = array();

    //

    /**
     * 获取配置信息
     * @param string $name 配置名
     * @param string $file 配置文件
     * @return boolean|multitype:
     */
    public function get_config($name=null, $file="common") {
        if (!isset($this->configures[$file])) {
            $config = $this->load_config($file);
            if (!$config) {
                return false;
            }
            $this->configures[$file] = $config;
        }

        return ($name == null)
            ? $this->configures[$file]
            : (isset($this->configures[$file][$name]) ? $this->configures[$file][$name] : null);
    }

    /**
     * 导入配置文件
     * @param string $file 配置文件名
     */
    public function load_config($file="common") {
        global $G_CONF_PATH;
        $route_confs = $G_CONF_PATH;
        if ($file === "route") {
            global $G_ROUTER_PATH;
            if (@is_array($G_ROUTER_PATH)) {
                $route_confs = $G_ROUTER_PATH;
            }
        }

        $error_reporting = error_reporting();
        foreach ($route_confs as $path) {
            if (file_exists("$path$file.php")) {
                error_reporting(E_ALL); //避免config陷阱
                include("$path$file.php");
                error_reporting($error_reporting); //恢复
                if ($this->trace_config) {
                    $debug_path = realpath($path);
                    $this->debug_config[$file][$debug_path] = $config;
                }
            }
        }

        if (!isset($config)) {
            trigger_error("Variable \$config not found on $file", E_USER_WARNING);
            return false;
        }
        return $config;
    }

    private $configures = array ();
    private $debug_config = array();

    public function get_debug_config(){
        return $this->debug_config;
    }

    public function get_final_config(){
        return $this->configures;
    }

    //

    /**
     * 加载v2控制器
     * @param string $class 类名
     * @return MPF_Controller v2控制器
     */
    public function get_controller($class) {
        if (!$class) {
            return false;
        }
        if (isset($this->controllers[$class])) {
            return $this->controllers[$class];
        }
        $controller = $this->load_controller($class);
        $this->controllers[$class] = $controller;
        return $controller;
    }

    /**
     * 导入制定的v2控制器类并初始化
     * 记录debug信息
     * @param string $class
     * @return MPF_Controller
     */
    public function load_controller($class) {
        $this->debug("load controller: $class");
        mpf_require_controller($class);
        $class= $class."Controller";
        return new $class();
    }

    private $controllers = array();


    /**
     * 导入拦截器
     * @param string $class
     * @return MPF_Interceptor
     */
    public function load_interceptor($class) {
        if (mpf_require_interceptor($class)) {
            $class = $class."Interceptor";
            return new $class();
        } else {
            return false;
        }
    }


    /**
     * @todo 非递归实现
     * @param unknown_type $class
     * @param unknown_type $is_page
     */
    protected function register_resources($class, $is_page=false) {
        $this->debug("register resources: $class");
        $flag = true;
        if ($is_page) {
            $flag = mpf_require_page($class);
        $path =  "page/";
        $class = $class."Page";
        } else {
            $flag = mpf_require_component($class);
            $path =  "component/";
            $class = $class."Component";
        }

        //component递归处理
        //eval("\$list = $class::use_component();");
        $list = $class::use_component();
        foreach ($list as $item) {
            $this->register_resources($item);
        }

        //eval("\$list = $class::use_boundable_javascripts();");
        $list = $class::use_boundable_javascripts();
        foreach($list as $item) {
            $this->prcess_resource_url($path, $item, $this->boundable_javascripts);
        }

        //eval("\$list = $class::use_boundable_styles();");
        $list = $class::use_boundable_styles();
        foreach($list as $item) {
            $this->prcess_resource_url($path, $item, $this->boundable_styles);
        }

        //eval("\$list = $class::use_javascripts();");
        $list = $class::use_javascripts();
        foreach($list as $item) {
            $this->prcess_resource_url($path, $item, $this->javascripts);
        }

        //eval("\$list = $class::use_styles();");
        $list = $class::use_styles();
        foreach($list as $item) {
            $this->prcess_resource_url($path, $item, $this->styles);
        }

        if ($is_page && $this->is_debug_enabled()) {
            $this->register_resources($this->debug_component);
        }

        /* begin 2010-11-04 by Jock*/
        //eval("\$used = $class::use_inline_styles();");
        $used = $class::use_inline_styles();
        $this->set_use_inline_styles($used);

        //eval("\$list = $class::prefetch_javascripts();");
        $list = $class::prefetch_javascripts();
        foreach($list as $item) {
            $this->prcess_resource_url($path, $item, $this->prefetch_javascripts);
        }

        //eval("\$list = $class::prefetch_styles();");
        $list = $class::prefetch_styles();
        foreach($list as $item) {
            $this->prcess_resource_url($path, $item, $this->prefetch_styles);
        }

        //eval("\$list = $class::prefetch_images();");
        $list = $class::prefetch_images();
        foreach($list as $item) {
            $this->prcess_resource_url($path, $item, $this->prefetch_images);
        }
        /* end 2010-11-04 by Jock*/

        /* add by Jock 2011-05-20 */
        //eval("\$used = $class::use_inline_scripts();");
        //$used = call_user_func(array($class, 'use_inline_scripts'));
        $used = $class::use_inline_scripts();
        $this->set_use_inline_scripts($used);
    }

    /* begin 2010-11-04 by Jock*/

    private $inline_styles = false;

    private $prefetch_javascripts = array();
    private $prefetch_styles = array();
    private $prefetch_images = array();
    private $prefetch_javascripts_processed = false;
    private $prefetch_styles_processed = false;
    private $prefetch_images_processed = false;

    public function get_use_inline_styles(){
        return $this->inline_styles;
    }

    public function set_use_inline_styles($used){
        $this->inline_styles = $used;
    }

    public function get_prefetch_javascripts() {
        if (!$this->prefetch_javascripts_processed) {
            $values = $this->prefetch_javascripts;
            usort($values, "MPF::resource_order_comparator");
            $this->prefetch_javascripts = array();
            foreach ($values as $value) {
                $this->prefetch_javascripts[] = $value[0];
            }
            $this->prefetch_javascripts_processed = true;
        }
        return $this->prefetch_javascripts;
    }

    public function get_prefetch_styles() {
        if (!$this->prefetch_styles_processed) {
            $values = $this->prefetch_styles;
            usort($values, "MPF::resource_order_comparator");
            $this->prefetch_styles = array();
            foreach ($values as $value) {
                $this->prefetch_styles[] = $value[0];
            }
            $this->prefetch_styles_processed = true;
        }
        return $this->prefetch_styles;
    }
    /* end 2010-11-04 by Jock*/

    /* begin add by Jock 2011-05-20 */
    private $inline_scripts = false;

    public function get_use_inline_scripts(){
        return $this->inline_scripts;
    }

    public function set_use_inline_scripts($used){
        $this->inline_scripts = $used;
    }
    /* end add by Jock 2011-05-20 */

    /**
     * 修正资源路径
     * @todo 去掉引用（指针）
     * @param unknown_type $path
     * @param unknown_type $item
     * @param unknown_type $items
     */
    public function prcess_resource_url($path, &$item, &$items) {
        if (is_array($item)) {
            $url = $item[0];
        } else {
            $url = $item;
            $item = array($url, 0);
        }
        if (!preg_match('/:\/\//', $url)) {
            $url = $path.$url;
        }

        if (is_array($items) && array_key_exists($url, $items)) {
            return;
        }

        $item[0] = $url;
        $item[3] = $this->resource_index++;

        $items[$url] = $item;
    }
    private $resource_index=0;

    public static function resource_order_comparator($a, $b) {
        if ($a[1] == $b[1]) {
            if ($a[3] == $b[3]) {
                return 0;
            }
            return ($a[3] > $b[3]) ? 1 : -1;
        }
        return ($a[1] > $b[1]) ? -1 : 1;
    }

    public function get_javascripts($head=false) {
        if (!$this->javascripts_processed) {
            $values = $this->javascripts;
            usort($values, "MPF::resource_order_comparator");
            $this->javascripts = array(0=>array(),1=>array());
            foreach ($values as $value) {
                if (@$value[2]) {
                    $this->javascripts[0][] = $value[0];
                } else {
                    $this->javascripts[1][] = $value[0];
                }
            }
            $this->javascripts_processed = true;
        }

        if ($head) {
            return $this->javascripts[0];
        } else {
            return $this->javascripts[1];
        }
    }

    public function get_styles() {
        if (!$this->styles_processed) {
            $values = $this->styles;
            usort($values, "MPF::resource_order_comparator");
            $this->styles = array();
            foreach ($values as $value) {
                $this->styles[] = $value[0];
            }
            $this->styles_processed = true;
        }
        return $this->styles;
    }

    public function get_boundable_javascripts() {
        if (!$this->boundable_javascripts_processed) {
            $values = $this->boundable_javascripts;
            usort($values, "MPF::resource_order_comparator");
            $this->boundable_javascripts = array();
            foreach ($values as $value) {
                $this->boundable_javascripts[] = $value[0];
            }
            $this->boundable_javascripts_processed = true;
        }
        return $this->boundable_javascripts;
    }

    public function get_boundable_styles() {
        if (!$this->boundable_styles_processed) {
            $values = $this->boundable_styles;
            usort($values, "MPF::resource_order_comparator");
            $this->boundable_styles = array();
            foreach ($values as $value) {
                $this->boundable_styles[] = $value[0];
            }
            $this->boundable_styles_processed = true;
        }
        return $this->boundable_styles;
    }

    private $javascripts = array();
    private $styles = array();
    private $javascripts_processed = false;
    private $styles_processed = false;

    private $boundable_javascripts = array();
    private $boundable_styles = array();
    private $boundable_javascripts_processed = false;
    private $boundable_styles_processed = false;


    public function register_script_block($content, $order=0) {
        $this->script_blocks[] = array($content, $order, 3=>$this->resource_index++);
    }

    public function get_script_blocks() {
        if (!$this->script_blocks_processed) {
            $values = $this->script_blocks;
            usort($values, "MPF::resource_order_comparator");
            $this->script_blocks = array();
            foreach ($values as $value) {
                $this->script_blocks[] = $value[0];
            }
            $this->script_blocks_processed = true;
        }
        return $this->script_blocks;
    }

    private $script_blocks = array();
    private $script_blocks_processed = false;


    /**
     * 实例化页面现实逻辑
     * @param string $class 页面类
     * @return MPF_Page 可以不要……
     */
    public function page($class, $params=array()) {
        $this->benchmark_begin("page::load(): " . $class);
        $this->benchmark_begin("register resource: " . $class);
        $this->register_resources($class, true);
        $this->benchmark_end("register resource: " . $class);
        $this->benchmark_begin("load component: " . $class);
        $page = $this->load_component(null, $class, true);
        $this->benchmark_end("load component: " . $class);
        $this->benchmark_end("page::load(): " . $class);

        $this->benchmark_begin("page::execute(): " . $class);
        $page->set_params($params);
        $page->execute();
        $this->benchmark_end("page::execute(): " . $class);
        return $page;
    }

    /**
     * @param string $class
     * @return MPF_Component
     */
    public function component($parent, $class, $params=array()) {
        if (!$class) {
            return false;
        }
        $component = @$this->load_component($parent, $class);
        $component->set_params($params);
        $component->execute();
        return $component;
    }

    /**
     * @param string $class
     * @return MPF_Component
     */
    public function load_component($parent, $class, $is_page=false) {
        $flag = true;
        if ($is_page) {
            $this->debug("load page: $class");
            $flag = mpf_require_page($class);
            $class = $class."Page";
        } else {
            $this->debug("load component: $class");
            $flag = mpf_require_component($class);
            $class = $class."Component";
        }
        if(!$flag && substr($class, 0, 3) == "HK_") {
            $class = substr($class, 3);
        }
        $this->html_id++;
        return new $class($parent, self::HTML_ID_PREFIX . $this->html_id);
    }

    private $html_id = 0;
    
    /**
     * 生成资源域名id
     * $val的建议值为id、filename
     **/
    public function host_id($val)
    {
        $res_id = @$this->get_config("HOST_HASH");
        if(is_numeric($res_id))
        {
            if(is_numeric($va))
                return $val % $res_id;
            else
                return $this->time33($val) % $res_id;
        }
        else
        {
            return '';
        }
    }

    /**
     * time33
     * @param $string
     */
    function time33($string) {
        $string = strval($string);
        if(strlen($string) >= 30) {
            $string = substr($string, 0, 30);
        }
        
        $code = 0;
        for ($i = 0, $len = strlen($string); $i < $len; $i++) {
            $code = (int)(($code<<5) + $code + ord($string{$i})) & 0x7FFFFFFF;
        }
        
        return $code;
    }

    //

    public function set_router_class($class) {
        $this->router_class = $class;
    }

    public function set_request_class($class) {
        $this->request_class = $class;
    }

    public function set_response_class($class) {
        $this->response_class = $class;
    }

    private $router_class = "MPF_Router";
    private $request_class = "MPF_Request";
    private $response_class = "MPF_Response";

    /**
     * @return MPF_Request
     */
    public function get_request() {
        return $this->request;
    }

    /**
     * @return MPF_Response
     */
    public function get_response() {
        return $this->response;
    }

    /**
     * @var MPF_Router
     */
    public function get_router() {
        return $this->router;
    }

    /**
     * @var MPF_Request
     */
    private $request;

    /**
     * @var MPF_Response
     */
    private $response;

    /**
     * @var MPF_Router
     */
    private $router;

    //

    public function debug($message) {
        if (!isset($this->debugger)) {
            return;
        }
        $this->debugger->debug($message);
    }

    public function benchmark_begin($name) {
        if (!isset($this->debugger)) {
            return;
        }
        $this->debugger->benchmark_begin($name);
    }

    public function benchmark_point($name, $text, $end = FALSE) {
        if (!isset($this->debugger)) {
            return;
        }
        $this->debugger->benchmark_point($name, $text, $end);
    }

    public function benchmark_end($name) {
        if (!isset($this->debugger)) {
            return;
        }
        $this->debugger->benchmark_end($name);
    }
    
    public function benchmark($name,$mixed=NULL) {
        if (!isset($this->debugger)) {
            return;
        }
        $this->debugger->benchmark($name,$mixed);
    }

    /**
     * return MPF_Debugger debugger instance
     */
    public function get_debugger() {
        return $this->debugger;
    }

    public function set_debugger($debugger) {
        return $this->debugger = $debugger;
    }

    public function is_debug_enabled() {
        return isset($this->debugger);
    }

    /**
     * @var MPF_Debugger
     */
    private $debugger;
    private $debug_component = 'MPF_Debugger_Debug';
    /**
     * @var MPF_Performance
     */
    private $performance;

    public function set_performance($performance) {
        return $this->performance = $performance;
    }

    public function get_performance() {
        return $this->performance;
    }

    /**
     * @name is_string
     */
    public function pf_benchmark_begin($name) {
        if (!isset($this->performance)) {
            return;
        }
        $this->performance->benchmark_begin($name);
    }

    /**
     * @name is_string
     */
    public function pf_benchmark_end($name) {
        if (!isset($this->performance)) {
            return;
        }
        $this->performance->benchmark_end($name);
    }

    public function pf_benchmark($name,$mixed=NULL) {
        if (!isset($this->performance)) {
            return;
        }
        $this->performance->benchmark($name,$mixed);
    }

    public function pf_benchmark_inc_begin($name) {
        if (!isset($this->performance)) {
            return;
        }
        $this->performance->benchmark_inc_begin($name);
    }

    public function pf_benchmark_inc_end($name) {
        if (!isset($this->performance)) {
            return;
        }
        $this->performance->benchmark_inc_end($name);
    }

    /**
     * @return MPF_Logger
     */
    public function get_logger() {
        if (!isset($this->logger)) {
            mpf_require_class($this->logger_class);
            $this->logger = new $this->logger_class();
        }
        return $this->logger;
    }

    private $logger;
    private $logger_class = 'MPF_Logger';

    private $nlogger;
    private $nlogger_class = 'MPF_NLogger';

    /**
     * @return MPF_NLogger
     */
    public function get_nlogger() {
        if (!isset($this->nlogger)) {
            mpf_require_class($this->nlogger_class);
            $this->nlogger = new $this->nlogger_class();
        }
        return $this->nlogger;
    }

    //

    // http://cn.php.net/manual/en/function.register-shutdown-function.php
    // Multiple calls to register_shutdown_function() can be made, and each will be called in the same order as they
    // were registered.
    //
    // The offical implementation is same order but ours is *REVERSE* order.
    public function register_shutdown_function($function) {
        $this->shutdown_functions[] = $function;
    }

    private $shutdown_functions;


    private function __construct() {
        $this->mpf_time = microtime(true);
        $this->trace_config = isset($_GET["__config"]);
        $error_handler = @$this->get_config("error_handler");
        if ($error_handler) {
            set_error_handler($error_handler);
        }

        $exception_handler = @$this->get_config("exception_handler");
        if ($exception_handler) {
            set_exception_handler($exception_handler);
        }

        register_shutdown_function(array($this, "shutdown"));
    }

    public function shutdown() {
        $mpf_time = microtime(true) - $this->mpf_time;
        $mpf_memory = function_exists('memory_get_usage') ? memory_get_usage() : 0;
        //add by jackie.li
        //$this->pf_benchmark("all",$apf_time,$apf_memory);
        // 记录MPF运行的时间和最后使用的内存
        $this->pf_benchmark("all",array("t"=>$mpf_time,"m"=>$mpf_memory));
        $this->benchmark('*MPF',array('b'=>$this->mpf_time,'bm'=>0,'i'=>1,'e'=>$this->mpf_time+$mpf_time,'em'=>0));
        if (is_array($this->shutdown_functions)) {
            $functions = array_reverse($this->shutdown_functions);
            foreach ($functions as $function) {
                call_user_func($function);
            }
        }

        restore_exception_handler();
        restore_error_handler();

        if(isset($_SERVER["REQUEST_URI"])){
            $logger = $this->get_logger();
            $logger->notice("MPF[".MPF::VERSION."]", '"', $_SERVER["REQUEST_URI"], '" ', $mpf_time, " ", $mpf_memory);
        }
    }

    private $mpf_time;
}

