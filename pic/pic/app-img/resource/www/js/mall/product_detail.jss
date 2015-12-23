$(function(){
    //切换内容标签
    $('.detail').click(function(){
       var _this = $(this);

       if(!_this.hasClass("on")){
           var contentId = _this.attr('content_id');
           _this.parent().parent().find('li .detail').removeClass('on');

           _this.addClass('on');
           var cObj = $('#'+contentId);
           $('.all_content').children().css('display', 'none');

           $('.'+contentId).css('display', 'block');
       }
    });
    //操作数量
    $('.do_num').on('click', function(){
        var buyQuantity = $('#buy_num').val();
        if(buyQuantity.isInteger()){
            buyQuantity = parseFloat(buyQuantity);
            
            var curItemIn = {
                id : itemDetail.itemIn.id,
                purity : itemDetail.itemIn.purity,
                supplier_company_id : itemDetail.companyIn.supplier_company_id
            };
            var allQuantity = buyQuantity + cart.getItemNum(curItemIn);
            
            if($(this).hasClass('add')){
                buyQuantity = buyQuantity + 1;
            } else if($(this).hasClass('reduce')){
                if(allQuantity > itemDetail.minQuantity && buyQuantity > 1){
                    buyQuantity = buyQuantity - 1;
                    
                    if(buyQuantity < itemDetail.minQuantity){
                        $('#pay_but').addClass('disable');
                    } else {
                        $('#pay_but').removeClass('disable');
                    }
                } else {
                    return false;
                }
            }
            $('#buy_num').val(buyQuantity);
            setQuantity(0);
        } else {
            return false;
        }
    });
    
    //选择规格
    $(document).on("click",".purity_sel",function(){
        addOnClass(this, 'on');
        itemDetail.defaultPurity = $(this).html();
        setPurity(1);
        if(itemDetail.is_pack != 1){
            setQuantity(0);
        }
        $('#detail_product_money').html(itemDetail.itemIn.price);
    });
    

    //判定输入的购买数量是否合法
    $('#buy_num').on('keyup', function(){
        setQuantity(0);
    });
    
    $('#buy_num').on('blur', function(){
        setQuantity(1);
    });
    
    $('#add_cart_but').click(function(){
        cart.setBuyType(0);
        setQuantity(0);
        if(!$(this).hasClass('disable')){
            cart.shopping(itemDetail.itemIn.id, itemDetail.itemIn.img, 'add_cart_detail_but');
            if(!$(this).hasClass('disable')){
                var curAddItem = new Array();
                curAddItem = cloneObj(itemDetail.itemIn);
                cart.addItem({
                    goods_price : curAddItem.goods_price,
                    item : curAddItem,
                    company : itemDetail.companyIn
                }, itemDetail.priceIn[itemDetail.defaultPurity]);
            }
        }
    });
    
    //直接购买
    $('#pay_but').click(function(){
        if(!$(this).hasClass('disable')){
            setQuantity(0);
            cart.setBuyType(1);     //标志直接购买
            var curAddItem = new Array();
            curAddItem = cloneObj(itemDetail.itemIn);
            
            if(itemDetail.is_pack != 1){
                curAddItem.price = curAddItem.direct_buy_price;
                curAddItem.price_id = curAddItem.direct_buy_price_id;
                curAddItem.goods_price = curAddItem.direct_buy_goods_price
            }
            checkLogin(function(){
                cart.addBuyItem({
                    goods_price : curAddItem.goods_price,
                    item : curAddItem,
                    company : itemDetail.companyIn
                }, function(){
                    location.href = 'http://'+mallDomain+'/order-step-2.html';
                });
            });
        }
    });
    
    $('.price_option').not('.not').click(function(){
        var buyObj = $('#buy_num');
        $('.buy_but').removeClass('disable');
        addOnClass(this, 'on');
        buyObj.css('color', '#000000');
        itemDetail.itemIn.price_id = $(this).attr('price_id');
        itemDetail.itemIn.price = $('#price_'+itemDetail.itemIn.price_id).html();
        var quantity = 0;
        if(itemDetail.is_pack == 1){
            quantity = buyObj.val();
        } else {
            var startQuantity = $('#start_pack_num_'+itemDetail.itemIn.price_id).html();
            quantity = parseFloat(startQuantity) >= itemDetail.minQuantity ? startQuantity : itemDetail.minQuantity;
            buyObj.val(quantity);
        }
        $('#detail_product_money').html(itemDetail.itemIn.price);
        itemDetail.itemIn.quantity = quantity;
        setAllMoney();
    });
    
    itemDetail.itemIn.quantity = $('#buy_num').val();
    itemDetail.itemIn.price_id  = $('.price_option.on').attr('price_id');
    itemDetail.itemIn.price    = $('#price_'+itemDetail.itemIn.price_id).html();
    
});

