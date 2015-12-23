define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'doCart',
'malldialog',
'mallpublic',
'marquee'
], function(module, $, doCart, dialog){

    $(document).ready(function(){
    	//初始化购物车
    	doCart.init();
    	
    	$("#marquee-tb_1").kxbdMarquee({direction:"up",isEqual:false,scrollDelay:60});
    	
    	$('.newfgform').submit(function(){
        	return check_form();
    	})
    	var result = parseInt($('#hide_result').val());
        if(result>0){
        	dialog.success("您的信息已发布成功，我们客服人员会尽快和您联系！");
        } else if(result<0){
        	dialog.success("请勿重复提交！");
        }else if(result==0){
        	dialog.notice("您的信息已提交，我们的客服人员会尽快和您联系！");
        } 
        $('#no_login').click(function(){
        	dialog.notice("请先登录再提交!", function(){
        		window.location.href="http://"+wwwDomain+"/zh/login.html";
        	});
        });
        
        //下拉框样式
        $(".select").each(function(){
              var s=$(this);
              var z=parseInt(s.css("z-index"));
              var dt=$(this).children("dt");
              var dd=$(this).children("dd");
              var _show=function(){dd.slideDown(200);dt.addClass("cur");s.css("z-index",z+1);};   //展开效果
              var _hide=function(){dd.slideUp(200);dt.removeClass("cur");s.css("z-index",z);};    //关闭效果
              dt.click(function(){dd.is(":hidden")?_show():_hide();});
              dd.find("a").click(function(){dt.html($(this).html());_hide();});     //选择效果（如需要传值，可自定义参数，在此处返回对应的“value”值 ）
              $("body").click(function(i){ !$(i.target).parents(".select").first().is(s) ? _hide():"";});
         });
    	// document Ready END
	});
	
    //表单验证
    function check_form(){
       var num  = $("#num0").val().trim();
       var spec = $("#spec0").val().trim();
       if($("#name0").val()=="") {
    	   dialog.error("请填写产品名称！");
           $("#name0").focus();
           return false;
       } else if(num == "") {
    	   $("#num0").focus();
    	   dialog.error("请填写数量！");
    	   return false;
       } else if(num != '' && !num.isNumber()){
    	   dialog.error("数量只能为数字！");
    	   $("#num0").focus();
    	   return false;
       }  else if(spec == "") {
    	   dialog.error("请填写规格！");
           $("#spec0").focus();
           return false;
       } else if(spec != '' && !spec.isNumber()&&parseInt(spec)<=100){
    	   dialog.error("规格只能为数字！");
    	   $("#spec0").focus();
    	   return false;
       }else if(spec != '' && spec.isNumber()&&parseInt(spec)>100||spec != '' && spec.isNumber()&&parseInt(spec)<=0){
    	   dialog.error("规格需要位于0-100之间！");
    	   $("#spec0").focus();
    	   return false;
       }
       var unit = $('#fake_unit').text();
       $('#unit').val(unit);
       return true;
    };
  
});