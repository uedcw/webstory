//直销页面
define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'doCart',
'malldialog',
'fadeslide',
'mallpublic'
], function(module, $, doCart, dialog, fadeSilde){

    $(document).ready(function(){
    	
    	//初始化购物车
    	doCart.init();
        var silde = new fadeSilde();
		silde.init();
		
        //产品hover更换class
        $(".product-x ul li").mouseover(
            function(){
               $(this).find(".price .fl p i").addClass("hover");
               $(this).find(".price .fr a").addClass("btn0-bg")
            }
        )
        $(".product-x ul li").mouseleave(
            function(){
                $(this).find(".price .fl p i").removeClass("hover");
                $(this).find(".price .fr a").removeClass("btn0-bg")
            }
        )
    	// document Ready END
        
		//yi:排序字段(排序这里css不能变动).
		$(".zx_form_submit").click(function(){
		  var sort  = $(this).attr("_tab");
		  var order = $(this).attr("_order");
		  $(this).siblings().attr("_tab", "");
		  
		  if(sort == ''||sort == undefined)
		  {
		    sort = "desc";
		    $(this).attr('_tab', sort).addClass('cur').children('i').addClass("down");
		    $(this).siblings().removeClass("cur").attr('_tab', '').children('i').removeClass("up").removeClass("down");
		    $("input[name=order]").val(order);
		    $("input[name=sort]").val(sort);  		    
		  }
		  else
		  {
		    //单击当前正在使用的排序字段
		    sort = ('desc' == sort)? 'asc': 'desc';
		    $(this).attr('_tab', sort).siblings().removeClass("cur");
		    $("input[name=order]").val(order);
		    $("input[name=sort]").val(sort);		    

		    if('asc' == sort){
		      $(this).children('i').removeClass("down").addClass("up");
		    }else{
		      $(this).children('i').removeClass("up").addClass("down");
		    }
		  } 
		  $("#product_list_form").submit();
		});
        
	});//ready end  
});