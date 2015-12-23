<?php
$ch1 = curl_init();
$ch2 = curl_init();
curl_setopt($ch1, CURLOPT_URL, "http://mall.molbase.com/?debug=1");
curl_setopt($ch1, CURLOPT_HEADER, 0);
//curl_setopt($ch2, CURLOPT_URL, "http://www.baidu.com");
curl_setopt($ch2, CURLOPT_URL, "http://mall.molbase.com/?debug=1");
curl_setopt($ch2, CURLOPT_HEADER, 0);

$multi_curl=curl_multi_init();
curl_multi_add_handle($multi_curl,$ch1);
curl_multi_add_handle($multi_curl,$ch2);

//上面是初始过程、下面是处理过程 -- 反复执行、直到有响应状态、得到一个响应状态处理一个响应

do {
        curl_multi_select($multi_curl);//非阻塞、防cpu空占
        curl_multi_exec($multi_curl, $active);//非阻塞、实质处理
        while (!($info_array = curl_multi_info_read($multi_curl)) === false) {//非阻塞、检测是否有连接完成响应
                if ($info_array['msg'] === CURLMSG_DONE) {//响应状态为“完成”就得到相应文本
                        curl_multi_getcontent($info_array['handle']);
                }
        }
}while ($active);//发送、接收，直到所有连接处理完成
