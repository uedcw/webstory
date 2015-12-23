//molbase弹出框插件
String.prototype.trim = function(){
    return this.replace(/^\s+|\s+$/g,"");
}
String.prototype.isNumber = function(){
     var reg = new RegExp(/^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/);
     if(reg.test(this)){
         return true;
     } else {
        return false; 
     }
}
String.prototype.isInteger= function(){
     var reg = new RegExp(/^[\-\+]?\d+$/);
     if(reg.test(this)){
         return true;
     } else {
        return false; 
     }
}

//截取字符串
String.prototype.subStr = function(len){
 var strlen = 0; 
 var s = "";
 for(var i = 0;i < this.length;i++){
    if(this.charCodeAt(i) > 128){
        strlen += 2;
    } else { 
        strlen++;
    }
    s += this.charAt(i);
    if(strlen >= len){ 
      return s += '...' ;
    }
 }
 return s;
}

function cloneObj(obj) {
  var newObj = (obj instanceof Array) ? [] : {};
  for (i in obj) {
    if (i == 'clone') continue;
    if (obj[i] && typeof obj[i] == "object") {
      newObj[i] = obj[i].clone();
    } else newObj[i] = obj[i]
  } return newObj;
};

function getObjLength(obj) {
    var count = 0;
    for(var i in obj){
        count ++;
    }
    return count;
 };
