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

//�����ǳ�ʼ���̡������Ǵ������ -- ����ִ�С�ֱ������Ӧ״̬���õ�һ����Ӧ״̬����һ����Ӧ

do {
        curl_multi_select($multi_curl);//����������cpu��ռ
        curl_multi_exec($multi_curl, $active);//��������ʵ�ʴ���
        while (!($info_array = curl_multi_info_read($multi_curl)) === false) {//������������Ƿ������������Ӧ
                if ($info_array['msg'] === CURLMSG_DONE) {//��Ӧ״̬Ϊ����ɡ��͵õ���Ӧ�ı�
                        curl_multi_getcontent($info_array['handle']);
                }
        }
}while ($active);//���͡����գ�ֱ���������Ӵ������
