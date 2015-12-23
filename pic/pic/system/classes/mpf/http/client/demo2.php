<?php

$ch1 = curl_init();
$ch2 = curl_init();

// 设置URL和相应的选项
curl_setopt($ch1, CURLOPT_URL, "http://lxr.php.net");
curl_setopt($ch1, CURLOPT_HEADER, 0);
curl_setopt($ch2, CURLOPT_URL, "http://www.php.net");
curl_setopt($ch2, CURLOPT_HEADER, 0);

// 创建批处理cURL句柄
$mh = curl_multi_init();

// 增加2个句柄
curl_multi_add_handle($mh,$ch1);
curl_multi_add_handle($mh,$ch2);

$active = null;

do {
    $mrc = curl_multi_exec($mh, $active); //对句柄的首次调用发送请求
} while ($mrc == CURLM_CALL_MULTI_PERFORM); //持续请求直到请求全部发送出去

//上面是发送过程，下面是接收过程

while ($active && $mrc == CURLM_OK) //整个栈处于处理中、但单个句柄处于完成状态（发送完成、接收完成）
{   
   // solve curl_multi_select in OS X
   while (curl_multi_exec($mh, $active) === CURLM_CALL_MULTI_PERFORM);

   if (curl_multi_select($mh) != -1) //得到当前可用句柄
   {
       do {
           $mrc = curl_multi_exec($mh, $active); //对句柄的二次调用接收响应
           if ($mrc == CURLM_OK) //接收完成
           {
               while($info = curl_multi_info_read($mh)) //读取接收到的数据
               {
                   if($info['msg'] === CURLMSG_DONE)
                   {
                       var_dump(curl_multi_getcontent($infop['handle']));
                   }
               }
           }
       } while ($mrc == CURLM_CALL_MULTI_PERFORM); //持续接收直到完成响应接收
   }
}

//close the handles
curl_multi_remove_handle($mh, $ch1);
curl_multi_remove_handle($mh, $ch2);
curl_multi_close($mh);