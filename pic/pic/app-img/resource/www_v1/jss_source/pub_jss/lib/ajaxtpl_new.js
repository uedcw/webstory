define(['jquery'], function($){
/*
 * AJAX加载HTML模板文件
 * demo:

ajaxtpl('test_tpl_id',function(tplDom, tplid, act){
    alert('加载完成');
});

ajaxtpl('win_add_order_form_done',function(tplDom, tplid, act){
    //这里传回来的tplDom是win_add_order_form_done的dom对像
    //tplid即win_add_order_form_done
    //act
    $(tpl).show();
});
 */

    var LENG=window['DB'].leng;

    //加载模板并执行回调
    return function(boxid, callbak, act){
        callbak=callbak||$.noop();
        act=act||'index';
        var box=document.getElementById(boxid);
        if(!box)
        {
             $.get('/dialog_page/'+'/wintpl/'+boxid+'_'+LENG+'.html',function(rs){
                if(rs!==''){
                    $(document.body).append(rs);
                    callbak(document.getElementById(boxid), boxid, act);
                }else{
                    alert('no tpl: '+boxid);
                }
            });
        }
        else
        {
             callbak(box, boxid, act);
        }
    }

});
