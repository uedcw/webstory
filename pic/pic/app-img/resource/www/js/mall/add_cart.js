$(document).on("click",".dialog_purity_sel",function(){addOnClass(this,"on");dialogItemDetail.defaultPurity=$(this).html();setPurity(1);if(dialogItemDetail.is_pack!=1){setDialogQuantity(0)}});$(function(){setDialogQuantity(0);$(document).on("keyup","#dialog_buy_num",function(){setDialogQuantity(0)});$(document).on("blur","#dialog_buy_num",function(){setDialogQuantity(1)});$(document).on("click",".do_dialog_num",function(){var i=$("#dialog_buy_num");var e=i.val();if(e.isInteger()){e=parseFloat(e);var t={id:dialogItemDetail.itemIn.id,purity:dialogItemDetail.itemIn.purity,supplier_company_id:dialogItemDetail.companyIn.supplier_company_id};var a=e+cart.getItemNum(t);if($(this).hasClass("add")){e=e+1}else if($(this).hasClass("reduce")){if(a>dialogItemDetail.minQuantity&&e>1){e=e-1}else{return false}}i.val(e);setDialogQuantity(0)}else{return false}});$(document).on("click","#add_cart_dialog_but",function(){setDialogQuantity(0);if(!$(this).hasClass("disable")){cart.shopping(dialogItemDetail.itemIn.id,dialogItemDetail.itemIn.img,"cart_item_"+dialogItemDetail.itemIn.id);if(!$(this).hasClass("disable")){dialog.closeBox();var i=new Array;i=cloneObj(dialogItemDetail.itemIn);cart.addItem({goods_price:i.goods_price,item:i,company:dialogItemDetail.companyIn},dialogItemDetail.priceIn[dialogItemDetail.defaultPurity])}}});$(document).on("click",".dialog_price_option",function(){var i=$("#dialog_buy_num");var e=$("#add_cart_dialog_but");e.removeClass("disable");addOnClass(this,"on");i.css("color","#000000");dialogItemDetail.itemIn.price_id=$(this).attr("price_id");dialogItemDetail.itemIn.price=$("#dialog_price_"+dialogItemDetail.itemIn.price_id).html();var t=0;if(dialogItemDetail.is_pack==1){t=i.val()}else{var a=$("#dialog_start_pack_num_"+dialogItemDetail.itemIn.price_id).html();t=parseFloat(a)>=parseFloat(dialogItemDetail.minQuantity)?a:dialogItemDetail.minQuantity;i.val(t)}$("#dialog_item_money").html(dialogItemDetail.itemIn.price);dialogItemDetail.itemIn.quantity=t;setDialogAllMoney()});dialogBuyQuantity=$("#dialog_buy_text").val();dialogPriceId=$(".dialog_price_option.on").attr("price_id");dialogPrice=$("#dialog_price_"+dialogPriceId).html()});function setDialogQuantity(i){var e=$("#dialog_buy_num");var t=e.val();var a=$("#add_cart_dialog_but");if(t.isInteger()&&t>0){t=parseFloat(t);a.removeClass("disable");var l={id:dialogItemDetail.itemIn.id,purity:dialogItemDetail.itemIn.purity,supplier_company_id:dialogItemDetail.companyIn.supplier_company_id};var o=t+cart.getItemNum(l);if(o<parseFloat(dialogItemDetail.minQuantity)){e.css("color","#F00000");a.addClass("disable");if(i==1){e.val(dialogItemDetail.minQuantity);e.css("color","#000000");a.removeClass("disable");dialog.error("购买数不能小于"+dialogItemDetail.minQuantity+dialogItemDetail.minUnit+"！",function(){$("#pay_but").removeClass("disable");a.focus()})}return false}else{a.removeClass("disable");$("#buy_num").css("color","#000000");if(dialogItemDetail.is_pack==1){if(dialogItemDetail.itemIn.defaultPurity!=""){setPurity();$("#dialog_item_money").html(dialogItemDetail.itemIn.price)}else{$(".dialog_purity_sel:eq(0)").click()}}else{var d=getNewPrice(dialogItemDetail.priceIn[dialogItemDetail.defaultPurity],t);addOnClass("dialog_price_form_"+d["id"],"on");$("#dialog_item_money").html(d[priceType]);dialogItemDetail.itemIn.direct_buy_price=d[priceType];dialogItemDetail.itemIn.direct_buy_price_id=d["id"];var n=getNewPrice(dialogItemDetail.priceIn[dialogItemDetail.defaultPurity],o);dialogItemDetail.itemIn.price=n[priceType];dialogItemDetail.itemIn.price_id=n["id"]}dialogItemDetail.itemIn.quantity=t;setDialogAllMoney()}}else{a.addClass("disable");e.css("color","#F00000");if(i==1){e.val(dialogItemDetail.minQuantity);e.css("color","#000000");a.removeClass("disable");dialog.error("购买数量必须为大于0的数字！",function(){$("#pay_but").removeClass("disable");a.focus()})}}}function setDialogAllMoney(){dialogItemDetail.itemIn.goods_price=parseFloat(dialogItemDetail.itemIn.quantity)*parseFloat(dialogItemDetail.itemIn.price)}function setPurity(i){var e=dialogItemDetail.defaultPurity.replace("%","");e=e.replace(".","");$(".dialog_price_option").css("display","none");$(".dialog_price_option_"+e).css("display","");if(dialogItemDetail.itemIn.price==0||i==1){var t=$(".dialog_price_option_"+e+":eq(0)");dialogItemDetail.itemIn.price_id=t.attr("price_id");addOnClass(t,"on");dialogItemDetail.itemIn.price=$("#dialog_price_"+dialogItemDetail.itemIn.price_id).html()}dialogItemDetail.itemIn.purity=dialogItemDetail.defaultPurity}