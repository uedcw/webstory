define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'member',
'placeholder'
], function(module, $,message,moment){
    $(document).ready(function(){
         $(".mind_mine").mouseover(function(){
             $("#count_mine").show();
         })
          $(".mind_mine").mouseout(function(){
             $("#count_mine").hide();
         });


           $("#selectAll").click(function () { 
               $("#list:checkbox,#all").attr("checked", true);   
             });  
    });
});



