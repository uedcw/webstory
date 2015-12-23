/*
 * 购物车模块
 */
define(['jquery', 'store', 'malldialog', 'malluser'], 
function($, store, dialog, malluser){
    //var leng=window['DB'].leng;
	//molbase mall 购物车
	var molbaseCart = function(setOption) {
	    var _this = this;
	    _this.defaultCart = {
	        user_id : 0,            //用户ID
	        session_id : '',        //记录当前未登录时的session_id
	        is_active : 1,          //订单详细页操作
	        item_num : 0,
	        item_active_num : 0,    //激活购买的数量
	        goods_price : 0,        //记录商品激活的总价
	        cart_all_goods_price : 0, //记录购物车商品总价，包括未激活的
	        pay_money :0,           //应支付的钱数
	        discount : 0,           //折扣,为负值
	        other_money :   0,      //其他 可以为负值也可以为正值
	        item:{}                 //产品信息 结构为商家ID->{商家信息（company），产品列表（item）}->产品详细信息
	    };
	    _this.cart = {};
	    _this.buyCart = {};         //记录直接购买的物品
	    _this.cartRemark = {};      //记录购物车备注
	    
	    //从本地存储获取购物车数据
	    _this.getCartItem = function(callBack){
	    	var localCart = store.get('molbaseCartItem');
	        _this.cartRemark = store.get('molbaseCartRemark');
	        if(typeof _this.cartRemark == 'undefined'){
	            _this.cartRemark = {};
	        }
	        if(typeof localCart == 'undefined' || typeof localCart.user_id == 'undefined'){ //初始化购物车
	        	localCart = cloneObj(_this.defaultCart)
	            store.set('molbaseCartItem', localCart);
	        }
	        _this.cart = store.get('molbaseCartItem');
	        //设置头部购物车数据
	        _this.setHomeCart();
	        
	        //_this.clearCart();
	        malluser.getUserIn(function(userData){
	        	if(typeof userData.user_id == 'undefined' || userData.user_id == 0){    	//未登录
	        		localCart.user_id = 0;
	        	}
	            if(localCart.user_id == 0 && localCart.session_id == ''){ 					//初始化购物车
	                if(typeof userData.user_id != 'undefined' && userData.user_id != 0){    //已登录
	                    _this.defaultCart.user_id = userData.user_id;
	                } else {
	                    _this.defaultCart.session_id = userData.session_id;
	                }
	                _this.cart = cloneObj(_this.defaultCart);
	                store.set('molbaseCartItem', _this.cart);
	                _this.resetCart();
	                //设置头部购物车数据
	                if(typeof callBack == 'function'){
	                    callBack();
	                }
	            } else {
	                if(typeof userData.user_id != 'undefined' && userData.user_id != 0){    //已登录
	                    
	                    if(userData.user_id != localCart.user_id ){     //购物车物品不是本人登陆的物品
	                        if(localCart.user_id == 0 ){                //合并购物车物品               
	                            _this.setCartItemToUser(function(){
	                                _this.readUserCartItem(callBack);
	                            });
	                        } else {
	                            //初始化用户购物车物品
	                            _this.clearCart();
	                            _this.cart.user_id = userData.user_id;
	                            _this.readUserCartItem(callBack);
	                        }
	                    } else {
	                        _this.readUserCartItem(callBack);
	                    }
	                } else {
	                   _this.readSessionCartItem(callBack);
	                }
	            }
	        });
	    }
	    //初始化数据库记录的用户购物车物品
	    _this.readUserCartItem = function(callBack){
	        $.ajax({
	            type: 'post',
	            url: 'http://'+mallDomain+'/ajax_order?do_type=7',
	            data: {user_id : _this.cart.user_id},
	            dataType: 'json',
	            success: function (data) {
	                if(data.code == 1){
	                    _this.cart = data.data;
	                } else {
	                    _this.clearCart();
	                }
	                _this.resetCart();
	                if(typeof callBack == 'function'){
	                    callBack();
	                }
	            }
	        });
	    }
	    //初始化数据库记录的未登陆用户购物车物品
	    _this.readSessionCartItem = function(callBack){
	        $.ajax({
	            type: 'post',
	            url: 'http://'+mallDomain+'/ajax_order?do_type=8',
	            data: {session_id : _this.cart.session_id},
	            dataType: 'json',
	            success: function (data) {
	                if(data.code == 1){
	                    _this.cart = data.data;
	                } else {
	                    _this.clearCart();
	                }
	                _this.resetCart();
	                if(typeof callBack == 'function'){
	                    callBack();
	                }
	            }
	        });
	    }
	    //设置购物车物品所属用户
	    _this.setCartItemToUser = function(callBack){
	        
	        $.ajax({
	            type: 'post',
	            url: 'http://'+mallDomain+'/ajax_order?do_type=6',
	            data: {session_id:_this.cart.session_id},
	            dataType: 'json',
	            success: function (data) {
	                if(data.code == 1){ //设置成功
	                    _this.cart.user_id = data.data.user_id;
	                    _this.resetCart(); 
	                }
	                if(typeof callBack == 'function'){
	                    callBack();
	                }
	            }
	        });
	    }
		//纯度key
		_this.getPurityKey = function(purity){
			var pattern = new RegExp("[`\\\\''\\\"]");
			var rs = ""; 
			for (var i = 0; i < purity.length; i++) { 
				rs += purity.substr(i, 1).replace(pattern, '='); 
			} 
			rs = rs.replace(/\s+/g, '+');
			rs = rs.replace(/_/g, '-');
			return rs; 
		},
	    //从本地获取直接购买的商品
	    _this.getBuyCartItem = function(){
	        
	        var localBuyCart = store.get('molbaseBuyCartItem');
	        if(typeof localBuyCart == 'undefined'){ //初始化购物车
	            store.set('molbaseBuyCartItem', cloneObj(_this.defaultCart));
	            _this.buyCart = store.get('molbaseBuyCartItem');
	        } else {
	            //store.set('molbaseBuyCartItem', _this.defaultCart);
	            _this.buyCart = localBuyCart;
	        }
	    }
	    
	    //设置当前购物类型 type 1：直接购物， 0：加购物车
	    _this.setBuyType = function(type){
	        store.set('doType', type);
	    }
	    
	    //获取当前购物类型 type 1：直接购物， 0：加购物车
	    _this.getBuyType = function(){
	        return store.get('doType');
	    }
	    
	    //添加商品到购物车
	    _this.addItem = function(addItemIn, itemPriceIn, callBack){
			addItemIn.item.purity = _this.getPurityKey(addItemIn.item.purity);
	        var cKey = 'company_'+addItemIn.company.supplier_company_id;
	        var iKey = 'item_'+addItemIn.item.id+'_'+addItemIn.item.purity;
	        if(addItemIn.item['is_pack'] == 1){ //按包装购买
	            iKey += '_'+addItemIn.item['price_id'];
	        } else {
	            iKey += '_0';
	        }
	        var setQuantity = 0;
	        setQuantity +=  parseFloat(addItemIn.item.quantity);
	        if(typeof _this.cart.item[cKey] != 'undefined'){                            //已存在此商家的物品
	            if(typeof _this.cart.item[cKey]['itemList'][iKey] != 'undefined'){      //已添加过此商品
	                setQuantity += parseFloat(_this.cart.item[cKey]['itemList'][iKey]['quantity']);
	                var curPriceIn = null; 
	                if(addItemIn.item['is_pack'] == 1){
	                    curPriceIn = itemPriceIn[addItemIn.item['price_id']];   
	                } else {
	                    curPriceIn = _this.getNewPrice(itemPriceIn, setQuantity);
	                }
	                if(curPriceIn['id'] != _this.cart.item[cKey]['itemList'][iKey]['price_id']){        //改变了价格区间
	                    var oldItem =  _this.cart.item[cKey]['itemList'][iKey];
	                     _this.cart.item[cKey]['itemList'][iKey] =  oldItem;
	                     
	                     var oldGoodsPrice =  parseFloat(oldItem['goods_price']);
	                     
	                     _this.cart.item[cKey]['itemList'][iKey]['goods_price'] = parseFloat(curPriceIn[priceType]) * setQuantity;
	                     _this.cart.item[cKey]['itemList'][iKey]['price_id'] = curPriceIn['id'];
	                     _this.cart.item[cKey]['itemList'][iKey]['price'] = curPriceIn[priceType];
	                     _this.cart.goods_price = parseFloat(_this.cart.goods_price) - oldGoodsPrice 
	                        + parseFloat(_this.cart.item[cKey]['itemList'][iKey]['goods_price']);
	                     
	                     _this.cart.cart_all_goods_price =  parseFloat(_this.cart.cart_all_goods_price) - oldGoodsPrice 
	                        + parseFloat(_this.cart.item[cKey]['itemList'][iKey]['goods_price']);
	                    
	                } else {
	                    var cur_goods_price = parseFloat(addItemIn.item.quantity) * parseFloat(curPriceIn[priceType]);
	                    
	                    _this.cart.goods_price = parseFloat(_this.cart.goods_price) + cur_goods_price;
	                    
	                    _this.cart.cart_all_goods_price = parseFloat(_this.cart.cart_all_goods_price) + cur_goods_price;
	                    
	                    _this.cart.item[cKey]['itemList'][iKey]['goods_price'] = parseFloat(_this.cart.item[cKey]['itemList'][iKey]['goods_price']) 
	                        +parseFloat(cur_goods_price);
	                }
	                _this.cart.item[cKey]['itemList'][iKey]['quantity'] = setQuantity;
	                //修改数据库记录的购物车物品
	                _this.cartRecord({
	                    product_id : addItemIn.item.id,
	                    price_id : curPriceIn['id'],
	                    cartId : _this.cart.item[cKey]['itemList'][iKey]['cart_id'],
	                    price : curPriceIn[priceType],
	                    quantity :  setQuantity,
	                    purity : curPriceIn['purity'],
	                    total_price :  _this.cart.item[cKey]['itemList'][iKey]['goods_price'],
	                    min_quantity : _this.cart.item[cKey]['itemList'][iKey]['min_quantity'],
	                    price_type : priceType,
	                    doCart : 1
	                });
	                
	            } else {
	                if(setQuantity >= addItemIn.item.min_quantity){
	                    _this.addNewItem(addItemIn);
	                }
	            }
	        } else if(setQuantity >= addItemIn.item.min_quantity){
	            _this.cart.item[cKey] = {
	                company : {}, itemList : {}
	            };
	            addItemIn.company['is_active'] = 1; 
	            _this.cart.item[cKey]['company'] = addItemIn.company;
	            _this.addNewItem(addItemIn);
	        }
	        if(typeof callBack == 'function'){
	            callBack();
	        }
	    };
	    
	    //根据数量获取价格区间ID
	    _this.getNewPrice = function(priceIn, quantity){
	        var returnPrice = new Array();
	        var maxNumPriceIn  = new Array();
	        var minNumPriceIn  = new Array();
	        $.each(priceIn, function(key, priceIn) {  
	            if(quantity >= priceIn['start_pack_num'] ){
	                if(priceIn['end_pack_num'] >= quantity || priceIn['end_pack_num'] == 0){
	                    returnPrice = priceIn;
	                    return false;
	                }
	            }
	            if(typeof maxNumPriceIn['end_pack_num'] != 'undefined'){
	                maxNumPriceIn = priceIn['end_pack_num'] > maxNumPriceIn['end_pack_num'] ? priceIn : maxNumPriceIn;
	            } else {
	                maxNumPriceIn = priceIn;
	            }
	            
	            if(typeof minNumPriceIn['start_pack_num'] != 'undefined'){
	                minNumPriceIn = priceIn['start_pack_num'] < minNumPriceIn['start_pack_num'] ? priceIn : minNumPriceIn;
	            } else {
	                minNumPriceIn = priceIn;
	            }
	        });
	        
	        if(returnPrice.length == 0){
	             if(quantity >= maxNumPriceIn['end_pack_num']){
	                 returnPrice = maxNumPriceIn;
	             } else if(quantity <= minNumPriceIn['start_pack_num']){
	                 returnPrice = minNumPriceIn;
	             }

	        }
	        return returnPrice;
	    };
	    
	    //直接购买
	    _this.addBuyItem = function(addItemIn, callBack){
	        _this.clearBuyCart();
	        _this.buyCart.item_num++;
	        _this.buyCart.item_active_num++;
	        addItemIn.item.is_active = 1;
	        addItemIn.item.purity = _this.getPurityKey(addItemIn.item.purity);
	        var cKey = 'company_'+addItemIn.company.supplier_company_id;
	        var iKey = 'item_'+addItemIn.item.id+'_'+addItemIn.item.purity;
	        if(addItemIn.item['is_pack'] == 1){ //按包装购买
	            iKey += '_'+addItemIn.item['price_id'];
	        } else {
	            iKey += '_0';
	        }
	        _this.buyCart.item[cKey] = {
	            company : {}, itemList : {}
	        };
			addItemIn.item['show_purity'] = addItemIn.item.purity;
	        _this.buyCart.item[cKey]['company'] = addItemIn.company;
	        _this.buyCart.item[cKey]['itemList'][iKey] = addItemIn.item;
	        _this.buyCart.goods_price =  parseFloat(addItemIn.item.goods_price);    //添加总价格
	        _this.buyCart.pay_money   = addItemIn.goods_price;
	        //数据库记录购物车物品
	        _this.recordNewItem(addItemIn, callBack);
	        
	    }
	    
	    //添加新物品到数据
	    _this.addNewItem = function(addItemIn){
	        _this.cart.item_num++;
	        addItemIn.item.is_active = 1;
			addItemIn.item.purity = _this.getPurityKey(addItemIn.item.purity);
	        var cKey = 'company_'+addItemIn.company.supplier_company_id;
	        var iKey = 'item_'+addItemIn.item.id+'_'+addItemIn.item.purity;

	        if(addItemIn.item['is_pack'] == 1){ //按包装购买
	            iKey += '_'+addItemIn.item['price_id'];
	        } else {
	            iKey += '_0';
	        }
	        addItemIn.item.is_active = 1;
	        _this.cart.item[cKey]['itemList'][iKey] = addItemIn.item;
	        _this.cart.goods_price = parseFloat(_this.cart.goods_price) + parseFloat(addItemIn.item.goods_price);   //添加总价格
	        _this.cart.cart_all_goods_price = parseFloat(_this.cart.cart_all_goods_price) + parseFloat(addItemIn.item.goods_price);
	        _this.recordNewItem(addItemIn);
	        
	    }
	    
	    //数据库记录购物车物品
	    _this.recordNewItem = function(addItemIn, callBack){
	        _this.cartRecord({
	            product_id : addItemIn.item.id,
	            goods_price : addItemIn.item.goods_price,
	            quantity : addItemIn.item.quantity,
	            unit : addItemIn.item.pack_unit,
	            unit_price : addItemIn.item.price,
	            purity :  addItemIn.item.purity,
	            supplier_company_id : addItemIn.company.supplier_company_id,
	            min_quantity : addItemIn.item.min_quantity,
	            price_id : addItemIn.item.price_id,
	            lead_time : addItemIn.item.lead_time,
	            is_pack : addItemIn.item.is_pack,
	            session_id : _this.cart.session_id,
	            doCart : 3
	        }, callBack);

	    }
	    
	    //设置购物车支付费用
	    _this.setPayMoney = function(doType){
	         if(doType == 1){
	            //设置直接购买购物车支付费用
	             _this.buyCart.pay_money = parseFloat(_this.buyCart.goods_price) 
	                + parseFloat(_this.buyCart.discount) 
	                + parseFloat(_this.buyCart.other_money);
	         } else {
	             _this.cart.pay_money = parseFloat(_this.cart.goods_price) 
	                + parseFloat(_this.cart.discount) 
	                + parseFloat(_this.cart.other_money);
	         }
	    }
	    
	    //修改购物车商品
	    _this.editItem = function(editItemIn, callBack){
	    	editItemIn.item.purity = _this.getPurityKey(editItemIn.item.purity);
	        var cKey = 'company_'+editItemIn.company.supplier_company_id;
	        var iKey = 'item_'+editItemIn.item.id+'_'+editItemIn.item.purity;

	        if(editItemIn.item['is_pack'] == 1){    //按包装购买
	            iKey += '_'+editItemIn.item['price_id'];
	        } else {
	            iKey += '_0';
	        }

	        var all_money = parseFloat(_this.cart.goods_price);
	        if(editItemIn.item.quantity > 0 && editItemIn.item.quantity >= _this.cart.item[cKey]['itemList'][iKey]['min_quantity']){
	            //重置购物车总金额
	            _this.cart.goods_price = all_money - parseFloat(_this.cart.item[cKey]['itemList'][iKey]['goods_price']) 
	            + parseFloat(editItemIn.item.goods_price);
	            
	            _this.cart_all_goods_price = parseFloat(_this.cart.cart_all_goods_price) - parseFloat(_this.cart.item[cKey]['itemList'][iKey]['goods_price']) 
	            + parseFloat(editItemIn.item.goods_price);
	            
	            _this.cart.item[cKey]['itemList'][iKey]['goods_price'] = editItemIn.item.goods_price;
	            _this.cart.item[cKey]['itemList'][iKey]['quantity'] = editItemIn.item.quantity;
	            _this.cart.item[cKey]['itemList'][iKey]['price'] = editItemIn.item.price;
	            _this.cart.item[cKey]['itemList'][iKey]['price_id'] = editItemIn.item.price_id;
	            _this.setPayMoney();
	            //修改数据库记录的购物车物品
	            _this.cartRecord({
	                product_id : editItemIn.item.id,
	                cartId : _this.cart.item[cKey]['itemList'][iKey]['cart_id'],
	                purity :  editItemIn.item.purity,
	                price_id : editItemIn.item.price_id,
	                quantity :  editItemIn.item.quantity,
	                total_price : editItemIn.item.goods_price,
	                min_quantity : _this.cart.item[cKey]['itemList'][iKey]['min_quantity'],
	                doCart : 1
	            });
	            if(typeof callBack == 'function'){
	                callBack();
	            }
	        }
	    }
	    //获取购物车物品的数量
	    _this.getItemNum = function(curItemIn){
			curItemIn.purity = _this.getPurityKey(curItemIn.purity);
	        var cKey = 'company_'+curItemIn.supplier_company_id;
	        var iKey = 'item_'+curItemIn.id+'_'+curItemIn.purity;
	        if(curItemIn['is_pack'] == 1){  //按包装购买
	            iKey += '_'+curItemIn['price_id'];
	        } else {
	            iKey += '_0';
	        }
	        if(typeof _this.cart.item[cKey] !=  'undefined'){
	            if(typeof _this.cart.item[cKey]['itemList'][iKey] !=  'undefined'){
	                
	                return  parseFloat(_this.cart.item[cKey]['itemList'][iKey]['quantity']);
	                
	            } else { return 0; }
	        } else { return 0; }
	    }
	    //设置物品的激活状态
	    _this.doItemActive = function(doItemIn, active, callBack){
			doItemIn.purity = _this.getPurityKey(doItemIn.purity);
	        var cKey = 'company_'+doItemIn.companyId;
	        var iKey = 'item_'+doItemIn.id+'_'+doItemIn.purity;

	        if(doItemIn['is_pack'] == 1){   //按包装购买
	            iKey += '_'+doItemIn['price_id'];
	        } else {
	            iKey += '_0';
	        }
	        if(typeof _this.cart.item[cKey]['itemList'][iKey] !=  'undefined'){
	            var curItem = _this.cart.item[cKey]['itemList'][iKey];
	            if(active == 1 && curItem['is_active'] == 0){
	                _this.cart.goods_price = parseFloat(_this.cart.goods_price) + parseFloat(curItem['goods_price']);
	                _this.cart.item_active_num++; 
	            } else if(active == 0 && curItem['is_active'] == 1){
	                _this.cart.item_active_num--;
	                _this.cart.goods_price = parseFloat(_this.cart.goods_price) - parseFloat(curItem['goods_price']);
	            } else {
	                return false;
	            }
	            _this.cart.item[cKey]['itemList'][iKey]['is_active'] = active;
	            //数据库记录购物车物品
	            _this.cartRecord({
	                cartId : _this.cart.item[cKey]['itemList'][iKey]['cart_id'],
	                doCart : 2,
	                is_active : active
	            });
	            _this.resetCart();
	            if(typeof callBack == 'function'){
	                callBack();
	            }
	        }
	    }
	    //设置公司的激活状态
	    _this.setCompanyActive = function(){
	        for(var perCompany in _this.cart.item){
	            var is_active = 1;
	            for(var ikey in _this.cart.item[perCompany]['itemList']){
	                if( _this.cart.item[perCompany]['itemList'][ikey]['is_active'] != 1){
	                    is_active = 0;
	                }
	            }
	            _this.cart.item[perCompany]['company']['is_active'] = is_active;
	        }
	    }
	    //设置购物车供应商物物品的激活状态
	    _this.doCompanyActive = function(companyIn, active, callBack){
	        var cKey = 'company_'+companyIn.storeId;
	        
	        if(typeof _this.cart.item[cKey]!=  'undefined'){
	            for(var itemKey in _this.cart.item[cKey]['itemList']){
	                var curItem = _this.cart.item[cKey]['itemList'][itemKey];
	                
	                if(active == 1 && curItem['is_active'] == 0){
	                    _this.cart.item_active_num++;
	                    _this.cart.goods_price = parseFloat(_this.cart.goods_price) + parseFloat(curItem['goods_price']);
	                } else if(active == 0 && curItem['is_active'] == 1){
	                    _this.cart.item_active_num--;
	                    _this.cart.goods_price = parseFloat(_this.cart.goods_price) - parseFloat(curItem['goods_price']);
	                }
	                
	                _this.cart.item[cKey]['itemList'][itemKey]['is_active'] = active;
	            }
	            _this.cart.item[cKey]['company']['is_active'] = active;
	            //数据库记录购物车物品
	            _this.cartRecord({
	                storeId :companyIn.storeId,
	                doCart : 2,
	                is_active : active
	            });
	            _this.resetCart();
	            if(typeof callBack == 'function'){
	                callBack();
	            }
	        }
	    }
	    
	    //设置全部商品状态
	    _this.doAllActive = function(active, callBack){
	        if(_this.cart.item_num > 0){
	            var storeId = '';
	            for(var perCompany in _this.cart.item){
	                storeId += ','+_this.cart.item[perCompany]['company']['supplier_company_id'];
	                _this.cart.item[perCompany]['company']['is_active'] = active;
	                for(var itemKey in _this.cart.item[perCompany]['itemList']){
	                    var curItem = _this.cart.item[perCompany]['itemList'][itemKey];
	                    
	                    if(active == 1 && curItem['is_active'] == 0){
	                        _this.cart.goods_price = parseFloat(_this.cart.goods_price) + parseFloat(curItem['goods_price']);
	                    } else if(active == 0 && curItem['is_active'] == 1){
	                        _this.cart.goods_price = parseFloat(_this.cart.goods_price) - parseFloat(curItem['goods_price']);
	                    }
	                    
	                    _this.cart.item[perCompany]['itemList'][itemKey]['is_active'] = active;
	                }
	            }
	            if(active){
	                _this.cart.item_active_num = _this.cart.item_num;
	            } else {
	                _this.cart.item_active_num = 0;
	            }
	            
	            _this.cart.is_active = active;
	            //数据库记录购物车物品
	            _this.cartRecord({
	                storeId :storeId,
	                doCart : 2,
	                is_active : active
	            });
	            _this.resetCart();
	            if(typeof callBack == 'function'){
	                callBack();
	            }
	        }
	    }
	    //记录订单备注
	    _this.addCartMark = function(remarkIn){
	        var cKey = 'company_'+remarkIn['companyId'];
	        _this.cartRemark[cKey] = {
	            remark : remarkIn['remark']         
	        };
	        store.set('molbaseCartRemark', _this.cartRemark);
	    }
	    //删除商品
	    _this.delItem = function(delIn, callBack){
			delIn.purity = _this.getPurityKey(delIn.purity);
	        var cKey = 'company_'+delIn.companyId;
	        var iKey = 'item_'+delIn.id+'_'+delIn.purity ;
	        if(delIn['is_pack'] == 1){  //按包装购买
	            iKey += '_'+delIn['price_id'];
	        } else {
	            iKey += '_0';
	        }
	        if(typeof _this.cart.item[cKey]['itemList'][iKey] !=  'undefined'){
	            if(_this.cart.item[cKey]['itemList'][iKey]['is_active'] == 1){  //激活状态才减去价格
	                _this.cart.goods_price = parseFloat(_this.cart.goods_price) 
	                    - parseFloat(_this.cart.item[cKey]['itemList'][iKey]['goods_price']);
	            }
	            _this.cart.cart_all_goods_price = parseFloat(_this.cart.cart_all_goods_price) 
	                - parseFloat(_this.cart.item[cKey]['itemList'][iKey]['goods_price']);
	            
	            //数据库记录购物车物品
	            _this.cartRecord({
	                cartId : _this.cart.item[cKey]['itemList'][iKey]['cart_id'],
	                doCart : 0
	            });
	            delete _this.cart.item[cKey]['itemList'][iKey];
	            if(getObjLength(_this.cart.item[cKey]['itemList']) == 0){
	                delete _this.cart.item[cKey];
	            }
	            if(typeof _this.cart.item == 'undefined'){
	                _this.cart.item = {};
	            }
	            _this.cart.item_active_num--;
	            _this.cart.item_num--;
	            _this.resetCart(callBack);
	        }
	    }
	    
	    //清除已提交的订单物品
	    _this.clearSubCartItem = function(){
	        _this.setBuyType(0);
	        if(_this.cart.item_num > 0){
	            var storeId = '';
	            for(var perCompany in _this.cart.item){
	                for(var itemKey in _this.cart.item[perCompany]['itemList']){
	                    var curItem = _this.cart.item[perCompany]['itemList'][itemKey];
	                    
	                    if( curItem['is_active'] == 1){ 
	                        _this.delItem({
	                            id : curItem['id'],
	                            companyId : _this.cart.item[perCompany]['company']['supplier_company_id'],
	                            purity: curItem['purity']
	                        });
	                    }
	                }
	            }
	            _this.resetCart();
	        }
	    }
	    
	    _this.resetCart = function(callBack){
	    	_this.setCompanyActive();
	        _this.setPayMoney();
	        
	        store.set('molbaseCartItem', _this.cart);
	        _this.setHomeCart();
	        if(typeof callBack == 'function'){
	            callBack();
	        }
	    }
	    
	    _this.resetBuyCart = function(){
	        _this.setPayMoney(1);
	        
	        store.set('molbaseBuyCartItem', _this.buyCart);
	    }
	    //重置购物车
	    _this.clearCart = function(){
	        //如果本地初始化过session_id,则用本地的，否则生成新的session_id
	        if( _this.cart.session_id != ''){
	            _this.defaultCart.session_id = _this.cart.session_id;
	        }
	        if( _this.cart.user_id != ''){
	            _this.defaultCart.user_id = _this.cart.user_id;
	        }
	        _this.cart =  cloneObj(_this.defaultCart);
	        _this.resetCart();
	    }
	    
	    _this.clearBuyCart = function(){
	        _this.buyCart =  cloneObj(_this.defaultCart);
	        _this.resetBuyCart();
	    }
	    //同步数据到数据库
	    _this.cartRecord = function(cartIn, callBack){
	        var subData = {};
	        if(typeof cartIn['doCart'] == 3){   //记录添加物品
	            subData = cartIn;
	        } else {
	            if(typeof cartIn['doCart'] != 'undefined'){ //doCart 1：修改  0:删除  2:操作激活状态
	                subData = cartIn;
	            } else {    //没有操作类型
	                return -1;
	            }
	        }
	        if(cartIn.doCart == 1 && cartIn.doCart == 3){
	            if(cartIn.min_quantity > cartIn.quantity){
	                return -2;
	            }
	        }
	        if(_this.getBuyType() == 1){    //直接购买
	            subData['direct_buy'] = 1;
	        }
	        $.ajax({
	            type: 'post',
	            url: 'http://'+mallDomain+'/ajax_order?do_type=3',
	            data: {sub_data:subData},
	            dataType: 'json',
	            success: function (data) {
	                if(data.code == 1){
	                   if(cartIn['doCart'] == 3){
						   cartIn.purity = _this.getPurityKey(cartIn.purity);
	                       var cKey =  'company_'+cartIn.supplier_company_id;
	                       var iKey = 'item_'+cartIn.product_id+'_'+cartIn.purity;
	                       if(cartIn['is_pack'] == 1){  //按包装购买
	                           iKey += '_'+cartIn['price_id'];
	                       } else {
	                           iKey += '_0';
	                       }
	                       if(_this.getBuyType() == 1){
	                          _this.buyCart.item[cKey]['itemList'][iKey]['cart_id'] = data.data.cart_id;
	                          if( _this.buyCart.user_id == ''){    //首次加入购物车
	                             _this.buyCart.user_id = data.data.user_id;
	                          }
	                       } else {
	                          _this.cart.item[cKey]['itemList'][iKey]['cart_id'] = data.data.cart_id;
	                          if( _this.cart.user_id == ''){     //首次加入购物车
	                             _this.cart.user_id = data.data.user_id;
	                          }
	                       }
	                   }
	                }
	                _this.resetBuyCart();
	                _this.resetCart();
	                if(typeof callBack == 'function'){
	                    callBack();
	                }
	            }
	        });
	    }
	    
	    //设置首页购物车数据
	    _this.setHomeCart = function(){
	        var cartHtml = '';
	        if(_this.cart.item_num > 0){
	            for(var perCompany in _this.cart.item){
	                for(var itemKey in _this.cart.item[perCompany]['itemList']){
	                    var curItem = _this.cart.item[perCompany]['itemList'][itemKey];
	                    cartHtml += '<dl id="header_item_'+curItem['id']+'_'+curItem['price_id']+'">'
	                        +'<dt><div class="img-wrap"><a href="http://'+mallDomain+'/goods-'+curItem['id']+'.html" class="img_link"><img src="'+curItem['img']+'" /></a></div>'
	                        +'<div class="title">'
	                        +'<p class="p0"><a href="http://'+mallDomain+'/goods-'+curItem['id']+'.html" title="'+curItem['name']+'">'+curItem['name'].subStr(26)+'</a></p>'
	                        +(curItem['cas_no'] != '' ? '<p class="p1">('+curItem['cas_no']+')</p>' : '')
	                        +'</p></div></dt>'
	                        +'<dd>'
	                        +'<p><b>￥'+curItem['price']+'</b><em>'+(curItem['is_pack'] == 1 ? '' : '' )+'/'+curItem['base_unit']+'</em>'
	                            +'<p>x'+curItem['quantity']+'</p>'
	                        +'<p><a href="javascript:;" class="del del_cart_item" item_in="'+perCompany+'_'+curItem['id']+'_'+curItem['price_id']+'_'+clearSpec(curItem['purity'])+'_'+curItem['is_pack']+'" type="1">删除</a></p>'
	                        +' </dd>'
	                        +'</dl>';
	                }
	            }
	        }
	        $('.cart_item_list').html(cartHtml);
	        //初始化header购物车数据
	        var cartItemNum = $('.cart_item_list dd').size();
	        $('.cart_in_number').html(cartItemNum);
	        $('.cart_all_money').html(toDecimal2(_this.cart.cart_all_goods_price));
	    };
	    
	    //播放加入购物车动画
	    _this.shopping = function(id, imgUrl, butForm){
	        var cartObj = $('.cart_button');     //详细页购物车
	        var addCartButObj = $('.'+butForm);
	        var butX = addCartButObj.offset().left + 20;
	        var butY = addCartButObj.offset().top;
	        var cartX = cartObj.offset().left + cartObj.width()/2 - addCartButObj.width()/2+10;
	        var cartY = cartObj.offset().top;

	        if ($('#floatOrder').length == 0) {
	            $('body').before('<div id="floatOrder" style="position: absolute; z-index:3000;">' +
	                '<img src="'+imgUrl+'" width="60" height="60" />' +
	                '</div>'
	            );
	        };

	        var $obj = $('#floatOrder');
	        if(!$obj.is(':animated')){

	            $obj.css({'left': butX,'top': butY}).animate({'left': cartX,'top': cartY-80},500,function() {
	                $obj.stop(false, false).animate({'top': cartY,'opacity':0},500,function(){
	                    $obj.fadeOut(300,function(){
	                        $obj.remove();
	                    });
	                });
	            });
	        };
	    }
	}
	
    return {
    	instance : new molbaseCart()
    }
});
