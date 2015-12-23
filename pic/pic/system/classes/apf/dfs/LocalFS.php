<?php
apf_require_class("APF_DFS_DFS");

class APF_DFS_LocalFS implements APF_DFS_DFS {

    private $localpath;

    public function init($config) {
        $cfg = $config["localfs"];

        $domain = $cfg["domain"];
        $localpath = $cfg["path"];
        $localpath = "{$localpath}/{$domain}/";

        if (!is_dir($localpath)) {
            throw new Exception("$localpath is not a directory");
        }

        if (!is_writable($localpath)) {
            throw new Exception("$localpath is not writable");
        }

        $this->localpath = $localpath;

        return true;
    }

    public function load($filename) {
        $filepath = $this->localpath . $filename;
        if (!is_file($filepath)) {
            throw new Exception("$filepath is not a file");
        }

        return file_get_contents($filepath, false);
    }

    public function save($filename, $content) {
        $filepath = $this->localpath . $filename;
        $this->delete($filename);

        return file_put_contents($filepath, $content, false);
    }

    public function delete($filename) {
        $filepath = $this->localpath . $filename;

        if (is_file($filepath)) {
            return unlink($filepath);
        }

        return false;
    }

    public function rename($old_filename, $new_filename) {
        $oldpath = $this->localpath . $old_filename;
        $newpath = $this->localpath . $new_filename;

        return rename($oldpath, $newpath);
    }

    public function exists($filename) {
        return is_file($this->localpath . $filename);
    }
}