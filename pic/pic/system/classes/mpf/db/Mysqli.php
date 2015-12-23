<?php
/**
 * 
 */

mpf_require_file('Mysqli_Database.php');
class MPF_DB_Mysqli extends Mysqli_Database {
    private static $instance;
    public static function &get_instance(){
        if(!self::$instance){
            self::$instance=new MPF_DB_Mysqli();
        }
        return self::$instance;
    }
    public function query($sql){
        MPF::get_instance()->benchmark_begin('MPF_DB_Mysqli::query');
        parent::query($sql);
        MPF::get_instance()->benchmark_end('MPF_DB_Mysqli::query');
        return $this;
    }
}