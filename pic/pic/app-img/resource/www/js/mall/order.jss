var itemPrice = new Array();	//存储物品价格区段信息
var curEditCartId = 0; 			//记录当前操作的购物车物品信息ID
var subCartIn = {cart_id:''};			//提交订单数据
var errorNum = 0;				//记录操作错误数量
var errorItem = new Array();
var doType = cart.getBuyType();

$(function(){
	if($('.cart_title').length > 0){			//step1
		doType = 0;
		cart.setBuyType(doType);				
		
		$(document).on("click",".select_company_all",function(){
			var companyId = $(this).attr('company_id');
			var checked =  $(this).prop("checked");
			$('.cart_item_'+companyId).prop("checked",checked);
		});
		$(document).on("click",".select_all",function(){
			var obj = $(this);
			var checked =  obj.prop("checked");
			$('.select_company_all').prop("checked",checked);
			$('.cart_item').prop("checked",checked);
			
			var active = 0;
			if(checked){		//删除
				active = 1;
		    }
			cart.doAllActive(active, setAllBuyIn);
		});
		$(document).on("keyup",".buy_num",function(){
			var itemIn = $(this).attr('item_in');
			var itemInArr = itemIn.split('_');
			itemInArr['isPack'] = $(this).attr('is_pack');
			setQuantity(itemInArr, 0);
		});
		$(document).on("blur",".buy_num",function(){
			var itemIn = $(this).attr('item_in');
			var itemInArr = itemIn.split('_');
			itemInArr['isPack'] = $(this).attr('is_pack');
			setQuantity(itemInArr, 1);
		});
		$(document).on("click",".del_cart_list_item",function(){ 
			var _this = $(this);
			if(confirm('确定要删除此购物车商品吗？')){
				var itemIn = _this.attr('item_in');
				itemIn += '_'+_this.attr('is_pack');
				delCartItem(itemIn, 0, setAllBuyIn);
			}
	    });
		$('#write_order_but').click(function(){
			if(!$(this).hasClass('disable')){
				checkLogin(function(){
					$('.remark').each(function(){
						var obj = $(this);
						var remarkIn = {};
						remarkIn.remark = obj.val();
						if( remarkIn.remark != ''){		//添加订单备注
							remarkIn.companyId = obj.attr('company_id');
							cart.addCartMark(remarkIn);
						}
					});
			    	location.href = 'http://'+mallDomain+'/order-step-2.html';
				})
			}
	    });
		$(document).on("click",".del_select_cart_item",function(){	//保存
			var doNum = 0;
			$('.cart_item_select').each(function() {
			   var obj = $(this);
			   if(obj.prop("checked")){		//删除
				   doNum++;
			   }
			});
			if(doNum > 0){
				if(confirm('确定要删除选中的购物车物品吗？')){
					$('.cart_item_select').each(function() {
					   var obj = $(this);
					   if(obj.prop("checked")){		//删除
						   var itemIn = obj.attr('item_in');
						   itemIn += '_'+obj.attr('is_pack');
	
						   delCartItem(itemIn, 0, setAllBuyIn);
					   }
					});
				}
			} else {
				dialog.error('请选择要删除的物品！');
			}
		});
		
		$(document).on("click",".cart_item_select",function(){	//保存
			var obj = $(this);
			
			var inArr = obj.attr('item_in').split('_');
			var isPack = $(this).attr('is_pack');
			var active = 0;
			if(obj.prop("checked")){		//删除
				active = 1;
		    }
			cart.doItemActive({
				companyId : inArr[1],
				id : inArr[2],
				price_id : inArr[3],
				purity : inArr[4],
				is_pack : isPack
			}, active, function(){
				setAllBuyIn();
				setOrderList();
			});
			
		});
		//选择
		$(document).on("click",".select_company_all", function(){	//保存
			var obj = $(this);
			var id = obj.attr('company_id');
			var active = 0;
			if(obj.prop("checked")){		//删除
				active = 1;
		    }
			cart.doCompanyActive({
				storeId : id
			}, active, setAllBuyIn);
			
		});
	} else if($('.show_cart_item_title').length > 0){	//step2
		if(doType == 1){
			$('#back_step').remove();
		}

		var checkInput = new molbaseCheck();			//表单验证
		checkInput.init();	//初始化
		
		$(document).on("change","#sel_country",function(){
			var cId = $(this).val();
			$('.area').remove();
			setArea(cId, 0);
		});
		$(document).on("change","#area_1",function(){
			var cId = $(this).val();
			var areaNum = $(this).attr('area_num');
			$('#area_2').remove();
			setArea(cId, areaNum);
		});
		
		$('#pay_but').click(function(){
			if(!$(this).hasClass('disable')){
				checkInput.checkAll(subOrder);
			}
		});
	}
	
});

