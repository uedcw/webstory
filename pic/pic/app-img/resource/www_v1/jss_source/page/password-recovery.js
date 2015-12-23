define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'selectbox',
'placeholder'
], function(module, $,message,selectbox){

    $(document).ready(function(){
        selectbox(document.getElementById('test_mode'));
        var test_mode=$(".ui-selectbox-inner").text().trim();
        if(test_mode=="邮箱验证"){
        	$(".test-mail").show();
            $(".test-tel").hide();
        }
        else{
        	 $(".test-mail").hide();
              $(".test-tel").show();
        }
        $('#test_mode').change(function(){
            var sv0=$.trim(this.value);
            if(sv0==0){
              $(".test-mail").show();
              $(".test-tel").hide();
            }
            else{
              $(".test-mail").hide();
              $(".test-tel").show();
            }
              
        });
   
  });
});