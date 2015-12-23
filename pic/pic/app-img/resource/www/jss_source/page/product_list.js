define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'malldialog',
'cart',
'doCart',
'mallpublic'
], function(module, $, dialog, cart, doCart){

    $(document).ready(function(){
    	//初始化购物车
    	doCart.init();
    	//单击文字选中
		$(".prepare_date").parent("dd").click(function(){
			$('.prepare_date').attr('checked', false);
			$(this).children('input').prop('checked',true);
		});
		$(".purity_radio").parent("dd").click(function(){
			$('.purity_radio').attr('checked', false);
			$(this).children('input').prop('checked',true);
		});	
		//排序字段
		$(".zx_form_submit").click(function(){
		  var sort  = $(this).attr("_tab");
		  var order = $(this).attr("_order");
		  $(this).siblings().attr("_tab", "");
		  if(sort == '')
		  {
		    sort = "desc";
		    $(this).attr('_tab', sort).removeClass("option_link").addClass("option_but").children('span').addClass("down");
		    $(this).siblings().attr('_tab', '').removeClass("up").removeClass("down").removeClass("option_but").addClass("option_link");
		    $("input[name=order]").val(order);
		    $("input[name=sort]").val(sort);          
		  }
		  else
		  {
		    //单击当前正在使用的排序字段
		    sort = ('desc' == sort)? 'asc': 'desc';
		    $(this).attr('_tab', sort);
		    $("input[name=order]").val(order);
		    $("input[name=sort]").val(sort);

		    if('asc' == sort){
		      $(this).children('span').removeClass("down").addClass("up");
		    }else{
		      $(this).children('span').removeClass("up").addClass("down");
		    }
		  } 
		  $("#product_list_form").submit();   

		});
    });
});