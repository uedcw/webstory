define(['module','jquery','message'], function(module, $, message){
/*
    登录 弹层
*/

    var LENG=window['DB'].leng;
    var dialog=message.dialog;

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

        var tpl='users_login_form';
        message.win(tpl, function(){
            var win=this;
            var ohs=$('#'+tpl);
            var crs=$('#win_user_login_captcha_rs');
            var cro=$('#win_user_login_captcha');

            // 初始化
            $("s.tps",'#'+tpl).hide();
            init();

            if(!ohs.data('bind')){//绑定事件
                ohs.data('bind',1);

                // 绑定验证码刷新事件
                crs.on('click',function(){
                    cro.attr('src', function(i,v){
                        return v.replace(/t=\d+$/, 't='+$.now());
                    });
                    $("[name='captcha']",'#'+tpl).focus();
                });

                // 表单提交(登录)
                $('#forms_'+tpl).submit(function(){
                    //隐藏之前的错误提示
                    $("s.tps",'#'+tpl).hide();

                    // 获取提示信息
                    var tips=$.trim($('#tips_'+tpl).val()).split("|$|");

                    // 用户名
                    var user_name_obj=$("[name='user_name']",'#'+tpl);
                    var user_name=$.trim(user_name_obj.val());
                    if(user_name==''){
                        user_name_obj.next('.tps').text(tips[1]).show();
                        user_name_obj.focus();
                        return false;
                    }

                    // 登录密码
                    var password_obj=$("[name='password']",'#'+tpl);
                    var password=$.trim(password_obj.val());
                    if(password==''){
                        password_obj.next('.tps').text(tips[2]).show();
                        password_obj.focus();
                        return false;
                    }

                    // 验证码
                    var captcha_obj=$("[name='captcha']",'#'+tpl);
                    var captcha=$.trim(captcha_obj.val());
                    if(captcha==''){
                        captcha_obj.nextAll('.tps').text(tips[3]).show();
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
                    $.post('/index.php?app=member&act=login',db,function(rs){
                        // 登录失败时
                        if(!rs.done){
                            var msg=rs.msg;

                            // 更新验证码
                            captcha_obj.val('');
                            crs.click();

                            // 密码 验证失败
                            if(msg==='auth_failed')
                            {
                                password_obj.next('.tps').text(tips[4]).show();
                                password_obj.focus();
                                return false;
                            }
                            // 验证码 失败
                            else if(msg==='captcha_failed')
                            {
                                captcha_obj.nextAll('.tps').text(tips[5]).show();
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

            win.title(LENG==='en'?'User Login':'用户登录');

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
        open:openwin_login
    }
});
