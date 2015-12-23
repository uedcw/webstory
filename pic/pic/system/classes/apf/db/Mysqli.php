<?php
/**
 * 
 */

apf_require_file('Mysqli_Database.php');
class APF_DB_Mysqli extends Mysqli_Database {
    private static $instance;
    public static function &get_instance(){
        if(!self::$instance){
            self::$instance=new APF_DB_Mysqli();
        }
        return self::$instance;
    }
    public function query($sql){
        APF::get_instance()->benchmark_begin('APF_DB_Mysqli::query');
        parent::query($sql);
        APF::get_instance()->benchmark_end('APF_DB_Mysqli::query');
        return $this;
    }
}