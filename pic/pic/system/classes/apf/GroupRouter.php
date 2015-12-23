<?php
class APF_GroupRouter {
    const CONFIG_F_ROUTE          = 'bootstrap';
    const CONFIG_N_MAPPINGS       = 'mappings';
    const CONFIG_N_REGEX_FUNCTION = 'regex_function';

    const DEFAULT_REGEX_FUNCTION  = 'preg_match';//'ereg';

    const CONFIG_N_REGEX_LABEL    = 'regex_label';

    const DEFAULT_REGEX_LABEL     = '@';//'';

    const HTTP404_CONTROLLER = "404";

    private $mappings;

    public function get_mappings($key){
        if(!empty($key)) {
            return $this->mappings[$key];
        } else {
            return $this->mappings;
        }
    }

    /**
     * 从代码中设置或修改mapping表
     */
    public function set_mappings($mappings=array()){
        $this->mappings=$mappings;
    }

    /**
     * 转换原mapping到前缀分组mapping
     */
    public function save_asgroups($file){
        $mappings = $apf->get_config(self::CONFIG_N_MAPPINGS, self::CONFIG_F_ROUTE);
        $groups=array();
        foreach ($mappings as $class => $mapping) {
            $groups[$mapping['prefix']][$class]=$mapping;
            unset($groups[$mapping['prefix']][$class]['prefix']);
        }

        file_put_contents($file.'.php',var_export($groups,true));
    }

    /**
     * Returns the class name of matched controller
     *
     * @return class name in string
     */
    public function mapping() {
        $apf = APF::get_instance();
        if (empty($this->mappings)) {
            $mappings = $apf->get_config(self::CONFIG_N_MAPPINGS, self::CONFIG_F_ROUTE);
        } else {
            $mappings = $this->mappings;
        }
        $regex_function = @$apf->get_config(self::CONFIG_N_REGEX_FUNCTION, self::CONFIG_F_ROUTE);
        if (!function_exists($regex_function)) {
            $regex_function = self::DEFAULT_REGEX_FUNCTION;
        }
        $regex_label = @$apf->get_config(self::CONFIG_N_REGEX_LABEL, self::CONFIG_F_ROUTE);
        if (!$regex_label) {
            $regex_label = self::DEFAULT_REGEX_LABEL;
        }

        if (BASE_URI != '' && strpos($_SERVER['REQUEST_URI'], BASE_URI) === 0) {
            $uri = substr($_SERVER['REQUEST_URI'], strlen(BASE_URI));
        } else {
            $uri = $_SERVER['REQUEST_URI'];
        }

        $pos = strpos($uri, '?');
        if ($pos) {
            $uri = substr($uri, 0, $pos);
        }
        if (empty($uri)) {
            $uri = '/';
        }

        $matches=array();
        foreach ($mappings as $prefix => $groups) {
          if ($prefix==substr($uri,0,strlen($prefix)))
          foreach ($groups as $class => $mapping) {
            foreach ($mapping as $k=>$pattern) {
                if (@$regex_function($regex_label.$pattern.$regex_label, $uri, $matches) and $k!='prefix' and $k!='controller') {
                    $apf->get_request()->set_router_matches($matches);
                    return $class;
                }
            }
          }
        }

        //auto mapping
        $auto_mapping = $apf->get_config('enabled_auto_router');
        if ($auto_mapping) {
            $class = $this->auto_mapping($uri);
            if ($class) {
                return $class;
            }
        }

        // TODO: 404 controller?
        $class = $apf->get_config(self::HTTP404_CONTROLLER, self::CONFIG_F_ROUTE);
        if ($class) {
            return $class;
        }

        $apf->get_response()->set_header("HTTP/1.1", "404 Not Found", "404");
        return false;
    }

    public function auto_mapping ($uri) {
        $class_name = $this->format_uri2controller($uri);
        apf_require_controller($class_name,false);
        if (class_exists($class_name . 'Controller')) {
            return $class_name;
        }
        return false;
    }

    protected function format_uri2controller ($uri) {
        $matches = explode('/',$uri);
        array_shift($matches);
        unset($matches[count($matches)-1]);
        $classes = array();
        foreach ($matches as $item) {
            $classes[] = ucfirst($item);
        }
        return implode("_",$classes);
    }
}
