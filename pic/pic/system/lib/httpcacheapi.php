<?php
/**
* $Id: httpcacheapi.php 7730 2014-09-30 05:27:42Z 刘建民 $
*/

if(!defined('XHPROF_TEMP')){define('XHPROF_TEMP','/opt/molbase.inc/tmp/');}
!defined('XHPROF_TEMP') && exit('Forbidden');  //"/opt/molbase.inc/tmp/"

/*
 * Cache in CDN ... by HyperText Transfer Protocol
 * Verion: 0.1
 * Author: MicroHuang
 * Date: 2014/06/11
 */if( !function_exists('apache_request_headers') ) {
///
function apache_request_headers() {
  $arh = array();
  $rx_http = '/\AHTTP_/';
  foreach($_SERVER as $key => $val) {
    if( preg_match($rx_http, $key) ) {
      $arh_key = preg_replace($rx_http, '', $key);
      $arh_key = strtolower($arh_key);//debug
      $rx_matches = array();
      // do some nasty string manipulations to restore the original letter case
      // this should work in most cases
      $rx_matches = explode('_', $arh_key);
      if( count($rx_matches) > 0 and strlen($arh_key) > 2 ) {
        foreach($rx_matches as $ak_key => $ak_val) $rx_matches[$ak_key] = ucfirst($ak_val);
        $arh_key = implode('-', $rx_matches);
      }
      //if($arh_key=='IF-MODIFIED-SINCE')$arh_key='If-Modified-Since';//debug
      $arh[$arh_key] = $val;
    }
  }
  return( $arh );
}
}

function process_cache($expire=300, $arrVary=array()){
    if($_COOKIE['debug']){return;}
    $headers = apache_request_headers();
    $client_time = (isset($headers['If-Modified-Since']) ? strtotime($headers['If-Modified-Since']) : 0);
    $now=time();  //$now=gmmktime();
    $now_list=time()-$expire;  //$now_list=gmmktime()-$expire;
    /*http cache for SQ*/
    if($arrVary){
        header('Vary: '.implode(', ', $arrVary));
        foreach($arrVary as $k => $v){
            header("$k: $v");
        }
    }
    if ($client_time<$now and $client_time >$now_list){
        header('Cache-Control: public');
        header('Pragma: public');
        header('Expires: '.gmdate('D, d M Y H:i:s', $client_time+$expire).' GMT');
        header('Last-Modified: '.gmdate('D, d M Y H:i:s', $client_time).' GMT', true, 304);
        exit(0);
    }else{
        header('Cache-Control: public');
        header('Pragma: public');
        header('Expires: '.gmdate('D, d M Y H:i:s', $now+$expire).' GMT');
        header('Last-Modified: '.gmdate('D, d M Y H:i:s', $now).' GMT', true, 200);
    }
}

//if(is_cacheable()){process_cache(60*5);}


if (!function_exists("fastcgi_finish_request")) {
    function fastcgi_finish_request() {

    }
}

function process_xhp()
{
    if( (defined('XHP_PERCENT') && defined('XHP_PERCENT')<=rand(1,100)) || (isset($_COOKIE['debug']) && $_COOKIE['debug']=='xhp') || (isset($_GET['debug']) && $_GET['debug']=='xhp') ){ //采样、cookie、get
        list($usec, $sec) = explode(' ',microtime());
        $page_start_time = (float)$usec + (float)$sec;
        xhprof_enable();
        //xhprof_enable(XHPROF_FLAGS_CPU + XHPROF_FLAGS_MEMORY + XHPROF_FLAGS_NO_BUILTINS, array());
        register_shutdown_function('process_xhp_end',$page_start_time);
    }
}
function process_xhp_end($page_start_time){
    list($usec, $sec) = explode(' ',microtime());
    $page_end_time = (float)$usec + (float)$sec;
    $page_runtime = $page_end_time - $page_start_time;
    $php_xhp=defined('XHP_TIME')?XHP_TIME:1.0;
    if($page_runtime>$php_xhp){
        $xhprof_data = xhprof_disable();
        $XHPROF_ROOT = "/opt/molbase.inc/xhprof/";
        //$XHPROF_TEMP = "/opt/molbase.inc/tmp/";
        include_once $XHPROF_ROOT . "xhprof_lib/utils/xhprof_lib.php";
        include_once $XHPROF_ROOT . "xhprof_lib/utils/xhprof_runs.php";
        $xhprof_runs = new XHProfRuns_Default();
        //$run_id = $page_runtime."_".microtime(true)."_".urlencode($_SERVER['REQUEST_URI']);
        //$run_id = str_replace('.','-',$run_id);
        $run_id = null;
        $run_id = $xhprof_runs->save_run($xhprof_data, "xhprof_testing", $run_id);
        //echo "<div style='display:;'>http://xhp.molbase.inc/index.php?run={$run_id}&source=xhprof_testing</div>";
        file_put_contents(XHPROF_TEMP.'xhprof/id.log',$run_id.": ".$page_runtime.": ".date("Y-m-d H:i:s").": ".json_encode($_SERVER)."\n",FILE_APPEND);
        //register_shutdown_function('file_put_contents',XHPROF_TEMP.'xhprof/id.log',$run_id.":".$page_runtime.":".date("Y-m-d H:i:s").":".$_SERVER['REQUEST_URI']."\n",FILE_APPEND);
    }
}