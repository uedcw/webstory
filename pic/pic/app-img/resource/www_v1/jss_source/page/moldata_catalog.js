define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'searchauto',   // 文本搜索自动完成
'pubjs',
'top10'
], function(module, $,message, searchauto){
       //var d_id=null;
    $(document).ready(function(){
        // 初始化搜索框自动完成
        searchauto.init();

    	// $(".choose .tab li a").mouseover(function(){
    	// 	var v_id=$(this).data("id");
     //        //$(".cur_tit").text($(this).text().trim());
    	// 	$(".tab").siblings("div.t"+v_id).show();
    	// 	$(".tab").siblings("div.t"+v_id).siblings(".tab-con").hide();
    	// 	$(this).addClass("cur");
    	// 	$(this).parent().siblings().children().removeClass("cur");
    	// })
    	// // $(".tab-con dl dd a").mouseover(function(){
     // //        var v_id=$(this).data("id");
    	// // 	$(this).siblings("#t"+v_id).show().siblings(".sub-items").hide();
    	// // 	//$(this).addClass("cur").siblings("a").removeClass("cur");
    	// // })
     //    // $(".tab-con dl dd a").click(function(){
     //    //     var v_id=$(this).data("id");
     //    //     $(this).siblings("#t"+v_id).show().siblings(".sub-items").hide();
     //    //     $(this).addClass("cur").siblings("a").removeClass("cur");
     //    //     $(this).parents("dl").siblings().find("a").removeClass("cur");
     //    // })
     //    // $(".sub-items a").click(function(){
     //    //     d_id=$(this).parent().data("id");
     //    //     $(this).parent().siblings("div").children("a").removeClass("cur");
     //    //     $(this).addClass("cur").siblings().removeClass("cur");
     //    //     $(".tab-con dl dd a#a"+d_id).addClass("cur");
     //    //     $(".tab-con dl dd div#t"+d_id).show();
     //    // });
     //    // console.log(d_id);
     //    // $(".tab-con dl dd div#t"+d_id).show().siblings(".sub-items").hide();
     //     $(".tab-con dl dd .nav .link").click(function(){
     //        var v_id=$(this).data("id");
     //        $(this).parent().addClass("selected");
     //        $(this).parent().siblings().children(".link").removeClass("cur");
     //        $(this).parent().siblings().children(".sub-items").hide();
     //        $(this).parents("dd").addClass("cur");
     //        $(this).addClass("cur");
     //        $(this).siblings(".sub-items").show();
     //    })
    	$(".expand").click(function(){
            $(this).toggleClass("cur");
    		$(".tab-con dl").siblings(".other").toggleClass("cur");
            $(".tab-con dl").siblings(".other").toggle();
    	})
  });
});