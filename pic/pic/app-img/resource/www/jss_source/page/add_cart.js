define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'malldialog',
'cart',
'style'
], function(module, $, dialog, cart, ssstyle){
	cart.instance.setBuyType(0);
	setDialogQuantity(0);
    //判定输入的购买数量是否合法
    $(document).on('keyup', '#dialog_buy_num', function(){
        setDialogQuantity(0);
    });
    $(document).on('blur', '#dialog_buy_num', function(){
        setDialogQuantity(1);
    });
    //选择规格
	$(document).on('click', '.dialog_purity_sel', function(){
		style.addOnClass(this, 'on');
		dialogItemDetail.defaultPurity = $(this).html();
		setPurity(1);
		$('#dialog_item_money').html(dialogItemDetail.itemIn.price);
		if(dialogItemDetail.is_pack != 1){
			setDialogQuantity(0);
		}
	});
    //操作数量
 	$(document).on('click', '.do_dialog_num', function(){
 		var buyNumObj = $('#dialog_buy_num');
 		var buyQuantity = buyNumObj.val();
 	    if(buyQuantity.isInteger()){
 	    	
 	    	buyQuantity = parseFloat(buyQuantity);
 	    	
 	    	var curItemIn = {
 	     	    id : dialogItemDetail.itemIn.id,
 	     	    purity : dialogItemDetail.itemIn.purity,
 	         	supplier_company_id : dialogItemDetail.companyIn.supplier_company_id
 	        };
 	    	var allQuantity = buyQuantity + cart.instance.getItemNum(curItemIn);
 	    	
	 		if($(this).hasClass('add')){
	 			buyQuantity = buyQuantity + 1;
	 		} else if($(this).hasClass('reduce')){
	 			if(allQuantity > dialogItemDetail.minQuantity && buyQuantity > 1){
	 				buyQuantity = buyQuantity - 1;	
	 			} else {
	 				return false; 
	 			}
	 		}
	 		buyNumObj.val(buyQuantity);
	 		setDialogQuantity(0);
 	    } else {
 	    	return false;
 	    }
 	});
 	
    $(document).on('click','#add_cart_dialog_but',function(){
    	setDialogQuantity(0);
    	if(!$(this).hasClass('disable')){
	    	cart.instance.shopping(dialogItemDetail.itemIn.id, dialogItemDetail.itemIn.img, 'cart_item_'+dialogItemDetail.itemIn.id);
	        if(!$(this).hasClass('disable')){
	        	dialog.closeBox();
	        	var curAddItem = new Array();
	        	curAddItem = cloneObj(dialogItemDetail.itemIn);
	        	cart.instance.addItem({
	            	goods_price : curAddItem.goods_price,
	            	item : curAddItem,
	            	level : dialogItemDetail.showLevel,
	                company : dialogItemDetail.companyIn
	            }, dialogItemDetail.priceIn[dialogItemDetail.showLevel][dialogItemDetail.defaultPurity]);
	        }
    	}
    });
    $(document).on('click', '.dialog_price_option', function(){
    	var buyNumObj = $('#dialog_buy_num');
    	var addCartObj = $('#add_cart_dialog_but');
    	addCartObj.removeClass('disable');
    	style.addOnClass(this, 'on');
    	buyNumObj.css('color', '#000000');
    	dialogItemDetail.itemIn.price_id = $(this).attr('price_id');
    	dialogItemDetail.itemIn.price    = $('#dialog_price_'+dialogItemDetail.itemIn.price_id).html();
    	var quantity = 0;
    	if(dialogItemDetail.is_pack == 1){
    		quantity = buyNumObj.val();
    	} else {
        	var startQuantity = $('#dialog_start_pack_num_'+dialogItemDetail.itemIn.price_id).html();
        	quantity = parseFloat(startQuantity) >= parseFloat(dialogItemDetail.minQuantity) ? startQuantity : dialogItemDetail.minQuantity;
        	buyNumObj.val(quantity);
    	}
    	$('#dialog_item_money').html(dialogItemDetail.itemIn.price);
    	dialogItemDetail.itemIn.quantity = quantity;
    	setDialogAllMoney();
    });
    
    dialogBuyQuantity = $('#dialog_buy_text').val();
    dialogPriceId = $('.dialog_price_option.on').attr('price_id');
    dialogPrice   = $('#dialog_price_'+dialogPriceId).html();
	    
	//检查购买量是否合法，并执行设置价格操作
	function setDialogQuantity(open){
		var buyNumObj = $('#dialog_buy_num');
		var buyQuantity = buyNumObj.val();
		var addCartObj = $('#add_cart_dialog_but');
	    if(buyQuantity.isInteger() && buyQuantity > 0){
	    	buyQuantity = parseFloat(buyQuantity);
	    	addCartObj.removeClass('disable');
	    	var curItemIn = {
	     	    id : dialogItemDetail.itemIn.id,
	     	    purity : dialogItemDetail.itemIn.purity,
	         	supplier_company_id : dialogItemDetail.companyIn.supplier_company_id
	        };
	    	var allQuantity = buyQuantity + cart.instance.getItemNum(curItemIn);
	    	
	    	if(allQuantity < parseFloat(dialogItemDetail.minQuantity)){
	    		
	    		buyNumObj.css('color', '#F00000');
	        	
	    		addCartObj.addClass('disable');
	    		if(open == 1){
	    			buyNumObj.val(dialogItemDetail.minQuantity);
	    			buyNumObj.css('color', '#000000');
	    			addCartObj.removeClass('disable');
	  			  	dialog.error('购买数不能小于'+dialogItemDetail.minQuantity+dialogItemDetail.minUnit+'！',function(){
	  			  		$('#pay_but').removeClass('disable');
	  			  		addCartObj.focus();
	                });
	    		}
	            return false;
	        } else {
	        	addCartObj.removeClass('disable');
	        	$('#buy_num').css('color', '#000000');
	        	if(dialogItemDetail.is_pack == 1){
	        		
	        		if(dialogItemDetail.itemIn.defaultPurity != ''){
	        			setPurity();
	        			$('#dialog_item_money').html(dialogItemDetail.itemIn.price);
	        		} else {
	        			$('.dialog_purity_sel:eq(0)').click();
	        		}
	        	} else {
	        		var curAddPriceIn = cart.doCart.getNewPrice(dialogItemDetail.priceIn[dialogItemDetail.showLevel][dialogItemDetail.defaultPurity],  buyQuantity);
	        		style.addOnClass('dialog_price_form_'+curAddPriceIn['id'], 'on');
	            	$('#dialog_item_money').html(curAddPriceIn[priceType]);
	            	
	            	
	            	dialogItemDetail.itemIn.direct_buy_price = curAddPriceIn[priceType];
	            	dialogItemDetail.itemIn.direct_buy_price_id = curAddPriceIn['id'];
	            	
	            	var curPriceIn = cart.doCart.getNewPrice(dialogItemDetail.priceIn[dialogItemDetail.showLevel][dialogItemDetail.defaultPurity], allQuantity);
	            	dialogItemDetail.itemIn.price = curPriceIn[priceType];
	            	dialogItemDetail.itemIn.price_id = curPriceIn['id'];
	            	
	        	}
	        	
	        	dialogItemDetail.itemIn.quantity = buyQuantity;
	        	setDialogAllMoney();
	        }
	        
	    } else {
	    	addCartObj.addClass('disable');
	    	buyNumObj.css('color', '#F00000');
	    	if(open == 1){
	    		buyNumObj.val(dialogItemDetail.minQuantity);
	    		buyNumObj.css('color', '#000000');
	    		addCartObj.removeClass('disable');
	    		
	    		dialog.error('购买数量必须为大于0的数字！', function(){
	    			$('#pay_but').removeClass('disable');
	    			addCartObj.focus();
	    		});
	    	}
	    }
	}
	
	function setDialogAllMoney(){
	    
		dialogItemDetail.itemIn.goods_price = parseFloat(dialogItemDetail.itemIn.quantity ) * parseFloat(dialogItemDetail.itemIn.price);
	    //$('#dialog_all_money').html(itemDetail.itemIn.goods_price); 
	}
	
	
	function setPurity(changePrice){
		var curOptionNum = dialogItemDetail.defaultPurity.replace('%', '');
	    curOptionNum = curOptionNum.replace('.', '');
	    
		$('.dialog_price_option').css('display', 'none');
		$('.dialog_price_option_'+curOptionNum).css('display', '');
		if(dialogItemDetail.itemIn.price == 0 || changePrice == 1){
			var priceObj = $('.dialog_price_option_'+curOptionNum+':eq(0)');
			dialogItemDetail.itemIn.price_id = priceObj.attr('price_id');
			style.addOnClass(priceObj, 'on');
			dialogItemDetail.itemIn.price = $('#dialog_price_'+dialogItemDetail.itemIn.price_id).html();
		} else if(dialogItemDetail.itemIn.price_id > 0){
			style.addOnClass($('#dialog_price_form_'+dialogItemDetail.itemIn.price_id), 'on');
		} else {
			var priceId = $('.dialog_price_option.on').attr('price_id');
			if(typeof priceId != 'undefined'){
				dialogItemDetail.itemIn.price_id = priceId;
				dialogItemDetail.itemIn.price    = $('#dialog_price_'+dialogItemDetail.itemIn.price_id).html();
			}
		}
		if(dialogItemDetail.is_pack == 1){
        	//$('#dialog_detail_product_money').html(itemDetail.itemIn.price);
        	//$('#old_dialog_detail_product_money').html($('#old_price_'+itemDetail.itemIn.price_id).val());
        }
		dialogItemDetail.itemIn.purity = dialogItemDetail.defaultPurity;
	}
});
	