define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'selectbox',
'member',
'placeholder'
],  function(module, $,message,selectbox){
   $(document).ready(function(){
       $(".sele").click(function(){
           $(".tab_dv").toggle();
        })

    });

});