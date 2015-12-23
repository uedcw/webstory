//直销页面
define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'doCart',
'malldialog',
'mallpublic',
'fadeslide'
], function(module, $, doCart, dialog){

    $(document).ready(function(){
    	
    	//初始化购物车
    	doCart.doCart.init();
        //轮播
        $(".prev,.next").hover(function(){
            $(this).stop(true,false).fadeTo("show",0.9);
        },function(){
            $(this).stop(true,false).fadeTo("show",0.4);
        });
        
        $(".banner-box").slide({
            titCell:".hd ul",
            mainCell:".bd ul",
            effect:"fold",
            interTime:3500,
            delayTime:500,
            autoPlay:false,
            autoPage:true,
            trigger:"click"
        });
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
	});
   
});