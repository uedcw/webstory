define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'placeholder'
], function(module, $,message){

    $(document).ready(function(){
       $(".reg_form .tab ul li").click(function(){
    		$(this).addClass("cur");
    		$(this).siblings().removeClass("cur");
    	})
  });
});