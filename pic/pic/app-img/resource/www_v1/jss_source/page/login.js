define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'placeholder'
], function(module, $,message){

    $(document).ready(function(){
       
    new Marquee(
		{
			MSClass	  : ["main1","content1","myTab_btns1","mouseover"],
			Direction : 0,
			Step	  : 0.2,
			Width	  : 380,
			Height	  : 400,
			Timer	  : 20,
			DelayTime : 5000,
			WaitTime  : 0,
			ScrollStep: 0,
			SwitchType: 2,
			AutoStart : true
		})
  });
});