<?php
// ����һ��cURL��Դ
$ch1 = curl_init();
$ch2 = curl_init();

// ����URL����Ӧ��ѡ��
curl_setopt($ch1, CURLOPT_URL, "http://www.baidu.com/");
curl_setopt($ch1, CURLOPT_HEADER, 0);
//curl_setopt($ch1, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch2, CURLOPT_URL, "http://www.csdn.net/");
curl_setopt($ch2, CURLOPT_HEADER, 0);
//curl_setopt($ch2, CURLOPT_RETURNTRANSFER, 1);

// ����������cURL���
$mh = curl_multi_init();

// ����2�����
curl_multi_add_handle($mh,$ch1);
curl_multi_add_handle($mh,$ch2);

$running=null;
// ִ����������
do {
    //usleep(10000);//solve cpu 100% usage
    curl_multi_exec($mh,$running);
    curl_multi_select($mh);//solve cpu 100% usage
    echo "microhuang\n";
} while ($running > 0);

// �ر�ȫ�����
curl_multi_remove_handle($mh, $ch1);
curl_multi_remove_handle($mh, $ch2);
curl_multi_close($mh);
