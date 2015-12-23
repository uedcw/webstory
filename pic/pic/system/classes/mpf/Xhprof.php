<?php
class MPF_Xhprof {
    const DEFAULT_BENCHMARK = 'MPF';
    
    private $xhprof_data;
    private $namespace;

    public function __construct() {
        $this->benchmark_begin();
        MPF::get_instance()->register_shutdown_function(array($this, "shutdown_xprof"));
    }

    public function shutdown_xprof() {
        $this->benchmark_end();
        $id = $this->insert_xprof();
        $this->view_xprof($id);
    }

    public function benchmark_begin() {
        xhprof_enable();
    }

    public function benchmark_end() {
        $controller = MPF::get_instance()->get_current_controller();
        $this->namespace = get_class($controller);
        
        $run = xhprof_disable();
        $this->xhprof_data = serialize($run);
    }

    public function get_xhprof_data() {
        return $this->xhprof_data;
    }
    
    public function get_namespace() {
        return $this->namespace;
    }
    
    public function insert_xprof() {
        mpf_require_class('Aifang_Core_Bll_Tools_Xhprof');
        $bll = new Aifang_Core_Bll_Tools_Xhprof();
        
        $data = array(
                'namespace' => $this->namespace,
                'xhprof_data' => $this->xhprof_data
                );
        return $bll->insert_xhporf($data);
    }
    
    public function view_xprof($id) {
        $aifang_tools_domain = MPF::get_instance()->get_config("aifang_tools_domain");
        echo "<a target='_brank' href='http://".$aifang_tools_domain."/xhprof/detail/?id=".$id."' >[View Xprof]</a>";
    }

}
