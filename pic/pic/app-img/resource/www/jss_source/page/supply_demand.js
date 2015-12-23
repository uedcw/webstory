//直销页面
define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'doCart',
'malldialog',
'mallpublic'

], function(module, $, doCart, dialog){

    $(document).ready(function(){
    	//初始化购物车
    	doCart.init();
    	
    	var $this = $("#news");
	    var scrollTimer;
	    
	    $this.hover(function() {
	        clearInterval(scrollTimer);
	    }, function() {
	        scrollTimer = setInterval(function() {
	            scrollNews($this);
	        }, 2000);
	    }).trigger("mouseleave");
	    
	});
    
    function scrollNews(obj) {
        var $self = obj.find("ul");
        var lineHeight =parseFloat($self.find("li:first").height())+20;
        var totalheight = $self.height();
        $self.animate({
            "marginTop": -lineHeight + "px"
        }, 300, function() {
               if(totalheight<lineHeight){
                   $self.css({
                       marginTop: totalheight
                   }).find("li:first").appendTo($self);
               }else{
                   $self.css({
                       marginTop: 0
                   }).find("li:first").appendTo($self);
               }

        })
    }
   
});