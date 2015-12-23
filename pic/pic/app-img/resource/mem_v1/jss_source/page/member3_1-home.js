define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'selectbox',
'member',
'placeholder'
], function(module, $,message,selectbox){
    $(document).ready(function(){
        $(".heig span").click(function(){
           $("#tabl_ul").slideToggle();
        })

      
       //删除元素
       $("#del a").click(function(){
           $("#delet").remove();
           });

        });

     selectbox(document.getElementById('demo-basic'));

});