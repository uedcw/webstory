<?php
apf_require_class('APF_DFS_DFS');
apf_require_file('MogileFSc.php');

class APF_DFS_MogileFSc implements APF_DFS_DFS {
    public function init($config) {
        if ($this->mfs) {
            throw new Exception("Cannot initialize twice!");
        }

        $mfscfg = $config['mogilefs'];
        $domain = $mfscfg['domain'];
        $class = $mfscfg['class'];
        $trackers = $mfscfg['trackers'];

        $memcacheds = APF::get_instance()->get_config('memcacheds', 'dfs');

        // TODO: validate parameters?
        // TODO: other parameters like timeouts?

        $this->mfs = new MogileFSc($domain, $class, $trackers, $memcacheds);
    }

    public function load($filename) {
        return $this->mfs->get($filename);
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
