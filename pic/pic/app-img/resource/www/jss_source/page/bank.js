define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'malldialog',
'doCart',
'autocheck',
'style',
'mallpublic'
], function(module, $, dialog, doCart, autocheck, style){

    function redirectToVer(){
        window.location.href ='http://'+mallDomain+'/jr.html';
    }

    $(document).ready(function(){
        //初始化购物车
        doCart.init();
        
        var checkInput = new autocheck();
        checkInput.init();  //初始化
        
        $('.switch_but').click(function(){
            var _this = this;
            style.addOnClass(_this, 'on');
            var contentId =  $(_this).attr('rela_content');
            style.addOnClass(contentId, 'show');
        });
        $('.sub_finance').click(function(){
            
            checkInput.checkAll(subPost);
        });  

    });
    //设置快速申请的按钮的位置
    var windowWidth = parseInt($(document).width());
    var emptyWidth = (windowWidth - 1000) /2;
    var fastButLeft =  emptyWidth+1000;
    $('.fast_write_link').css({display:'block', left:fastButLeft});
    function subPost(dataIn){
        $.post("ajax-jr", { ddata: dataIn },
            function(data){
                if(parseInt(data) > 0){
                    dialog.success("您的申请已提交成功，我们的客服专员将会尽快与您联系",redirectToVer);
                }else{
                    switch (data) {
                        case ("-11"):
                            dialog.error("请填写公司名,方便我们更快与您联系");
                            break;
                        case ("-21"):
                            dialog.error("请填写联系人,方便我们更快与您联系");
                            break;
                        case ("-31"):
                            dialog.error("请填写联系电话,方便我们更快与您联系");
                            break;
                        case ("-41"):
                            dialog.error("请填写联系邮箱,方便我们更快与您联系");
                            break;
                        case ("-43"):
                            dialog.error("请填写正确的电子邮件地址");
                            break;
                        default:
                           dialog.error("请登录并填写新内容后，再次提交");
                    }
                }
            }).error(function(){
                dialog.error("提交信息错误，请修改后提交");
            });
    }
});