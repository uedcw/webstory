<?php
/*
 * fix errlog by think
 */
class APF_Cache_Factory{

    /**
     * @return APF_Cache_Factory
     */
    public static function &get_instance(){
        if(!self::$instance){
            self::$instance=new APF_Cache_Factory();
        }
        return self::$instance;
    }

    private static $instance;
    
    /*
     * @return mix
     */
    public function get_cache($name='servers')
    {
        $type = APF::get_instance()->get_config("type","cache");
        if($type=='memcache')
        {
            return $this->get_memcache($name);
        }
        elseif($type=='filecache')
        {
            return $this->get_filecache();
        }
        elseif($type=='redis')
        {
            return $this->get_redis($name);
        }
        return $this->get_filecache();
    }

    /**
     * @return APF_Cache_Memcache
     */
    public function get_memcache($name='servers'){
        if(!isset($this->memcache[$name])){
            $this->memcache[$name]=$this->load_memcache($name);
        }
        return $this->memcache[$name];
    }

    /**
     * @return APF_Cache_Memcache
     */
    public function load_memcache($name='servers'){
        apf_require_class($this->memcache_class);
        $memcache=new $this->memcache_class();
        $servers=APF::get_instance()->get_config($name,"cache");
        foreach($servers as $server){
            $memcache->addServer($server['host'],$server['port'],$server['persistent'],1,1,15,true,array( 
                    $this,
                    'fail' 
            ));
        }
        $memcache->setCompressThreshold(8192,0.2);
        return $memcache;
    }

    public function fail($host,$port){
        $code=@func_get_arg(4);
        $m=@func_get_arg(5);
        if(110==$code||10060==$code){
            APF::get_instance()->get_logger()->error('memcache '.$host.':'.$port.' failed '.$code);
            APF::get_instance()->pf_benchmark_inc_begin('APF_Cache_Factory::fail');
            APF::get_instance()->pf_benchmark_inc_end('APF_Cache_Factory::fail');
        }else{
            APF::get_instance()->get_logger()->error('memcache '.$host.':'.$port.' failed '.$code.' '.$m);
        }
    }

    /**
     * @var APF_Cache_Memcache
     */
    private $memcache;

    /**
     * @return APF_Cache_Filecache
     */
    public function get_filecache(){
        if(!isset($this->filecache)){
            $this->filecache=$this->load_filecache();
        }
        return $this->filecache;
    }

    /**
     * @return APF_Cache_Filecache
     */
    public function load_filecache(){
        apf_require_class($this->filecache_class);
        $filecache=new $this->filecache_class();
        $cache_dir=@APF::get_instance()->get_config("cache_dir","cache");
        if($cache_dir){
            $filecache->set_cache_dir($cache_dir);
        }
        return $filecache;
    }

    /**
     * @var APF_Cache_Filecache
     */
    private $filecache;

    /**
     * @return APF_Cache_Redis
     */
    public function get_redis($name='rdeis_servers'){
        if(!isset($this->redis[$name])){
            $this->redis[$name]=$this->load_redis($name);
        }
        return $this->redis[$name];
    }

    /**
     * @return APF_Cache_Redis
     */
    public function load_redis($name){
        apf_require_class($this->redis_class);
        $redis=new $this->redis_class();
        $redis_conf=APF::get_instance()->get_config($name,'cache');
        $redis->connect($redis_conf['host'],$redis_conf['port'],$redis_conf['timeout']);
        return $redis;
    }

    /**
     * @var APF_Cache_Redis
     */
    private $redis;

    public function set_memcache_class($class){
        $this->memcache_class=$class;
    }

    public function set_filecache_class($class){
        $this->filecache_class=$class;
    }

    public function set_redis_class($class){
        $this->redis_class=$class;
    }

    private $memcache_class="APF_Cache_Memcache";

    private $filecache_class="APF_Cache_Filecache";

    private $redis_class="APF_Cache_Redis";

    private function __construct(){}

    public function __destruct(){}
}