var molbaseDialog = function(setOption) {
    var _this = this;
    _this.defaultOption = {
        layer: '.black_overlay',
        boxForm: '.handle_box_form',
        dataForm : '.handle_box',
        onlyOneForm:'#login_form',      //只加载一次的模板。如登录模板，ID名称，多个用逗号分开
        url: '',
        title:'',						//弹出框标题
        contentId: ''                   //模板内容ID,必有
    };

    _this.option = null;
    _this.isCreateDialog = 0;
    _this.isCreateAlert = 0;            //是否加载过弹出框
    _this.formNum = 0;                  //记录弹出层数量
    
    if (typeof setOption != 'undefined') {
        _this.config(setOption);
    } else {
        _this.option =  _this.defaultOption;
    }
    
    _this.config = function(setOption){
        _this.option = mergeArray(_this.defaultOption, setOption);
    }
    
    _this.alertForm = '<div class="handle_box alert_box" >'
        +'<h1><span id="alert_title"></span><a href="javascript:;" class="close_box" alert_close="1"></a></h1>'
        +'<div class="alert_content">'
        +'    <div class="alert_icon"></div>'
        +'    <div class="alert_message">'
        +'        <p id="alert_message"></p>'
        +'   </div>'
        +'</div>'
        +'<div class="box_footer">'
        +'   <button class="ok" id="alert_ok">确定</button>'
        +'</div></div>';
    
    _this.createDialog = function(){
        var layerType = 'class';
        var layerName = '';
        var boxType = 'class';
        var boxName = '';
        if( _this.option.layer.indexOf('#') === 0){   //是ID
            layerType = 'id';
            layerName = _this.option.layer.replace('#', '');
        } else if( _this.option.layer.indexOf('.') === 0){
            layerName =  _this.option.layer.replace('.', '');
        } else {
            return false;
        }
        if( _this.option.boxForm.indexOf('#') === 0){   //是ID
            boxType = 'id';
            boxName =  _this.option.boxForm.replace('#', '');
        } else if( _this.option.boxForm.indexOf('.') === 0){
            boxName =  _this.option.boxForm.replace('.', '');
        } else {
            return false;
        }
        $('body').append('<div '+layerType+'="'+layerName+'"> </div>');
        $('body').append('<div '+boxType+'="'+boxName+'"> </div>');
        //关闭弹出框
        $(document).on('click', '.close_box',function(){
            if($(this).attr('alert_close') == 1){   //关闭提示框
                _this.closeAlert();
            } else {
                _this.closeBox();
            }
        });
        $(_this.option.layer).on('dblclick', function(){
            _this.closeBox();
        });
        _this.isCreateDialog = 1;
    };
    
    //加载弹出框
    _this.createAlert = function(){
         if(!_this.isCreateAlert){
             if(!_this.isCreateDialog){
                 _this.createDialog(); 
             }
             $(this.option.boxForm).append(_this.alertForm);
             _this.isCreateAlert = 1;
         }
         var alertObj = $('.alert_box');
         if( _this.formNum == 0){
             _this.openLayer();
             alertObj.siblings().css('display', 'none');
         }
         alertObj.css('display', 'block');
         var positionTop = alertObj.position().top;
         if(positionTop > 50){
             var alertTop = parseInt(alertObj.position().top) * -1;
             
             alertObj.css('top', alertTop);
         }
         _this.formNum++;
    }
    
    _this.loadAjaxContent = function() {
        var isReload = 1;
        if(_this.isCreateDialog){
            var dataObj = $(_this.option.dataForm);
            if(dataObj.length > 0){
                dataObj.css('display', 'none');
            }
            if(_this.option.contentId != ''){   
                if(_this.option.onlyOneForm.indexOf(_this.option.contentId) !== -1 && contentObj.length > 0){
                    isReload = 0;
                    contentObj.css('display', 'block');
                }
            }
            var boxContent = '';
            if(isReload){
            	boxContent = '<div class="handle_box" id="'+_this.option.contentId+'">'
        	    	+'<h1><span>'+_this.option.title+'</span><a href="javascript:;" class="close_box"></a></h1><div id="dialog_load">'
        	    	+'<div class="load_notice">加载中...</div></div></div>';
            }
            var alertObj = $('.alert_box');
            if(alertObj.length > 0){
                alertObj.before(boxContent);
            } else {
                $(_this.option.boxForm).append(boxContent);
            }
            var contentObj = $('#'+_this.option.contentId);
            contentObj.css('display', 'block');
            
            if(isReload){
                $.ajax({
                    type: 'get',
                    url: _this.option.url,
                    data: {},
                    dataType: 'html',
                    success: function (content) {
                    	$('#dialog_load').remove();
                    	$('#'+_this.option.contentId+' h1').after(content);
                    }
                });
            }
           
        } else {
            return false;
        }
       
    };
    _this.loadContent = function () {
        var contentObj = $('#'+_this.option.contentId);
        if(contentObj.length > 0){
            var contentObj = $('#'+_this.option.contentId);
            var alertObj = $('.alert_box');
            if(alertObj.length > 0){
                alertObj.before(contentObj);
            } else {
                $(_this.option.boxForm).append(contentObj);
            }
            
            contentObj.css('display', 'block');
            contentObj.siblings().css('display', 'none');
        } else {
            return false;
        }
    };
    
    _this.closeAlert = function(){
        $('.alert_box').css('display', 'none');
        if(_this.formNum == 1){     //没有其他内容弹出框
             $(_this.option.layer).css('display', 'none');
             $(_this.option.boxForm).css('display', 'none');
        }
		if(_this.formNum > 0){
			_this.formNum--;
		}
    }
    _this.closeBox = function () {

        if(_this.option.url != '' && _this.option.onlyOneForm.indexOf(_this.option.contentId) === -1){ //加载多次的模板
            $('#'+_this.option.contentId).remove();    //删除
        }
        $(_this.option.layer).fadeOut(function(){
            $(this).css('display', 'none');
        })
        
        $(_this.option.boxForm).css('display', 'none');
        if(_this.formNum > 0){
			_this.formNum--;
		}
    };
    
    //打开弹出背景层
    _this.openLayer = function(){
        var boxObj = $(_this.option.boxForm);
        var layerObj = $(_this.option.layer);
        var position = layerObj.css('position');
        if (position == 'absolute') {
            var sTop = $(window).scrollTop();
            layerObj.css('top', sTop);
            boxObj.css('top', parseFloat(sTop) + 50);
        }
        layerObj.css('display', 'block');
        boxObj.css('display', 'block');
    }
    _this.open  =  function (setOption) {
    	if(typeof setOption.contentId == 'undefined' && setOption.contentId == ''){		
	    	return false;
	    }
        _this.config(setOption);
        if( ! _this.isCreateDialog){
            _this.createDialog();    //创建弹出框架
        }
        _this.openLayer();           //打开弹出层
        if(_this.option.url != ''){
            _this.loadAjaxContent();                //加载ajax内容
        } else if(_this.option.contentId != ''){    //加载本页内容
            this.loadContent();
        } else {
            return false;
        }

        _this.formNum++;
        
    };
    _this.resetEvent = function(eventName, butId, callBack){
        $('#'+butId).unbind(eventName); 
        $('#'+butId).bind(eventName, function(){
            _this.closeAlert();
            if(typeof callBack == 'function'){
                callBack();
            }
        });
    }
    _this.error = function(message, callBack){
        
        _this.createAlert();
        $('#alert_title').html('错误提示');
        _this.resetAlertIn(message, 'error');
        _this.resetEvent('click', 'alert_ok', callBack);
    }
     
    _this.success = function(message, callBack){
        _this.createAlert();
        $('#alert_title').html('确认');
        _this.resetAlertIn(message, 'success');
        _this.resetEvent('click', 'alert_ok', callBack);
    }
    
    _this.notice = function(message, callBack){
        _this.createAlert();
        $('#alert_title').html('信息提示');
        _this.resetAlertIn(message, 'notice');
        _this.resetEvent('click', 'alert_ok', callBack);
    }
    
    _this.resetAlertIn = function(message, type){
        $('#alert_message').html(message);
        var iconObj = $('.alert_icon');
        iconObj.removeClass();
        iconObj.addClass('alert_icon '+type);
    }
};
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
    }
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
            store.set('molbaseCartItem', _this.defaultCart);
            localCart = _this.defaultCart;
        }
        _this.cart = store.get('molbaseCartItem');
        //设置头部购物车数据
        cart.setHomeCart();
        //_this.clearCart();
        getUserIn(function(userData){
        	if(typeof userData.user_id == 'undefined' || userData.user_id == 0){    //未登录
        		localCart.user_id = 0;
        	}
            if(localCart.user_id == 0 && localCart.session_id == ''){ //初始化购物车
                if(typeof userData.user_id != 'undefined' && userData.user_id != 0){    //已登录
                    _this.defaultCart.user_id = userData.user_id;
                } else {
                    _this.defaultCart.session_id = userData.session_id;
                }
                store.set('molbaseCartItem', _this.defaultCart);
                _this.cart = store.get('molbaseCartItem');
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
                   _this.clearCart();
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
    //从本地获取直接购买的商品
    _this.getBuyCartItem = function(){
        
        var localBuyCart = store.get('molbaseBuyCartItem');
        if(typeof localBuyCart == 'undefined'){ //初始化购物车
            store.set('molbaseBuyCartItem', _this.defaultCart);
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
                    curPriceIn = getNewPrice(itemPriceIn, setQuantity);
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
    }
    
    //直接购买
    _this.addBuyItem = function(addItemIn, callBack){
        _this.clearBuyCart();
        _this.buyCart.item_num++;
        _this.buyCart.item_active_num++;
        addItemIn.item.is_active = 1;
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
        for(var perCompany in cart.cart.item){
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
            for(var perCompany in cart.cart.item){
                storeId += ','+cart.cart.item[perCompany]['company']['supplier_company_id'];
                _this.cart.item[perCompany]['company']['is_active'] = active;
                for(var itemKey in cart.cart.item[perCompany]['itemList']){
                    var curItem = cart.cart.item[perCompany]['itemList'][itemKey];
                    
                    if(active == 1 && curItem['is_active'] == 0){
                        _this.cart.goods_price = parseFloat(_this.cart.goods_price) + parseFloat(curItem['goods_price']);
                    } else if(active == 0 && curItem['is_active'] == 1){
                        _this.cart.goods_price = parseFloat(_this.cart.goods_price) - parseFloat(curItem['goods_price']);
                    }
                    
                    _this.cart.item[perCompany]['itemList'][itemKey]['is_active'] = active;
                }
            }
            if(active){
                _this.cart.item_active_num = cart.cart.item_num;
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
        var cKey = 'company_'+delIn.companyId;
        var iKey = 'item_'+delIn.id+'_'+delIn.purity;
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
            for(var perCompany in cart.cart.item){
                for(var itemKey in cart.cart.item[perCompany]['itemList']){
                    var curItem = cart.cart.item[perCompany]['itemList'][itemKey];
                    
                    if( curItem['is_active'] == 1){ 
                        _this.delItem({
                            id : curItem['id'],
                            companyId : cart.cart.item[perCompany]['company']['supplier_company_id'],
                            purity: curItem['purity']
                        });
                    }
                }
            }
            _this.resetCart();
        }
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
                        +'<p><a href="javascript:;" class="del del_cart_item" item_in="'+perCompany+'_'+curItem['id']+'_'+curItem['price_id']+'_'+curItem['purity']+'_'+curItem['is_pack']+'" type="1">删除</a></p>'
                        +' </dd>'
                        +'</dl>';
                }
            }
        }
        $('.cart_item_list').html(cartHtml);
        //初始化header购物车数据
        setHeaderCartItem();
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
        _this.cart =  _this.defaultCart;
        _this.resetCart();
    }
    
    _this.clearBuyCart = function(){
        _this.buyCart =  _this.defaultCart;
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

function delCartItem(delItemIn, type, callBack){
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
    cart.delItem({
        companyId : inArr[1],
        id : inArr[2],
        price_id : inArr[3],
        purity : inArr[4],
        is_pack : inArr[5]
    }, callBack);
}
//molbase 弹出框
var dialog = new molbaseDialog();
var cart = new molbaseCart();
$(function(){
    
    if($('.cart_title').length > 0){        //购物车页面step1
        cart.getCartItem(setOrderList);     //初始化数据
    } else if($('.show_cart_item_title').length > 0){       //购物车页面step2
        cart.getBuyCartItem();
        cart.getCartItem(showOrderList);                    //初始化数据列表
    } else if($('.product_detail').length > 0){             //产品详细页
        cart.getCartItem(function(){
            setQuantity(0);
            setAllMoney();
        });
    } else {
        cart.getCartItem();
        cart.getBuyCartItem();              
    }
    
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
        
    
    $(document).on("click",'.exc_add_cart',function(){
        var id = $(this).attr('product_id');
        dialog.open({
            url: 'http://'+mallDomain+'/ajax_order?product_id='+id+'&do_type=1',
            contentId: 'add_cart_form',
            title : '加入购物车'
        });
    });
    
    $(document).on("click",".del_cart_item",function(){  
        if(confirm('确定要删除此购物车商品吗？')){
            var curItemIn = $(this).attr('item_in');
            var type = $(this).attr('type');
            delCartItem(curItemIn, type);
        }
    });
    
    $('.go_button').click(function(){
        location.href = 'http://'+mallDomain+'/cart.html';
    });
    //搜索框提交
    $('#mall_top_search').submit(function(){
        var wordObj = $('#top_search_keyword');
        var searchWord = wordObj.val();
        if(searchWord != ''){
            wordObj.val(searchWord.trim());
        }
    });
    
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
            var _this = this;
            
            var headerCartSet = headerCartObj.offset();
            var headerCartWidth = parseFloat(headerCartObj.css('width').replace('px', ''));
            var headerCartHeight = parseFloat(headerCartObj.css('height').replace('px', ''));

            if(
                (headerCartSet.left + headerCartWidth) < e.pageX || (headerCartSet.top + 60 + headerCartHeight) < e.pageY
                  || headerCartSet.left > e.pageX || headerCartSet.top-60 > e.pageY
                ){
                  headerCartObj.slideUp(260, function () {
                });
                $(document).unbind('mouseover');
            }

        });
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
                var _this = this;
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
    
    
    var userObj = $('#display_info');
  //首页用户名下拉显示
    /*$('.down_user').hover(function(){
        userObj.css('display', 'block');
        $(document).bind('mouseover', function(e) {
             var userInSet = userObj.offset();
             var userObjWidth = parseFloat(userObj.css('width').replace('px', ''));
             var userObjHeight = parseFloat(userObj.css('height').replace('px', ''));
             if(
               (userInSet.left + userObjWidth) < e.pageX || (userInSet.top + 40 + userObjHeight) < e.pageY
                    || userInSet.left > e.pageX || userInSet.top-40 > e.pageY
               ){
                 userObj.slideUp(260, function () {
                     userObj.css('display', 'none');
                 });
                 $(document).unbind('mouseover');
             }
         });
    });*/
    
    $(window).scroll(function(){
        var scrollTop = parseInt($(document).scrollTop());
        if(scrollTop > 100){
            $('.go_top').css('display', 'block');
        } else {
            $('.go_top').css('display', 'none');
        }
    }); 
    
    $('.go_top').click(function(){
        $('html,body').animate({scrollTop:'0px'}, 300);
    });
    
    $('#do_login').on('click', function(){
        dialog.open({
            url: 'template/login.html',
            contentId: 'login_form'
        });
    });
    
    //没有输入，搜索框不可点击
    $("#form1-top-search-buts-post").on('click', function(){
        var dds = $("#top_search_keyword").val();
    });
});

//根据数量获取价格区间ID
function getNewPrice(priceIn, quantity){
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
}
function setHeaderCartItem(){
  
  var cartItemNum = $('.cart_item_list dd').size();
  $('.cart_in_number').html(cartItemNum);
  $('.cart_all_money').html(toDecimal2(cart.cart.cart_all_goods_price));
  
}

function checkLogin(callBack){
    $.ajax({
        type: 'post',
        url: 'http://'+mallDomain+'/ajax_user',
        data: {},
        dataType: 'json',
        success: function (data) {
            if(typeof data['user_id'] != 'undefined' && data['user_id'] != 0){
              if(data.buy_verify != 1){
                 dialog.notice("手机认证用户开放此功能，立即认证!<br />客服热线：4007-281-666 或者<br />Email：service@molbase.com", function(){
                    window.location.href ='http://'+wwwDomain+'/zh/index.php?app=member&act=mobile_verify';
                 });
              } else {
                  if(typeof callBack == 'function'){
                      callBack();
                  }
              }
            } else {
                dialog.notice("请先登录您的帐号!", function(){
                    window.location.href ='http://'+wwwDomain+'/zh/index.php?app=member&act=login';
                });
            }
        },
        error:function(XMLHttpRequest, ts){
            if(XMLHttpRequest.status == 401){
                dialog.notice("请先登录您的帐号!", function(){
                    window.document.location.href = 'http://'+wwwDomain+'/zh/login.html';
                });
            }
        }
    });
}

//获取用户服务器端信息 登陆 未登录
function getUserIn(callBack){
    $.ajax({
        type: 'post',
        url: 'http://'+mallDomain+'/ajax_user',
        data: {},
        dataType: 'json',
        success: function (data) {
            callBack(data);
        }
    });
}
//合并对象元素，前者已有的元素覆盖前者
function mergeArray(defaultArr, newArr){
    for(var perOption in defaultArr){
        if(typeof newArr[perOption] == 'undefined'){
            newArr[perOption] = defaultArr[perOption];
        }
    }
    return newArr;
}

//去除同级元素样式，并添加样式到自（ 支持对象传入，id传入）
function addOnClass(id, className){
    var obj = null;
    if(typeof id == 'object'){
        obj = $(id);
    } else {    
        var obj  = $('#'+id);
    }
    obj.siblings().removeClass(className);
    obj.addClass(className);
}


//店铺页面将cas或者名称搜索栏的值复制到到from表单中
function copy_value_to_hide_input(){
    var value = $('#search_text_id').val();
    //去除空格操作
    value = value.trim();
    $('#search_text_id').val(value);
    $('#rank_form input[name="serach"]').val(value);
}

function toDecimal2(s) {  
    var f = parseFloat(s);  
    if (isNaN(f)) {  
        return false;  
    }  
    var f = Math.round(s*100)/100;  
    var s = f.toString();  
    var rs = s.indexOf('.');  
    if (rs < 0) {  
        rs = s.length;  
        s += '.';  
    }  
    while (s.length <= rs + 2) {  
        s += '0';  
    }  
    return s;  
} 
function bulidJs(jsId, jsSrc, callBack){
    var src =$('#'+jsId).attr('src');
    if(typeof src == 'undefined') {
        var js = document.createElement('script');
        js.setAttribute("id", jsId);
        js.src = jsSrc;
        
        var last=document.body.lastChild
  
        document.body.insertBefore(js, last);

    } else {
        if(typeof callBack == 'function'){
            callBack();
        }
    }

}
//检查输入是否为数字
 function check_price(obj)
 {
  var number = obj.value;
  if((/^[0-9]+$/).test(number)){
    return
  }
  else
   obj.value = '';
 }

 //判断输入区间是否符合逻辑
 function compare(obj){
    var _this = $(obj);
    var end_value = parseInt(_this.parent().find('input[name="price_e"]').val());
    var begin_value = parseInt(_this.parent().find('input[name="price_s"]').val());
    if(begin_value>end_value){
       dialog.error("您输入的价格区间不符合逻辑，请重新输入");
       _this.parent().find('input[name="price_e"]').val("");
       _this.parent().find('input[name="price_s"]').val("");
       return;
     }
    /*if(_this.parent().find('input[name="price_s"]').val()==""||
        _this.parent().find('input[name="price_e"]').val()==""||
        typeof(_this.parent().find('input[name="price_s"]').val())=="undefined"
            ||typeof(_this.parent().find('input[name="price_e"]').val())=="undefined"
                ){
        alert("您有输入为空的操作，请确保价格区间都有值!")
        _this.val("");
        _this.parent().find('input[name="price_s"]').val("");
        return;
   }*/
 }
 
$(document).ready(function(){
	//yi:数据为空不能搜索
	$("#form1-top-search-buts-post").click(function(){
		var keyword = $('#top_search_keyword').val().trim();
		if(!(typeof keyword=='undefined' || ''==keyword))
		{
			$("#mall_top_search").submit();
		}
	});
});
 
