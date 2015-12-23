define(['module','jquery','message','imgs'], function(module, $, message, imgs){
/*
    关注(弹)层.
*/

    var LENG=window['DB'].leng;
    var dialog=message.dialog;
    var tpl='user_footprint_ok_form';
    var m5str=LENG=='zh'?'对不起！您最多关注50个产品！':'Sorry, only 50 products at most in your attention.';


    // 打开层
    function open_win(eo){
        var tmid=eo.data('mid');
        var tcas=eo.data('cas');
        var tnam=eo.data('name');
        var timg=eo.data('img');
        var ttitle=LENG==='zh'?'关注产品':'Add to Bookmark';

        message.win(tpl, function(){
            var win=this;
            var ohs=$('#'+tpl);
            var img=$('#'+timg).attr('src');

            // 绑定事件
            if(!ohs.data('bind')){
                ohs.data('bind',1);

                $('#close_'+tpl).on('click',function(){
                    dialog.get(tpl+'_win').remove();    //绑定关闭窗口时要用remove();
                });
            }

            ohs.find('.cs').html('<a href="./cas-'+tcas+'.html" style="color:#000;font-size:12px;font-weight:100;">'+tcas+'</a>');
            ohs.find('.na').html('<a href="./cas-'+tcas+'.html" ><span style="color:#000;font-weight:100;font-size:12px;">'+tnam+'</span></a>');
            ohs.find('.ima').attr({href:'./cas-'+tcas+'.html', title:tnam});
            win.title(ttitle);

            // 获得IMG的尺寸后进行处理
            imgs.ready(img,function(){
                var wh=imgs.zoom(this.width, this.height, 120, 120);
                ohs.find('.im').attr('src',img).width(wh.width).height(wh.height);
            });
            eo.find('span').text((LENG=='zh'?'已关注':'In Bookmark'));
        });
    }

    // 对外的接口
    function attention_done(){
        var eo=$(this);
        var tisa=eo.data('isa').toInt();
        var tis5=eo.data('is5').toInt();

        // 如果 >=50 关注收藏时
        if(tis5){
            message.warning(m5str);
            return;
        }

        // 如果已经关注,打开层即可
        if(tisa===1){
            open_win(eo);
        }else{
            // 返回1为成功收藏，
            // 返回2为已经收藏过,
            // 返回3则mol_id为空，
            // 返回4为未登录
            // 返回5关注>=50时
            var tmid=eo.data('mid');
            var tcas=eo.data('cas');
            var tpl='user_footprint_ok_form';
            $.post("./index.php?app=search&act=AddtoAttention", {mol_id:tmid, cas:tcas}, function(res){
                res=$.trim(res).toInt();
                if(res==4){
                    window.location.href="./index.php?act=login";
                    return;
                }else if(res==5){
                    message.warning(m5str);
                    return;
                }
                open_win(eo);
            });
        }
    }

    return {
        open:attention_done
    }
});
