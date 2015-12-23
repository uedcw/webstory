define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'selectbox',
'member',
'placeholder'
], function(module, $,message,selectbox){
    $(document).ready(function(){
      var all=document.getElementById("all");
      var allinput=document.getElementById("point").getElementsByTagName("label");
      all.onclick=function(){ 
        if(all.checked==true) 
        {
          for(var i=0;i<=allinput.length-1;i++){ 
            allinput[i].checked=true;
          }
         
        }
        else{ 
          for(var i=0;i<=allinput.length-1;i++){
            allinput[i].checked=false;
          }

        }


      }
    });

   




     $("#posin").click(function(){
          $("#config").show();
     });
     $("#posi").click(function(){
          $("#cond").show()
     });


});

