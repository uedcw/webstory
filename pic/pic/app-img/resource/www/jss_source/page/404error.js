define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'doCart',
'mallpublic'
], function(module, $, doCart){

    $(document).ready(function(){
	//初始化购物车
	doCart.init();
	
    // document Ready END
	});
});