function setPurity(changePrice){
    var curOptionNum = itemDetail.defaultPurity.replace('%', '');
    curOptionNum = curOptionNum.replace('.', '');
    
    $('.price_option').css('display', 'none');
    $('.price_option_'+curOptionNum).css('display', '');
    if(itemDetail.itemIn.price == 0 || changePrice == 1){
        var priceObj = $('.price_option_'+curOptionNum+':eq(0)');
        itemDetail.itemIn.price_id = priceObj.attr('price_id');
        addOnClass(priceObj, 'on');
        itemDetail.itemIn.price = $('#price_'+itemDetail.itemIn.price_id).html();
    }
    itemDetail.itemIn.purity = itemDetail.defaultPurity;
}

//检查购买量是否合法，并执行设置价格操作
function setQuantity(open){
    var buyNumObj = $('#buy_num');
    var buyQuantity = buyNumObj.val();
    var addCartObj = $('.add_cart_detail_but');
    
    if(buyQuantity.isInteger() && buyQuantity > 0){
        buyQuantity = parseFloat(buyQuantity);
        $('.add_cart_detail_but').removeClass('disable');
        if(buyQuantity < itemDetail.minQuantity){
            $('#pay_but').addClass('disable');
        } else {
            $('#pay_but').removeClass('disable');
        }
        var allQuantity = 0;
        var curItemIn = {
            id : itemDetail.itemIn.id,
            purity : itemDetail.itemIn.purity,
            supplier_company_id : itemDetail.companyIn.supplier_company_id
        };
        
        allQuantity = buyQuantity + cart.getItemNum(curItemIn);
        
        if(allQuantity < itemDetail.minQuantity){
            buyNumObj.css('color', '#F00000');
            addCartObj.addClass('disable');
            if(open == 1){
                buyNumObj.val(itemDetail.minQuantity);
                buyNumObj.css('color', '#000000');
                addCartObj.removeClass('disable');
                dialog.error('购买数不能小于'+itemDetail.minQuantity+itemDetail.minUnit+'！',function(){
                    $('#pay_but').removeClass('disable');
                    addCartObj.focus();
                });
            }
            return false;
        } else {
            addCartObj.removeClass('disable');
            $('#buy_num').css('color', '#000000');
            if(itemDetail.is_pack == 1){
                if(itemDetail.itemIn.defaultPurity != ''){
                    setPurity();
                    $('#detail_product_money').html(itemDetail.itemIn.price);
                } else {
                    $('.purity_sel:eq(0)').click();
                }
            } else {
                var curAddPriceIn = getNewPrice(itemDetail.priceIn[itemDetail.defaultPurity],  buyQuantity);
                addOnClass('price_form_'+curAddPriceIn['id'], 'on');
                $('#detail_product_money').html(curAddPriceIn[priceType]);
                
                itemDetail.itemIn.direct_buy_price = curAddPriceIn[priceType];
                itemDetail.itemIn.direct_buy_price_id = curAddPriceIn['id'];
                
                var curPriceIn = getNewPrice(itemDetail.priceIn[itemDetail.defaultPurity], allQuantity);
                itemDetail.itemIn.price = curPriceIn[priceType];
                itemDetail.itemIn.price_id = curPriceIn['id'];
            }
            itemDetail.itemIn.quantity = buyQuantity;
            setAllMoney();
        }
        
    } else {
        addCartObj.addClass('disable');
        buyNumObj.css('color', '#F00000');
        if(open == 1){
            buyNumObj.val(itemDetail.minQuantity);
            buyNumObj.css('color', '#000000');
            addCartObj.removeClass('disable');
            dialog.error('购买数量必须为大于0的数字！', function(){
                $('#pay_but').removeClass('disable');
                addCartObj.focus();
            });
        }
    }
}


function setAllMoney(){
    itemDetail.itemIn.direct_buy_goods_price = parseFloat(itemDetail.itemIn.quantity) * parseFloat(itemDetail.itemIn.direct_buy_price);
    itemDetail.itemIn.goods_price = parseFloat(itemDetail.itemIn.quantity) * parseFloat(itemDetail.itemIn.price);
    //$('#detail_all_money').html(itemDetail.itemIn.goods_price);
}

