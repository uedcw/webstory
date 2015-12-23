define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'malldialog',
'doCart',
'mallpublic'
], function(module, $, dialog, doCart){

    $(document).ready(function(){
    	//初始化购物车
    	doCart.init();
    	
    	/*$('.product_pic').each(function(){
	       var obj = $(this);
	       pimsize(obj,160,160);
	    });*/
    	
    	$('.product_name').each(function(){
            if($(this).text().length>30){
                var shorttext = $(this).text().substring(0,30);
                $(this).text(shorttext);
            }
        });
    	
    	$('.option_link, .option_but').click(function(){
    		var order_id = $(this).attr('order_id');
    		a_submit(order_id);
    	});
	});

  //根据图片尺寸判断使用哪种缩放方式                 
    function pimsize(img,widths,heights){
        var w;
        var h;
        //window.alert(picimg.width);
        //window.alert(picimg.height);
        var w  = parseFloat(img.css('width').replace('px', ''));
        if(w>160){
            img.css('width','160px');
        }
        var h = parseFloat(img.css('height').replace('px', ''));
        if(h>160){
            img.css('height','160px');
        }
    }
    
  //店铺页面提交排序类型
    function a_submit(id){
        var now_id;
        var old_id =  parseInt($('#rank_form input[name="rank_type"]').val());
        id = parseInt(id);
        if(id==old_id){
            if(id>3){
                now_id = id-3;
            }else{
                now_id = id+3;
            }
        }else{
            now_id = id;
        }
        
      $('#rank_form input[name="rank_type"]').val(now_id);
      $('#submit_id').trigger('click');
    }
});