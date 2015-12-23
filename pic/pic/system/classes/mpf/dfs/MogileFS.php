<?php
mpf_require_class('MPF_DFS_DFS');
mpf_require_file('MogileFS.php');

class MPF_DFS_MogileFS implements MPF_DFS_DFS {
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