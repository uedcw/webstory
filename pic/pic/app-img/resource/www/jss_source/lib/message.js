define(['jquery', 'ajaxtpl', 'dialog'], function($, ajaxtpl, dialog){
/*
    系统消息提示(层) km3945 2014/11/19

#demo

message.error('你错了!!!!!!!!!!!!!');
message.warning('你给我小心点.....');
message.ok('终于成功了,狗日的.....');

message.ok('<p>message<p>', function(){
    alert('这是关闭回调. this指向dialog对像');
    return true;    //返回TRUE则关闭窗口,FALSE则不关闭
});

message.ok('<p>message<p>', {
    styles:'width:400px;color:#f00;',   //内容区可以自定义style
    addcss:'msgnew',                     //内容区可以增加cssname
    dialog.....                         //dialog的所有选项均可设置,文档可参考 http://aui.github.io/artDialog/doc/index.html
});

$('#win_test').on('click',function(){
    var tpl='win_add_order_form_done';
    message.win(tpl, function(){    //open前
            var _this=this,
                $doms=$('#'+tpl);

            if(!$doms.data('bind')){//绑定事件
                $doms.data('bind',1);

                $('#close_'+tpl).on('click',function(){
                    _this.remove();     //绑定关闭窗口时要用remove();
                });
            }

            $('#url_'+tpl).attr('href',function(i,v){
                return v.replace('##I##',1).replace('##T##',2);
            });
             _this.title('定单完成');
    },function(){   //close时
         alert('close');
    });
});


*/
    if(window['DB'].leng=='zh'){
        var langs={
            title:  '消 息',
            ok:     '确 定',
            cancel: '取 消'
        };
    }else{
        var langs={
            title:  'Message',
            ok:     'OK',
            cancel: 'Cancel'
        };
    }

    var styles='',  //内容区可以自定义style
        addcss='';  //内容区可以增加cssname

    function getHtml(v, m){
        v=v||'success';
        var s=!styles ? '' : ' style="'+styles+'"';
        var c=!addcss ? '' : ' '+addcss;
        return '<table class="sys_mess"><tr><th valign="center"><div class="ico ico_'+v+'"></div></th><td valign="center"><div class="msg'+addcss+'"'+s+'>'+m+'</div></td></tr></table>';
    }

    function create(v, m, p){//创建并返回dialog
        var opt=$.extend({
                title: langs.title,
                content:''
            }, p);

         if(!opt.content){
            opt.content=getHtml(v,m);
         }

         return dialog(opt);
    }

    function isFun(fun){
        return $.isFunction(fun);
    }

    function extend(p){ //合并并返回dialog设置
        var opt={
                autofocusDefBut:'cancel',
                cancelValue:langs.cancel,
                cancel:function(){
                    return true;
                }
            };

        if(typeof p==='undefined')
        {
            return opt;
        }
        else if(isFun(p))
        {
            opt.cancel=p;
            return opt;
        }else{
            if('styles' in p){
                styles=p['styles'];
                delete p.styles;
            }
            if('addcss' in p){
                addcss=p['addcss'];
                delete p.addcss;
            }
            if($.isEmptyObject(p)){
                return opt;
            }else{
                return $.extend(opt, p);
            }
        }
    }

    function show_success(m, p){    //成功
        var opt=extend(p);
        var d=create('success', m, opt);

        return d.showModal();
    }

    function show_error(m, p){     //错误
        var opt=extend(p);
        var d=create('error', m, opt);

        return d.showModal();
    }

    function show_warning(m, p){   //警告
        var opt=extend(p);
        var d=create('warning', m, opt);

        return d.showModal();
    }

    function openwin(boxid, initFun, closeFun, act){    //加载模板并弹出窗口
        initFun =initFun ||$.noop();
        closeFun=closeFun||$.noop();
        act=act||'index';

        ajaxtpl(boxid, function(box, boxid, act){
            dialog({
                'id':boxid+'_win',
                'content':box,
                'title':'loading',
                'onshow':initFun,
                'onremove':closeFun
            }).showModal();
        }, act);
    }

    return {
        success:show_success,
        ok:show_success,
        error:show_error,
        warning:show_warning,
        win:openwin,
        dialog:dialog       // 放狗
    };
});