function setAllBuyIn(){
	
	var cartIn = doType == 1 ? cart.buyCart : cart.cart;
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
//提交订单
function subOrder(dataIn){
	checkLogin(function(){
		var subOrderIn = mergeArray(dataIn, subCartIn);
		var area2Obj = $('#area_2');
		if(area2Obj.length > 0){
			subOrderIn['region_id'] = area2Obj.val();
		} else {
			subOrderIn['region_id'] = $('#area_1').val();
		}
		
		$('#pay_but').addClass('disable');
		$('#pay_but').html('订单提交中...');
		
		$.ajax({
	        type: 'post',
	        url: 'http://'+mallDomain+'/ajax_order?do_type=5',
	        data: {sub_data: subOrderIn},
	        dataType: 'json',
	        success: function (data) {
	           if(data.code == 1){	//订单提交成功
	        	   //cart.clearSubCartItem();
	        	   location.href = 'http://'+mallDomain+'/order-step-3.html';
	           } else {
	        	   
	           }
	        }
	    });
	});
}


function setArea(parentId, num){
	$.ajax({
        type: 'post',
        url: 'http://'+mallDomain+'/ajax_region',
        data: {parent_id: parentId},
        dataType: 'json',
        success: function (data) {
           if(data.code == 1){
        	   var pObj = null;
        	   if(num == 0){
        		   pObj = $('#sel_country');
        	   } else {
        		   pObj = $('#area_'+num);
        	   }
        	   num++;
        	   var areaObj = $('#area_'+num);
        	   if(areaObj.length > 0){
        		   areaObj.remove();
        	   }
        	   var selOptionHtml = '<select name="area_'+num+'" class="input select area" area_num="'+num+'" id="area_'+num+'" >';
        	   for(var key in data.data){
        		   selOptionHtml += '<option value="'+data.data[key]['region_id']+'">'+data.data[key]['region_name']+'</option>'
        	   }
        	   selOptionHtml += '</select>';
        	   pObj.after(selOptionHtml);
        	   if(num == 1){
        		   setArea(data.data[0]['region_id'], 1);
        	   }
           }
        }
    });
}


//获取物品价格信息
function setItemPrice(id, setItemIn){
	if(typeof itemPrice[setItemIn[0]] == 'undefined'){
		$.ajax({
	        type: 'get',
	        url: 'http://'+mallDomain+'/ajax_order?product_id='+id+'&do_type=2',
	        data: {},
	        dataType: 'json',
	        success: function (data) {
	           if(data.code == 1){
	        	   itemPrice[setItemIn[0]] = data.data;
	        	   setItemBuyIn(id, setItemIn);
	           }
	        }
	    });
	} else {
		setItemBuyIn(id, setItemIn);
	}
}

//设置新的购买数量
function setItemBuyIn(itemId, setItemIn){
	var buyNumObj = $('#buy_num_'+setItemIn[1]);
	var buyQuantity = buyNumObj.val();
	var curPriceIn = new Array();
	if(setItemIn['isPack'] == 1){
		curPriceIn = itemPrice[setItemIn[0]][setItemIn[2]][setItemIn[1]];
	} else {
		curPriceIn = getNewPrice(itemPrice[setItemIn[0]][setItemIn[2]], buyQuantity);
	}
	
	var curItemMoney = parseFloat(curPriceIn[priceType]) * parseFloat(buyQuantity);
	var editItemIn = {
		company : {
			supplier_company_id : setItemIn[4]		
		},
		item : {
			id : itemId,
			price : curPriceIn[priceType],
			quantity : buyQuantity,
			purity : curPriceIn['purity'],
			goods_price : curItemMoney,
			price_id : curPriceIn['id'],
			cart_id : setItemIn[5],
			is_pack :setItemIn['isPack']
		}
	}
	if(!setItemIn['isPack'] && setItemIn[1] != curPriceIn['id']){	//改变了价格区间
		buyNumObj.attr('id', 'buy_num_'+curPriceIn['id']);
		buyNumObj.attr('item_in', itemId+'_'+curPriceIn['id']+'_'+setItemIn[2]+'_'+setItemIn[3]+'_'+setItemIn[4]+'_'+setItemIn[5]);
	}
	cart.editItem(editItemIn, setAllBuyIn);
	
	$('#item_price_'+setItemIn[1]).html(curPriceIn[priceType]);
	$('#item_money_'+setItemIn[1]).html(toDecimal2(curItemMoney));
	
	
}

//检查购买量是否小于最低购买量
function setQuantity(setItemIn, setNewBuy){
	var itemId = setItemIn[0];
	var buyObj = $('#buy_num_'+setItemIn[1]);
	var buyQuantity = buyObj.val();
	var minQuantity = buyObj.attr('min_quantity');
	var minUnit = buyObj.attr('min_unit');
    if(buyQuantity.isInteger() && buyQuantity > 0){	
    	buyQuantity = parseFloat(buyQuantity);
    	minQuantity = parseFloat(minQuantity);
    	if(minQuantity > buyQuantity){
    		if(typeof errorItem['item_'+setItemIn[0]] == 'undefined'){
    			errorItem['item_'+setItemIn[0]] = 1;
    			errorNum++;
    		}
    		buyObj.css('color', '#F00000');
    		$('#write_order_but').addClass('disable');
    		if(setNewBuy == 1){
    			buyObj.css('color', '#000000');
    			buyObj.val(minQuantity);
    			$('#write_order_but').removeClass('disable');
  			    dialog.error('购买数量不能小于'+minQuantity+minUnit+'！');
    		}
            return false;
        } else {
        	if(typeof errorItem['item_'+setItemIn[0]] != 'undefined'){
        		delete errorItem['item_'+setItemIn[0]];
        		errorNum--;
        	}
        	setItemPrice(itemId, setItemIn);
        	$('#buy_num_'+setItemIn[1]).css('color', '#000000');
        	if(errorNum == 0){
        		$('#write_order_but').removeClass('disable');
        	}
        }
        
    } else {
    	if(typeof errorItem['item_'+setItemIn[0]] == 'undefined'){
			errorItem['item_'+setItemIn[0]] = 1;
			errorNum++;
		}
    	$('#write_order_but').addClass('disable');
    	buyObj.css('color', '#F00000');
    	if(setNewBuy == 1){
  		    dialog.error('购买数量必须为大于0的整数！', function(){
  		    	buyObj.css('color', '#000000');
    			buyObj.val(minQuantity);
    			$('#write_order_but').removeClass('disable');
    			buyObj.focus();
   		    });
    	}
    }
}

//step1数据
function setOrderList(){
	if(cart.cart.is_active){
		$('.select_all').prop("checked", true);
	}
	var cartListHtml = '';
	for(var perCompany in cart.cart.item){
		var cur_company = cart.cart.item[perCompany]['company'];
		var cCheck = cur_company['is_active'] ? 'checked' : '';
		var companyObj = $('#company_'+cur_company['supplier_company_id']);
		if(companyObj.length > 0){
			companyObj.remove();
			$('#company_product_'+cur_company['supplier_company_id']).remove();
		}
		$('#company_'+cur_company['supplier_company_id']).remove();
		cartListHtml += '<tr class="company" id="company_'+cur_company['supplier_company_id']+'"><td colspan="7">'
			+'<input type="checkbox" name="company" '+cCheck+' class="select_company_all" company_id="'+cur_company['supplier_company_id']+'"' 
			+'value="'+cur_company['supplier_company_id']+'"/> '
			+cur_company['supplier_company']+'</td></tr>'
			+'<tr id="company_product_'+cur_company['supplier_company_id']+'"><td colspan="7">'
            +'<table class="product_item">';
		
		for(var itemKey in cart.cart.item[perCompany]['itemList']){
			var curItem = cart.cart.item[perCompany]['itemList'][itemKey];
			var curCheck = curItem['is_active'] ? 'checked' : '';
			
			cartListHtml += '<tr id="item_'+curItem['id']+'_'+curItem['price_id']+'" class="per_item_'+cur_company['supplier_company_id']+'">'
	            +'<td class="select" ><input type="checkbox" '+curCheck+' name="cart_item" value="1"  is_pack="'+curItem['is_pack']+'" class="cart_item cart_item_select cart_item_'+cur_company['supplier_company_id']
				+'" item_in="'+perCompany+'_'+curItem['id']+'_'+curItem['price_id']+'_'+curItem['purity']+'" /></td>'
	            +'<td class="product_in"> <div class="img_form"><a href="http://'+mallDomain+'/goods-'+curItem['id']+'.html" title="" class="img_link"><img src="'+curItem['img']+'" /></a></div>'
                +'<div class="product_des">'
                +'<a href="http://'+mallDomain+'/goods-'+curItem['id']+'.html" title="'+curItem['name']+'">'+curItem['name'].subStr(80)+'</a>'
                +(curItem['cas_no'] != '' ? '<span>('+curItem['cas_no']+')</span>' : '')
                +'</div></td>'
	            +'<td><span id="item_purity_'+curItem['id']+'">'+curItem['purity']+'</span></td>'
	            +'<td class="add_num"><input type="text" name="item_quantity" min_unit="'+curItem['base_unit']+'" min_quantity="'+curItem['min_quantity']+'" value="'+curItem['quantity']+'" style="width:30px;" class="buy_num"'
	            +' id="buy_num_'+curItem['price_id']+'" is_pack="'+curItem['is_pack']+'" item_in="'+curItem['id']+'_'+curItem['price_id']+'_'+curItem['purity']+'_'+perCompany+'_'+curItem['cart_id']+'" /><span>'+curItem['base_unit']+'</span></td>'
	            +'<td ><span class="number" >￥<span id="item_price_'+curItem['price_id']+'">'+curItem['price']+'</span></span>'+(curItem['is_pack'] == 1 ? '' : '' )+'/'+curItem['base_unit']+'</td>'
	            +'<td><span class="number">'+(priceType == 'price_rmb' ? '￥': '$')+'<span id="item_money_'+curItem['price_id']+'">'+curItem['goods_price']+'</span></span></td>'
	            +'<td class="do">'
	            +'<!--<a href="javascript:;" class="handle">收藏</a>-->'
	            +'<a href="javascript:;" class="handle del_cart_list_item" item_in="'+perCompany+'_'+curItem['id']+'_'+curItem['price_id']+'_'+curItem['purity']+'" is_pack="'+curItem['is_pack']+'">删除</a>'
	            +'</td></tr>';
			
			
		}
		cartListHtml += '<tr id="company_remark_'+cur_company['supplier_company_id']+'"><td colspan="7">'
				+'<input type="text" value="" placeholder="补充说明信息" class="remark" company_id="'+cur_company['supplier_company_id']+'" id="cart_remark_'+cur_company['supplier_company_id']+'"/>'
				+'</td></tr></table> </td></tr>';
		
	}
	cart.resetCart(setAllBuyIn);
	$('.cart_title').after(cartListHtml);
}

//step2数据
function showOrderList(){	//doType:1直接购买
	var cartListHtml = '';
	var showItem = doType == 1 ? cart.buyCart.item : cart.cart.item;
	for(var perCompany in showItem){
		var cur_company = showItem[perCompany]['company'];
		var companyHtml = '';
		companyHtml += '<tr class="company"><td colspan="7">'+cur_company['supplier_company']+'</td></tr>'
		+'<tr><td colspan="7"><table class="product_item">';
	
		if(typeof cart.cartRemark[perCompany] != 'undefined'){
			subCartIn['remark_'+cur_company['supplier_company_id']] = cart.cartRemark[perCompany]['remark'];
		}
		var company_sub = 0;
		for(var itemKey in showItem[perCompany]['itemList']){
			var curItem = showItem[perCompany]['itemList'][itemKey];
			if(curItem['is_active'] == 1){
				subCartIn['cart_id'] += ','+curItem['cart_id'];
				companyHtml += '<tr> <td class="product_in">'
		            +'<div class="img_form show"><a href="http://'+mallDomain+'/goods-'+curItem['id']+'.html" title="" class="img_link"><img src="'+curItem['img']+'" /></a></div>'
		            +'<div class="product_des"><a href="http://'+mallDomain+'/goods-'+curItem['id']+'.html" title="'+curItem['name']+'">'+curItem['name'].subStr(80)+'</a>'
		            +(curItem['cas_no'] != '' ? '<span>('+curItem['cas_no']+')</span>' : '')
	                +'</div></td>'
		            +'<td>'+curItem['purity']+'</td><td>'+curItem['quantity']+''+curItem['base_unit']+'</td>'
		            +'<td><span class="number">'+curItem['price']+'</span>'+(curItem['is_pack'] == 1 ? '': '' )+'/'+curItem['base_unit']+'</td>'
		            +'<td><span class="number">'+(priceType == 'price_rmb' ? '￥': '$')+curItem['goods_price']+'</span></td>'
		            +'<td><span class="number">'+curItem['lead_time']+'</span>天 </td></tr>';
				company_sub = 1;
			}
		}
		if(typeof cart.cartRemark[perCompany] != 'undefined'){
			companyHtml += '<tr class="product_mark_tr"> <td colspan="6"><sapn class="product_mark">备注：'+cart.cartRemark[perCompany]['remark']+'</sapn></td></tr>'
		}
		companyHtml += '</table></td></tr>';
		if(company_sub === 1){
			cartListHtml += companyHtml;
		}
	}
	setAllBuyIn();
	$('.show_cart_item_title').after(cartListHtml);
}
