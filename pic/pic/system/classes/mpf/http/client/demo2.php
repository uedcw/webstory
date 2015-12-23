<?php

$ch1 = curl_init();
$ch2 = curl_init();

// ����URL����Ӧ��ѡ��
curl_setopt($ch1, CURLOPT_URL, "http://lxr.php.net");
curl_setopt($ch1, CURLOPT_HEADER, 0);
curl_setopt($ch2, CURLOPT_URL, "http://www.php.net");
curl_setopt($ch2, CURLOPT_HEADER, 0);

// ����������cURL���
$mh = curl_multi_init();

// ����2�����
curl_multi_add_handle($mh,$ch1);
curl_multi_add_handle($mh,$ch2);

$active = null;

do {
    $mrc = curl_multi_exec($mh, $active); //�Ծ�����״ε��÷�������
} while ($mrc == CURLM_CALL_MULTI_PERFORM); //��������ֱ������ȫ�����ͳ�ȥ

//�����Ƿ��͹��̣������ǽ��չ���

while ($active && $mrc == CURLM_OK) //����ջ���ڴ����С�����������������״̬��������ɡ�������ɣ�
{   
   // solve curl_multi_select in OS X
   while (curl_multi_exec($mh, $active) === CURLM_CALL_MULTI_PERFORM);

   if (curl_multi_select($mh) != -1) //�õ���ǰ���þ��
   {
       do {
           $mrc = curl_multi_exec($mh, $active); //�Ծ���Ķ��ε��ý�����Ӧ
           if ($mrc == CURLM_OK) //�������
           {
               while($info = curl_multi_info_read($mh)) //��ȡ���յ�������
               {
                   if($info['msg'] === CURLMSG_DONE)
                   {
                       var_dump(curl_multi_getcontent($infop['handle']));
                   }
               }
           }
       } while ($mrc == CURLM_CALL_MULTI_PERFORM); //��������ֱ�������Ӧ����
   }
}

//close the handles
curl_multi_remove_handle($mh, $ch1);
curl_multi_remove_handle($mh, $ch2);
curl_multi_close($mh);