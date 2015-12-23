define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'pubjs',
'top10'
], function(module, $,message){

    $(document).ready(function(){
    	//下拉
	    // selectbox(document.getElementById('category_1'));
	    // selectbox(document.getElementById('category_2'));
	    // selectbox(document.getElementById('category_3'));
	    $('.select_city').change(function(){
	    	var so=$(this);
	    	var url=$.trim(so.find("option:selected").data("url"));
	    	window.location.href=url;
	    });		
  });
});