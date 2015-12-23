define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message_new'
], function(module, $, message){

    $(document).ready(function(){
        $('button').each(function(){
            var eo=$(this);
            var tpl=eo.data('tpl');
            var txt=eo.text();
            eo.data('tit',txt);
            eo.text(txt+' -- #'+tpl);
            eo.find('s').text(tpl);
        }).on('click',function(){
            var eo=$(this);
            var tit=eo.data('tit');
            var tpl=eo.data('tpl');
            message.win(tpl, function(){    //open前
                    var _this=this,
                        $doms=$('#'+tpl);

                    if(!$doms.data('bind')){//绑定事件
                        $doms.data('bind',1);
                        $('#close_'+tpl).on('click',function(){
                            _this.remove();     //绑定关闭窗口时要用remove();
                        });
                    }
                     _this.title(tit);
            },function(){   //close时
                 //alert('close');
            });

        });
	$('#open').click();

    // document Ready END
	});
});