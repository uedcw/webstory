<?php
apf_require_class('APF_DFS_DFS');
apf_require_file('MogileFSm.php');

class APF_DFS_MogileFS implements APF_DFS_DFS {
    public function init($config) {
        if ($this->mfs) {
            throw new Exception("Cannot initialize twice!");
        }

        $mfscfg = $config['mogilefs'];
        $domain = $mfscfg['domain'];
        $class = $mfscfg['class'];
        $trackers = $mfscfg['trackers'];

        // TODO: validate parameters?
        // TODO: other parameters like timeouts?

        $this->mfs = new MogileFS($domain, $class, $trackers);
    }

    public function load($filename) {
        #return $this->mfs->get($filename);
        APF::get_instance()->pf_benchmark_begin("getpaths");
        $paths = $this->mfs->getPaths($filename);
        APF::get_instance()->pf_benchmark_end("getpaths");

        APF::get_instance()->pf_benchmark_begin("loadfromstorage");
        return $this->mfs->new_get($paths);
        APF::get_instance()->pf_benchmark_end("loadfromstorage");
    }

    public function save($filename, $content) {
        return $this->mfs->set($filename, $content);
    }

    public function delete($filename) {
        return $this->mfs->delete($filename);
    }

    public function rename($from, $to) {
        return $this->mfs->rename($from, $to);
    }

    public function exists($filename) {
        return $this->mfs->exists($filename);
    }


    /**
     *
     * @var APF_DFS_MogileFSImpl
     */
    private $mfs = false;
}
