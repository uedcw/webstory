<?php
interface MPF_DFS_DFS {
    public function init($config);

    public function load($filename);

    public function save($filename, $content);

    public function delete($filename);

    public function rename($old_filename, $new_filename);

    public function exists($filename);
}