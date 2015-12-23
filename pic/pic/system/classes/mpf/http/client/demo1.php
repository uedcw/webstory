<?php
// 创建一对cURL资源
$ch1 = curl_init();
$ch2 = curl_init();

// 设置URL和相应的选项
curl_setopt($ch1, CURLOPT_URL, "http://www.baidu.com/");
curl_setopt($ch1, CURLOPT_HEADER, 0);
//curl_setopt($ch1, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch2, CURLOPT_URL, "http://www.csdn.net/");
curl_setopt($ch2, CURLOPT_HEADER, 0);
//curl_setopt($ch2, CURLOPT_RETURNTRANSFER, 1);

// 创建批处理cURL句柄
$mh = curl_multi_init();

// 增加2个句柄
curl_multi_add_handle($mh,$ch1);
curl_multi_add_handle($mh,$ch2);

$running=null;
// 执行批处理句柄
do {
    //usleep(10000);//solve cpu 100% usage
    curl_multi_exec($mh,$running);
    curl_multi_select($mh);//solve cpu 100% usage
    echo "microhuang\n";
} while ($running > 0);

// 关闭全部句柄
curl_multi_remove_handle($mh, $ch1);
curl_multi_remove_handle($mh, $ch2);
curl_multi_close($mh);
