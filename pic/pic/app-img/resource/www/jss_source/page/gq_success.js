define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'malldialog',
'doCart',
'mallpublic',
'marquee'
], function(module, $, dialog, doCart){
	
	$(document).ready(function(){
		//初始化购物车
    	doCart.init();
    	
		setInterval("jump()",2000);

	});
	function jump(){
	   window.location.href = "/newbuy.html";
	  }
   
});