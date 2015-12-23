<?php

function is_spider()
{
    $spider = array('wget','spider','googlebot','bingbot','yahoo','iask','yodaobot','msnbot','dnspod','jiankongbao','bing','adsbot','baidu');
    $label = strtolower($_SERVER['HTTP_USER_AGENT']);
    $is_spider = false;
    foreach($spider as $k=>$v)
    {
        if(strpos($label,$v)!==false)
        {
            $is_spider = true;
            break;
        }
    }
    return $is_spider;
}
function is_iphone()
{
    $agent = strtolower($_SERVER['HTTP_USER_AGENT']);
    $is_iphone = (strpos($agent, 'iphone')) ? true : false;
    return $is_iphone;
}