define(['module','jquery','message'], function(module, $, message){
/*
    登录 弹层
*/

    var LENG=window['DB'].leng;
    var dialog=message.dialog;
    var form_post_cks=0;

    function openwin_login(event){
        try{
            var init=event.data.init; //初始化
        }catch(e){
            var init=$.noop();
        }
        try{
            var cfun=event.data.cfun; //登录完成回调
        }catch(e){
            var cfun=$.noop();
        }
        try{
            var wfun=event.data.wfun; //弹层关闭回调.
        }catch(e){
            var wfun=$.noop();
        }

        var tpl='win_new_login_form';
        message.win(tpl, function(){
            var win=this;
            var ohs=$('#'+tpl);

            // 初始化
            $("#error_"+tpl).hide();
            $('#reset_code_a_'+tpl).click();
            init();

            if(!ohs.data('bind')){//绑定事件
                ohs.data('bind',1);

                // 表单提交(登录)
                $('#forms_'+tpl).submit(function(){
                    if(form_post_cks){
                        return false;
                    }
                    //隐藏之前的错误提示
                    $("#error_"+tpl).hide();

                    // 获取提示信息
                    //var tips=$.trim($('#tips_'+tpl).val()).split("|$|");

                    // 用户名
                    var user_name_obj=$('#user_name_'+tpl);
                    var user_name=$.trim(user_name_obj.val());
                    if(user_name==''){
                        $("#error_"+tpl).text(LENG=='zh'?'请输入用户名':'Please enter Username').show();
                        user_name_obj.focus();
                        return false;
                    }

                    // 登录密码
                    var password_obj=$('#password_'+tpl);
                    var password=$.trim(password_obj.val());
                    if(password==''){
                        $("#error_"+tpl).text(LENG=='zh'?'请输入密码':'Please enter the password').show();
                        password_obj.focus();
                        return false;
                    }

                    // 验证码
                    var captcha_obj=$('#captcha_'+tpl);
                    var captcha=$.trim(captcha_obj.val());
                    if(captcha==''){
                        $("#error_"+tpl).text(LENG=='zh'?'请输入验证码':'Please enter the text in the image').show();
                        captcha_obj.focus();
                        return false;
                    }

                    // POST数据
                    var db={
                        user_name:user_name,
                        password:password,
                        captcha:captcha,
                        reqtype:'ajax'
                    };

                    form_post_cks=1;
                    $.post('/index.php?app=member&act=login',db,function(rs){
                        form_post_cks=0;
                        // 登录失败时
                        if(!rs.done){
                            var msg=rs.msg;

                            // 更新验证码
                            captcha_obj.val('');
                            $('#reset_code_a_'+tpl).click();

                            // 密码 验证失败
                            if(msg==='auth_failed')
                            {
                                 $("#error_"+tpl).text(LENG=='zh'?'密码错误':'Wrong password').show();
                                password_obj.focus();
                                return false;
                            }
                            // 验证码 失败
                            else if(msg==='captcha_failed')
                            {
                                $("#error_"+tpl).text(LENG=='zh'?'验证码错误':'Captcha error').show();
                                $('#reset_code_a_'+tpl).click();
                                return false;
                            }
                        }
                        // 登录成功
                        else
                        {
                            cfun(rs.retval);
                        }
                    },'json');
                    return false;
                });
            }

            win.title('　');

            // 焦点
            ohs.find(':input').each(function(){
                var tos=$(this);
                if(!tos.prop('readonly') && tos.val()==''){
                    tos.focus();
                    return false;
                }
            });
        },wfun);
    }

    return {
        open:openwin_login,
        dialog:dialog
    }
});
