define(['module','jquery','message'], function(module, $, message){
/*
    关注店铺及收藏
*/

    var LANG=window['DB'].leng;
    var dialog=message.dialog;
    var mstr=LANG=='zh'?"对不起！您最多关注50个供应商":"Sorry, only 50 suppliers at most in your attention.";

    function bind(){//收藏商品及店铺
        var eo=$(this);
        var sid=eo.data('gid').toInt();
        if(!sid)return;
        var isfav=$(this).data('isfav').toInt();
        var is5=$(this).data('is5').toInt();
        var winbody=$('#add_fav_sort_done');

        // 如果>=50 关注收藏时
        if(is5){
             message.warning(mstr);
             return;
        }

        // 绑定事件
        if(!winbody.data('bind')){
            winbody.data('bind',1);
            $('#close_add_fav_sort_done').on('click',function(){
                dialog.get('add_fav_sort_done_win').remove();    //绑定关闭窗口时要用remove();
            });
        }

        if(!isfav){
            $.when(
                $.post("./index.php?app=goods&act=Addtosupplier",{store_id:sid}),
                $.post('/?app=my_favorite&act=add&type=store&ajax=1&lang='+LANG, {item_id:sid})
            ).done(function(a1,a2){
                    // a1 返回 0 未登录
                    // a1 返回 1 是店铺未关注
                    // a1 返回 2 已关注店铺
                    // a1 返回 3 关注店铺超过50
                    var a1x=$.trim(a1[2].responseText).toInt();     // string
                    var a2x=JSON.parse($.trim(a2[2].responseText)); // json

                    if(a1x==0 || !a2x.retval.islogin){
                        window.location.href="/en/login.html";
                    }else if(a1x==3){
                         $('#add_fav_store_mark').html((LANG=='zh'?"已关注":'In Bookmark'));
                         message.warning(mstr);
                         return;
                    }else{
                        $('#add_fav_store_mark').html((LANG=='zh'?"已关注":'In Bookmark'));
                        dialog({
                            id:'add_fav_sort_done_win',
                            title:LANG=='zh'?'关注店铺':'Supplier Added to Bookmark',
                            content:winbody
                        }).showModal();
                    }
                });
        }
    };


    return {
        bind:bind
    }
});
