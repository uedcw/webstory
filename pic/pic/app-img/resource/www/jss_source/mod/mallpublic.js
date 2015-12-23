define([
'module',        // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',        // jquery
'malldialog',
], function(module, $, dialog){
	
    $(document).ready(function(){
    	window['DB']['READY']=true;

    	//yi:数据为空不能搜索
    	$("#form1-top-search-buts-post").click(function(){
    		var keyword = $('#top_search_keyword').val().trim();
    		if(!(typeof keyword=='undefined' || ''==keyword))
    		{
    			$("#mall_top_search").submit();
    		}
    	});
    	
    	//搜索框提交
        $('#mall_top_search').submit(function(){
            var wordObj = $('#top_search_keyword');
            var searchWord = wordObj.val();
            if(searchWord != ''){
                wordObj.val(searchWord.trim());
            }
        });
        
        //产品类型下拉交互
    	var productTypeObj = $('.product_category');
        if(productTypeObj.css('display') ==  'none'){
            $('.category_menu_all').hover(function(e){
                e.stopPropagation();
                if(isDown) {
                    return false;
                }
                var isDown = 1;
                productTypeObj.slideDown(260, function () {
                    isDown = 0;
                });
                $(document).bind('mouseover', function(e) {
                    var productTypeSet = productTypeObj.offset();
                    var productTypeWidth = parseFloat(productTypeObj.css('width').replace('px', ''));
                    var productTypeHeight = parseFloat(productTypeObj.css('height').replace('px', ''));
                    if(
                      (productTypeSet.left + productTypeWidth) < e.pageX || (productTypeSet.top + 60 + productTypeHeight) < e.pageY
                            || productTypeSet.left > e.pageX || productTypeSet.top-60 > e.pageY
                      ){
                        productTypeObj.slideUp(260, function () {productTypeObj.css('display', 'none');});
                        $(document).unbind('mouseover');
                    }

                });
            });
        }
        
        //向上按钮
        $(window).scroll(function(){
            var scrollTop = parseInt($(document).scrollTop());
            if(scrollTop > 100){
                $('.go_top').css('display', 'block');
            } else {
                $('.go_top').css('display', 'none');
            }
        }); 
        
        //向上按钮点击事件
        $('.go_top').click(function(){
            $('html,body').animate({scrollTop:'0px'}, 300);
        });
       
        //没有输入，搜索框不可点击
        $("#form1-top-search-buts-post").on('click', function(){
        	var keyword = $('#top_search_keyword').val().trim();
    		if(!(typeof keyword=='undefined' || ''==keyword))
    		{
    			$("#mall_top_search").submit();
    		}
        });
        
        //自动缩放图片
        $('.auto_size_img').each(function(){
            var maxWidth  = parseFloat($(this).css('width'));
            var maxHeight = parseFloat($(this).css('height'));
            var hRatio;
            var wRatio;
            var ratio = 1;
            var img = new Image();
            img.src = $(this).attr('src');
            var w = img.width;
            var h = img.height;

            wRatio = maxWidth / w;
            hRatio = maxHeight / h;
            if (maxWidth ==0 && maxHeight==0){
                ratio = 1;
            }else if (maxWidth==0){
                if (hRatio<1)  ratio = hRatio;
            }else if (maxHeight==0){
                if (wRatio<1) ratio = wRatio;
            }else if (wRatio<1 || hRatio<1){
                ratio = (wRatio<=hRatio?wRatio:hRatio);
            }
            if (ratio<1){
                w = w * ratio;
                h = h * ratio;
            }
            $(this).css('width', w);
            $(this).css('height', h);
            
        });
           
    	// document Ready END
	});
    
});