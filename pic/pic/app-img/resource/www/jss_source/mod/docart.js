/*
 * 购物车模块
 */
define(['jquery', 'store', 'malldialog', 'malluser', 'cart', 'dialogaddcart'], 
function($, store, dialog, malluser, cart, addCart){
    //var leng=window['DB'].leng;
    //操作购物车
	var doCart = {
		doType : cart.instance.getBuyType(),
		init : function(initCallBack){
			var _this = this;
		    cart.instance.getCartItem(initCallBack);
		    cart.instance.getBuyCartItem();
		    
			//购物车下拉
		    var isCartDown = 0;
		    $('.cart_button').hover(function(e){
		    	var cartItemNum = $('.cart_item_list dd').size();
		    	var showCart = hiddenCart = '';
		    	if(cartItemNum > 0) {
		    		showCart = 'header_cart';
		    		hiddenCart = 'empty_cart';
		    	} else {
		    		showCart = 'empty_cart';
		    		hiddenCart = 'header_cart';
		    	}
		        e.stopPropagation();
		        if(isCartDown) {
		            return false;
		        }
		        var isCartDown = 1;
		        var headerCartObj = $('#'+showCart);
		        headerCartObj.slideDown(260, function () {
		        	isCartDown = 0;
		        });
		        $(document).bind('mouseover', function(e) {
		            
		            var headerCartSet = headerCartObj.offset();
		            var headerCartWidth = parseFloat(headerCartObj.css('width').replace('px', ''));
		            var headerCartHeight = parseFloat(headerCartObj.css('height').replace('px', ''));

		            if( (headerCartSet.left + headerCartWidth) < e.pageX || (headerCartSet.top + 60 + headerCartHeight) < e.pageY
		                  || headerCartSet.left > e.pageX || headerCartSet.top-60 > e.pageY
		                ){
		                  headerCartObj.slideUp(260, function () {
		                });
		                $(document).unbind('mouseover');
		            }
		        });
		    });
		    
		    //添加购物车操作
		    $(document).on("click",'.exc_add_cart',function(){
		        var id = $(this).attr('product_id');
		        dialog.open({
		            url: 'http://'+mallDomain+'/ajax_order?product_id='+id+'&do_type=1',
		            contentId: 'add_cart_form',
		            title : '加入购物车'
		        }, function(){
		        	addCart.init();
		        });
		        
		    });
		    
		    //删除购物车数据
		    $(document).on("click",".del_cart_item", function(){  
		        if(confirm('确定要删除此购物车商品吗？')){
		            var curItemIn = $(this).attr('item_in');
		            var type = $(this).attr('type');
		            var curItemInArr = curItemIn.split('_');
		            if($('.cart_title').length > 0){	//订单页删除
		            	_this.delCartItem(curItemIn, type, function(){
		            		_this.setAllBuyIn();
		            		$('#item_'+curItemIn[2]+'_'+curItemIn[3]).remove();
		            	});
		            	
		            } else {
		            	 _this.delCartItem(curItemIn, type);
		            }
		        }
		    });
		    
		    //进入购物车页面
		    $('.go_button').click(function(){
		    	cart.instance.setBuyType(0);
		        location.href = 'http://'+mallDomain+'/cart.html';
		    }); 
		},
	    
	    //根据数量获取价格区间ID
	    getNewPrice : function(priceIn, quantity){
	       return cart.instance.getNewPrice(priceIn, quantity);
	    },
	    
	    //删除购物车数据
		delCartItem : function(delItemIn, type, callBack){
		    var inArr = delItemIn.split('_');
		    var mark = type == 1 ? 'header_' : '';
		    $('#'+mark+'item_'+ inArr[2]+'_'+inArr[3]).remove();
		    if(mark == 'header_'){
		        var itemObj = $('#item_'+ inArr[2]+'_'+inArr[3]);
		        if(itemObj.length > 0){
		            itemObj.remove();
		        }
		    }
		    
		    var companyObj = $('#company_'+inArr[1]);
		    if(companyObj.length > 0 && $('.per_item_'+inArr[1]).length == 0){
		        companyObj.remove();
		        $('#company_remark_'+inArr[1]).remove();
		    }
		    cart.instance.delItem({
		        companyId : inArr[1],
		        id : inArr[2],
		        price_id : inArr[3],
		        purity : inArr[4],
		        is_pack : inArr[5]
		    }, callBack);
		},
	    
	    //设置订单信息
	    setAllBuyIn : function(){
			
			var cartIn = this.doType == 1 ? cart.instance.buyCart : cart.instance.cart;
			$('#all_money').html(toDecimal2(cartIn.goods_price));
			$('#all_pay_money').html(toDecimal2(cartIn.pay_money));
			$('#cart_buy_num').html(cartIn.item_active_num);
			var selAllObj = $('.select_all');
			if(selAllObj.length > 0){
				var allChecked = selAllObj.prop("checked");

				if(cartIn.item_active_num == cartIn.item_num ){
					selAllObj.prop("checked", true);
				} else if(allChecked){
					selAllObj.prop("checked", false);
				}
			}
			//$('#discount_money').html(cartIn.discount);
			//$('#other_money').html(cartIn.other_money);
			var wObj = $('#write_order_but');
			if(cartIn.goods_price == 0){
				
				if(wObj.length > 0){
					wObj.addClass('disable');
				}
			} else {
				if(wObj.length > 0){
					wObj.removeClass('disable');
				}
			}
		}
	}
    return doCart;
});
