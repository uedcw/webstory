define(['module','jquery','message',focus], function(module, $, message,focus){
/*
    询单(弹)层
*/
    var LANG=window['DB'].leng;
    var CK_MAILS='@qq.com,@163.com,@126.com,@Yahoo.cn,@sina.com,@hotmail.com,@gmail.com,@sohu.com,@yahoo.com.cn,@21cn.com,@outlook.com';
    var CK_TIPS='系统检测到您的邮箱是个人邮箱，供应商对公司邮箱更有兴趣，<br />更可能收到询盘回复，是否修改成公司邮箱？',
        CK_BUTS='是的，修改邮箱';
    if(LANG=='en'){
        CK_TIPS="Your email address is personal. <br />The suppliers would prefer to reply to a company's email address. <br />Would you please change to a company's email address?",
        CK_BUTS="Yes, Change my Email";
    }

    function init(mail, company){
        // 登录名验证
        mail.on('blur',function(){
            // 如果登录时则不需要
            if(login_user_email)return;

            var eo=$(this);
            var v=$.trim(eo.val());
            if(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(v)){
                var nvs=v.split("@");
                var nv='@'+nvs[1];
                var ns=nvs[0];
                if(CK_MAILS.inc(nv)){
                    message.warning(CK_TIPS,{
                        autofocusDefBut:'ok',
                        okValue:CK_BUTS,
                        ok:function(){
                            if(window.UA.isIE){
                                eo.val(ns);
                                window.setTimeout(function(){
                                    eo.focus().val(ns);
                                }, 50);
                            }else{
                                 eo.val(ns).focus();
                            }
                        },
                        cancel:function(){
                            if(window.UA.isIE){
                                window.setTimeout(function(){
                                    company.focus();
                                }, 50);
                            }else{
                                company.focus();
                            }
                        }
                    });
                }
            }
        });
    }

    return {
        init:init
    }
});
