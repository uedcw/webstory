(function(e){function o(){try{return r in e&&e[r]}catch(t){return!1}}var t={},n=e.document,r="localStorage",i="script",s;t.disabled=!1,t.set=function(e,t){},t.get=function(e){},t.remove=function(e){},t.clear=function(){},t.transact=function(e,n,r){var i=t.get(e);r==null&&(r=n,n=null),typeof i=="undefined"&&(i=n||{}),r(i),t.set(e,i)},t.getAll=function(){},t.forEach=function(){},t.serialize=function(e){return JSON.stringify(e)},t.deserialize=function(e){if(typeof e!="string")return undefined;try{return JSON.parse(e)}catch(t){return e||undefined}};if(o())s=e[r],t.set=function(e,n){return n===undefined?t.remove(e):(s.setItem(e,t.serialize(n)),n)},t.get=function(e){return t.deserialize(s.getItem(e))},t.remove=function(e){s.removeItem(e)},t.clear=function(){s.clear()},t.getAll=function(){var e={};return t.forEach(function(t,n){e[t]=n}),e},t.forEach=function(e){for(var n=0;n<s.length;n++){var r=s.key(n);e(r,t.get(r))}};else if(n.documentElement.addBehavior){var u,a;try{a=new ActiveXObject("htmlfile"),a.open(),a.write("<"+i+">document.w=window</"+i+'><iframe src="/favicon.ico"></iframe>'),a.close(),u=a.w.frames[0].document,s=u.createElement("div")}catch(f){s=n.createElement("div"),u=n.body}function l(e){return function(){var n=Array.prototype.slice.call(arguments,0);n.unshift(s),u.appendChild(s),s.addBehavior("#default#userData"),s.load(r);var i=e.apply(t,n);return u.removeChild(s),i}}var c=new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]","g");function h(e){return e.replace(/^d/,"___$&").replace(c,"___")}t.set=l(function(e,n,i){return n=h(n),i===undefined?t.remove(n):(e.setAttribute(n,t.serialize(i)),e.save(r),i)}),t.get=l(function(e,n){return n=h(n),t.deserialize(e.getAttribute(n))}),t.remove=l(function(e,t){t=h(t),e.removeAttribute(t),e.save(r)}),t.clear=l(function(e){var t=e.XMLDocument.documentElement.attributes;e.load(r);for(var n=0,i;i=t[n];n++)e.removeAttribute(i.name);e.save(r)}),t.getAll=function(e){var n={};return t.forEach(function(e,t){n[e]=t}),n},t.forEach=l(function(e,n){var r=e.XMLDocument.documentElement.attributes;for(var i=0,s;s=r[i];++i)n(s.name,t.deserialize(e.getAttribute(s.name)))})}try{var p="__storejs__";t.set(p,p),t.get(p)!=p&&(t.disabled=!0),t.remove(p)}catch(f){t.disabled=!0}t.enabled=!t.disabled,typeof module!="undefined"&&module.exports&&this.module!==module?module.exports=t:typeof define=="function"&&define.amd?define("store",t):e.store=t})(Function("return this")()),define("malldialog",["jquery"],function(e){var t=function(t){var n=this;n.defaultOption={layer:".black_overlay",boxForm:".handle_box_form",dataForm:".handle_box",onlyOneForm:"#login_form",url:"",title:"",contentId:""},n.option=null,n.isCreateDialog=0,n.isCreateAlert=0,n.formNum=0,n.config=function(e){n.option=mergeArray(n.defaultOption,e)},typeof t!="undefined"?n.config(t):n.option=n.defaultOption,n.alertForm='<div class="handle_box alert_box" ><h1><span id="alert_title"></span><a href="javascript:;" class="close_box" alert_close="1"></a></h1><div class="alert_content">    <div class="alert_icon"></div>    <div class="alert_message">        <p id="alert_message"></p>   </div></div><div class="box_footer">   <button class="ok" id="alert_ok">确定</button></div></div>',n.createDialog=function(){var t="class",r="",i="class",s="";if(n.option.layer.indexOf("#")===0)t="id",r=n.option.layer.replace("#","");else{if(n.option.layer.indexOf(".")!==0)return!1;r=n.option.layer.replace(".","")}if(n.option.boxForm.indexOf("#")===0)i="id",s=n.option.boxForm.replace("#","");else{if(n.option.boxForm.indexOf(".")!==0)return!1;s=n.option.boxForm.replace(".","")}e("body").append("<div "+t+'="'+r+'"> </div>'),e("body").append("<div "+i+'="'+s+'"> </div>'),e(document).on("click",".close_box",function(){e(this).attr("alert_close")==1?n.closeAlert():n.closeBox()}),e(n.option.layer).on("dblclick",function(){n.closeBox()}),n.isCreateDialog=1},n.createAlert=function(){n.isCreateAlert||(n.isCreateDialog||n.createDialog(),e(this.option.boxForm).append(n.alertForm),n.isCreateAlert=1);var t=e(".alert_box");n.formNum==0&&(n.openLayer(),t.siblings().css("display","none")),t.css("display","block");var r=t.position().top;if(r>50){var i=parseInt(t.position().top)*-1;t.css("top",i)}n.formNum++},n.loadAjaxContent=function(t){var r=1;if(!n.isCreateDialog)return!1;var i=e(n.option.dataForm);i.length>0&&i.css("display","none"),n.option.contentId!=""&&n.option.onlyOneForm.indexOf(n.option.contentId)!==-1&&u.length>0&&(r=0,u.css("display","block"));var s="";r&&(s='<div class="handle_box" id="'+n.option.contentId+'">'+"<h1><span>"+n.option.title+'</span><a href="javascript:;" class="close_box"></a></h1><div id="dialog_load">'+'<div class="load_notice">加载中...</div></div></div>');var o=e(".alert_box");o.length>0?o.before(s):e(n.option.boxForm).append(s);var u=e("#"+n.option.contentId);u.css("display","block"),r&&e.ajax({type:"get",url:n.option.url,data:{},dataType:"html",success:function(r){e("#dialog_load").remove(),e("#"+n.option.contentId+" h1").after(r),typeof t=="function"&&t()}})},n.loadContent=function(t){var r=e("#"+n.option.contentId);if(!(r.length>0))return!1;var r=e("#"+n.option.contentId),i=e(".alert_box");i.length>0?i.before(r):e(n.option.boxForm).append(r),r.css("display","block"),r.siblings().css("display","none"),typeof t=="function"&&t()},n.closeAlert=function(){e(".alert_box").css("display","none"),n.formNum==1&&(e(n.option.layer).css("display","none"),e(n.option.boxForm).css("display","none")),n.formNum>0&&n.formNum--},n.closeBox=function(){n.option.url!=""&&n.option.onlyOneForm.indexOf(n.option.contentId)===-1&&e("#"+n.option.contentId).remove(),e(n.option.layer).fadeOut(function(){e(this).css("display","none")}),e(n.option.boxForm).css("display","none"),n.formNum>0&&n.formNum--},n.openLayer=function(){var t=e(n.option.boxForm),r=e(n.option.layer),i=r.css("position");if(i=="absolute"){var s=e(window).scrollTop();r.css("top",s),t.css("top",parseFloat(s)+50)}r.css("display","block"),t.css("display","block")},n.open=function(e,t){if(typeof e.contentId=="undefined"&&e.contentId=="")return!1;n.config(e),n.isCreateDialog||n.createDialog(),n.openLayer();if(n.option.url!="")n.loadAjaxContent(t);else{if(n.option.contentId=="")return!1;this.loadContent(t)}n.formNum++},n.resetEvent=function(t,r,i){e("#"+r).unbind(t),e("#"+r).bind(t,function(){n.closeAlert(),typeof i=="function"&&i()})},n.error=function(t,r){n.createAlert(),e("#alert_title").html("错误提示"),n.resetAlertIn(t,"error"),n.resetEvent("click","alert_ok",r)},n.success=function(t,r){n.createAlert(),e("#alert_title").html("确认"),n.resetAlertIn(t,"success"),n.resetEvent("click","alert_ok",r)},n.notice=function(t,r){n.createAlert(),e("#alert_title").html("信息提示"),n.resetAlertIn(t,"notice"),n.resetEvent("click","alert_ok",r)},n.resetAlertIn=function(t,n){e("#alert_message").html(t);var r=e(".alert_icon");r.removeClass(),r.addClass("alert_icon "+n)}};return new t}),define("malluser",["jquery","malldialog"],function(e,t){var n={getUserIn:function(t){e.ajax({type:"post",url:"http://"+mallDomain+"/ajax_user",data:{},dataType:"json",success:function(e){t(e)}})},checkLogin:function(n){e.ajax({type:"post",url:"http://"+mallDomain+"/ajax_user",data:{},dataType:"json",success:function(e){typeof e["user_id"]!="undefined"&&e["user_id"]!=0?e.buy_verify!=1?t.notice("手机认证用户开放此功能，立即认证!<br />客服热线：4007-281-666 或者<br />Email：service@molbase.com",function(){window.location.href="http://"+wwwDomain+"/zh/index.php?app=member&act=mobile_verify"}):typeof n=="function"&&n():t.notice("请先登录您的帐号!",function(){window.location.href="http://"+wwwDomain+"/zh/index.php?app=member&act=login"})},error:function(e,n){e.status==401&&t.notice("请先登录您的帐号!",function(){window.document.location.href="http://"+wwwDomain+"/zh/login.html"})}})}};return n}),define("cart",["jquery","store","malldialog","malluser"],function(e,t,n,r){var i=function(n){var i=this;i.defaultCart={user_id:0,session_id:"",is_active:1,item_num:0,item_active_num:0,goods_price:0,cart_all_goods_price:0,pay_money:0,discount:0,other_money:0,item:{}},i.cart={},i.buyCart={},i.cartRemark={},i.getCartItem=function(e){var n=t.get("molbaseCartItem");i.cartRemark=t.get("molbaseCartRemark"),typeof i.cartRemark=="undefined"&&(i.cartRemark={});if(typeof n=="undefined"||typeof n.user_id=="undefined")n=cloneObj(i.defaultCart),t.set("molbaseCartItem",n);i.cart=t.get("molbaseCartItem"),i.setHomeCart(),r.getUserIn(function(r){if(typeof r.user_id=="undefined"||r.user_id==0)n.user_id=0;n.user_id==0&&n.session_id==""?(typeof r.user_id!="undefined"&&r.user_id!=0?i.defaultCart.user_id=r.user_id:i.defaultCart.session_id=r.session_id,i.cart=cloneObj(i.defaultCart),t.set("molbaseCartItem",i.cart),i.resetCart(),typeof e=="function"&&e()):typeof r.user_id!="undefined"&&r.user_id!=0?r.user_id!=n.user_id?n.user_id==0?i.setCartItemToUser(function(){i.readUserCartItem(e)}):(i.clearCart(),i.cart.user_id=r.user_id,i.readUserCartItem(e)):i.readUserCartItem(e):i.readSessionCartItem(e)})},i.readUserCartItem=function(t){e.ajax({type:"post",url:"http://"+mallDomain+"/ajax_order?do_type=7",data:{user_id:i.cart.user_id},dataType:"json",success:function(e){e.code==1?i.cart=e.data:i.clearCart(),i.resetCart(),typeof t=="function"&&t()}})},i.readSessionCartItem=function(t){e.ajax({type:"post",url:"http://"+mallDomain+"/ajax_order?do_type=8",data:{session_id:i.cart.session_id},dataType:"json",success:function(e){e.code==1?i.cart=e.data:i.clearCart(),i.resetCart(),typeof t=="function"&&t()}})},i.setCartItemToUser=function(t){e.ajax({type:"post",url:"http://"+mallDomain+"/ajax_order?do_type=6",data:{session_id:i.cart.session_id},dataType:"json",success:function(e){e.code==1&&(i.cart.user_id=e.data.user_id,i.resetCart()),typeof t=="function"&&t()}})},i.getPurityKey=function(e){var t=new RegExp("[`\\\\''\\\"]"),n="";for(var r=0;r<e.length;r++)n+=e.substr(r,1).replace(t,"=");return n=n.replace(/\s+/g,"+"),n=n.replace(/_/g,"-"),n},i.getBuyCartItem=function(){var e=t.get("molbaseBuyCartItem");typeof e=="undefined"?(t.set("molbaseBuyCartItem",cloneObj(i.defaultCart)),i.buyCart=t.get("molbaseBuyCartItem")):i.buyCart=e},i.setBuyType=function(e){t.set("doType",e)},i.getBuyType=function(){return t.get("doType")},i.addItem=function(e,t,n){e.item.purity=i.getPurityKey(e.item.purity);var r="company_"+e.company.supplier_company_id,s="item_"+e.item.id+"_"+e.item.purity;e.item["is_pack"]==1?s+="_"+e.item.price_id:s+="_0";var o=0;o+=parseFloat(e.item.quantity);if(typeof i.cart.item[r]!="undefined")if(typeof i.cart.item[r]["itemList"][s]!="undefined"){o+=parseFloat(i.cart.item[r].itemList[s].quantity);var u=null;e.item["is_pack"]==1?u=t[e.item.price_id]:u=i.getNewPrice(t,o);if(u["id"]!=i.cart.item[r]["itemList"][s]["price_id"]){var a=i.cart.item[r].itemList[s];i.cart.item[r].itemList[s]=a;var f=parseFloat(a.goods_price);i.cart.item[r].itemList[s].goods_price=parseFloat(u[priceType])*o,i.cart.item[r].itemList[s].price_id=u.id,i.cart.item[r].itemList[s].price=u[priceType],i.cart.goods_price=parseFloat(i.cart.goods_price)-f+parseFloat(i.cart.item[r].itemList[s].goods_price),i.cart.cart_all_goods_price=parseFloat(i.cart.cart_all_goods_price)-f+parseFloat(i.cart.item[r].itemList[s].goods_price)}else{var l=parseFloat(e.item.quantity)*parseFloat(u[priceType]);i.cart.goods_price=parseFloat(i.cart.goods_price)+l,i.cart.cart_all_goods_price=parseFloat(i.cart.cart_all_goods_price)+l,i.cart.item[r].itemList[s].goods_price=parseFloat(i.cart.item[r].itemList[s].goods_price)+parseFloat(l)}i.cart.item[r].itemList[s].quantity=o,i.cartRecord({product_id:e.item.id,price_id:u.id,cartId:i.cart.item[r].itemList[s].cart_id,price:u[priceType],quantity:o,purity:u.purity,total_price:i.cart.item[r].itemList[s].goods_price,min_quantity:i.cart.item[r].itemList[s].min_quantity,price_type:priceType,doCart:1})}else o>=e.item.min_quantity&&i.addNewItem(e);else o>=e.item.min_quantity&&(i.cart.item[r]={company:{},itemList:{}},e.company.is_active=1,i.cart.item[r].company=e.company,i.addNewItem(e));typeof n=="function"&&n()},i.getNewPrice=function(t,n){var r=new Array,i=new Array,s=new Array;return e.each(t,function(e,t){if(n>=t.start_pack_num)if(t.end_pack_num>=n||t["end_pack_num"]==0)return r=t,!1;typeof i["end_pack_num"]!="undefined"?i=t.end_pack_num>i.end_pack_num?t:i:i=t,typeof s["start_pack_num"]!="undefined"?s=t.start_pack_num<s.start_pack_num?t:s:s=t}),r.length==0&&(n>=i.end_pack_num?r=i:n<=s.start_pack_num&&(r=s)),r},i.addBuyItem=function(e,t){i.clearBuyCart(),i.buyCart.item_num++,i.buyCart.item_active_num++,e.item.is_active=1,e.item.purity=i.getPurityKey(e.item.purity);var n="company_"+e.company.supplier_company_id,r="item_"+e.item.id+"_"+e.item.purity;e.item["is_pack"]==1?r+="_"+e.item.price_id:r+="_0",i.buyCart.item[n]={company:{},itemList:{}},e.item.show_purity=e.item.purity,i.buyCart.item[n].company=e.company,i.buyCart.item[n].itemList[r]=e.item,i.buyCart.goods_price=parseFloat(e.item.goods_price),i.buyCart.pay_money=e.goods_price,i.recordNewItem(e,t)},i.addNewItem=function(e){i.cart.item_num++,e.item.is_active=1,e.item.purity=i.getPurityKey(e.item.purity);var t="company_"+e.company.supplier_company_id,n="item_"+e.item.id+"_"+e.item.purity;e.item["is_pack"]==1?n+="_"+e.item.price_id:n+="_0",e.item.is_active=1,i.cart.item[t].itemList[n]=e.item,i.cart.goods_price=parseFloat(i.cart.goods_price)+parseFloat(e.item.goods_price),i.cart.cart_all_goods_price=parseFloat(i.cart.cart_all_goods_price)+parseFloat(e.item.goods_price),i.recordNewItem(e)},i.recordNewItem=function(e,t){i.cartRecord({product_id:e.item.id,goods_price:e.item.goods_price,quantity:e.item.quantity,unit:e.item.pack_unit,unit_price:e.item.price,purity:e.item.purity,supplier_company_id:e.company.supplier_company_id,min_quantity:e.item.min_quantity,price_id:e.item.price_id,lead_time:e.item.lead_time,is_pack:e.item.is_pack,session_id:i.cart.session_id,doCart:3},t)},i.setPayMoney=function(e){e==1?i.buyCart.pay_money=parseFloat(i.buyCart.goods_price)+parseFloat(i.buyCart.discount)+parseFloat(i.buyCart.other_money):i.cart.pay_money=parseFloat(i.cart.goods_price)+parseFloat(i.cart.discount)+parseFloat(i.cart.other_money)},i.editItem=function(e,t){e.item.purity=i.getPurityKey(e.item.purity);var n="company_"+e.company.supplier_company_id,r="item_"+e.item.id+"_"+e.item.purity;e.item["is_pack"]==1?r+="_"+e.item.price_id:r+="_0";var s=parseFloat(i.cart.goods_price);e.item.quantity>0&&e.item.quantity>=i.cart.item[n].itemList[r].min_quantity&&(i.cart.goods_price=s-parseFloat(i.cart.item[n].itemList[r].goods_price)+parseFloat(e.item.goods_price),i.cart_all_goods_price=parseFloat(i.cart.cart_all_goods_price)-parseFloat(i.cart.item[n].itemList[r].goods_price)+parseFloat(e.item.goods_price),i.cart.item[n].itemList[r].goods_price=e.item.goods_price,i.cart.item[n].itemList[r].quantity=e.item.quantity,i.cart.item[n].itemList[r].price=e.item.price,i.cart.item[n].itemList[r].price_id=e.item.price_id,i.setPayMoney(),i.cartRecord({product_id:e.item.id,cartId:i.cart.item[n].itemList[r].cart_id,purity:e.item.purity,price_id:e.item.price_id,quantity:e.item.quantity,total_price:e.item.goods_price,min_quantity:i.cart.item[n].itemList[r].min_quantity,doCart:1}),typeof t=="function"&&t())},i.getItemNum=function(e){e.purity=i.getPurityKey(e.purity);var t="company_"+e.supplier_company_id,n="item_"+e.id+"_"+e.purity;return e["is_pack"]==1?n+="_"+e.price_id:n+="_0",typeof i.cart.item[t]!="undefined"?typeof i.cart.item[t]["itemList"][n]!="undefined"?parseFloat(i.cart.item[t].itemList[n].quantity):0:0},i.doItemActive=function(e,t,n){e.purity=i.getPurityKey(e.purity);var r="company_"+e.companyId,s="item_"+e.id+"_"+e.purity;e["is_pack"]==1?s+="_"+e.price_id:s+="_0";if(typeof i.cart.item[r]["itemList"][s]!="undefined"){var o=i.cart.item[r].itemList[s];if(t==1&&o["is_active"]==0)i.cart.goods_price=parseFloat(i.cart.goods_price)+parseFloat(o.goods_price),i.cart.item_active_num++;else{if(t!=0||o["is_active"]!=1)return!1;i.cart.item_active_num--,i.cart.goods_price=parseFloat(i.cart.goods_price)-parseFloat(o.goods_price)}i.cart.item[r].itemList[s].is_active=t,i.cartRecord({cartId:i.cart.item[r].itemList[s].cart_id,doCart:2,is_active:t}),i.resetCart(),typeof n=="function"&&n()}},i.setCompanyActive=function(){for(var e in i.cart.item){var t=1;for(var n in i.cart.item[e].itemList)i.cart.item[e]["itemList"][n]["is_active"]!=1&&(t=0);i.cart.item[e].company.is_active=t}},i.doCompanyActive=function(e,t,n){var r="company_"+e.storeId;if(typeof i.cart.item[r]!="undefined"){for(var s in i.cart.item[r].itemList){var o=i.cart.item[r].itemList[s];t==1&&o["is_active"]==0?(i.cart.item_active_num++,i.cart.goods_price=parseFloat(i.cart.goods_price)+parseFloat(o.goods_price)):t==0&&o["is_active"]==1&&(i.cart.item_active_num--,i.cart.goods_price=parseFloat(i.cart.goods_price)-parseFloat(o.goods_price)),i.cart.item[r].itemList[s].is_active=t}i.cart.item[r].company.is_active=t,i.cartRecord({storeId:e.storeId,doCart:2,is_active:t}),i.resetCart(),typeof n=="function"&&n()}},i.doAllActive=function(e,t){if(i.cart.item_num>0){var n="";for(var r in i.cart.item){n+=","+i.cart.item[r].company.supplier_company_id,i.cart.item[r].company.is_active=e;for(var s in i.cart.item[r].itemList){var o=i.cart.item[r].itemList[s];e==1&&o["is_active"]==0?i.cart.goods_price=parseFloat(i.cart.goods_price)+parseFloat(o.goods_price):e==0&&o["is_active"]==1&&(i.cart.goods_price=parseFloat(i.cart.goods_price)-parseFloat(o.goods_price)),i.cart.item[r].itemList[s].is_active=e}}e?i.cart.item_active_num=i.cart.item_num:i.cart.item_active_num=0,i.cart.is_active=e,i.cartRecord({storeId:n,doCart:2,is_active:e}),i.resetCart(),typeof t=="function"&&t()}},i.addCartMark=function(e){var n="company_"+e.companyId;i.cartRemark[n]={remark:e.remark},t.set("molbaseCartRemark",i.cartRemark)},i.delItem=function(e,t){e.purity=i.getPurityKey(e.purity);var n="company_"+e.companyId,r="item_"+e.id+"_"+e.purity;e["is_pack"]==1?r+="_"+e.price_id:r+="_0",typeof i.cart.item[n]["itemList"][r]!="undefined"&&(i.cart.item[n]["itemList"][r]["is_active"]==1&&(i.cart.goods_price=parseFloat(i.cart.goods_price)-parseFloat(i.cart.item[n].itemList[r].goods_price)),i.cart.cart_all_goods_price=parseFloat(i.cart.cart_all_goods_price)-parseFloat(i.cart.item[n].itemList[r].goods_price),i.cartRecord({cartId:i.cart.item[n].itemList[r].cart_id,doCart:0}),delete i.cart.item[n].itemList[r],getObjLength(i.cart.item[n]["itemList"])==0&&delete i.cart.item[n],typeof i.cart.item=="undefined"&&(i.cart.item={}),i.cart.item_active_num--,i.cart.item_num--,i.resetCart(t))},i.clearSubCartItem=function(){i.setBuyType(0);if(i.cart.item_num>0){var e="";for(var t in i.cart.item)for(var n in i.cart.item[t].itemList){var r=i.cart.item[t].itemList[n];r["is_active"]==1&&i.delItem({id:r.id,companyId:i.cart.item[t].company.supplier_company_id,purity:r.purity})}i.resetCart()}},i.resetCart=function(e){i.setCompanyActive(),i.setPayMoney(),t.set("molbaseCartItem",i.cart),i.setHomeCart(),typeof e=="function"&&e()},i.resetBuyCart=function(){i.setPayMoney(1),t.set("molbaseBuyCartItem",i.buyCart)},i.clearCart=function(){i.cart.session_id!=""&&(i.defaultCart.session_id=i.cart.session_id),i.cart.user_id!=""&&(i.defaultCart.user_id=i.cart.user_id),i.cart=cloneObj(i.defaultCart),i.resetCart()},i.clearBuyCart=function(){i.buyCart=cloneObj(i.defaultCart),i.resetBuyCart()},i.cartRecord=function(t,n){var r={};if(typeof t["doCart"]==3)r=t;else{if(typeof t["doCart"]=="undefined")return-1;r=t}if(t.doCart==1&&t.doCart==3&&t.min_quantity>t.quantity)return-2;i.getBuyType()==1&&(r.direct_buy=1),e.ajax({type:"post",url:"http://"+mallDomain+"/ajax_order?do_type=3",data:{sub_data:r},dataType:"json",success:function(e){if(e.code==1&&t["doCart"]==3){t.purity=i.getPurityKey(t.purity);var r="company_"+t.supplier_company_id,s="item_"+t.product_id+"_"+t.purity;t["is_pack"]==1?s+="_"+t.price_id:s+="_0",i.getBuyType()==1?(i.buyCart.item[r].itemList[s].cart_id=e.data.cart_id,i.buyCart.user_id==""&&(i.buyCart.user_id=e.data.user_id)):(i.cart.item[r].itemList[s].cart_id=e.data.cart_id,i.cart.user_id==""&&(i.cart.user_id=e.data.user_id))}i.resetBuyCart(),i.resetCart(),typeof n=="function"&&n()}})},i.setHomeCart=function(){var t="";if(i.cart.item_num>0)for(var n in i.cart.item)for(var r in i.cart.item[n].itemList){var s=i.cart.item[n].itemList[r];t+='<dl id="header_item_'+s.id+"_"+s.price_id+'">'+'<dt><div class="img-wrap"><a href="http://'+mallDomain+"/goods-"+s.id+'.html" class="img_link"><img src="'+s.img+'" /></a></div>'+'<div class="title">'+'<p class="p0"><a href="http://'+mallDomain+"/goods-"+s.id+'.html" title="'+s.name+'">'+s.name.subStr(26)+"</a></p>"+(s["cas_no"]!=""?'<p class="p1">('+s.cas_no+")</p>":"")+"</p></div></dt>"+"<dd>"+"<p><b>￥"+s.price+"</b><em>"+(s["is_pack"]==1?"":"")+"/"+s.base_unit+"</em>"+"<p>x"+s.quantity+"</p>"+'<p><a href="javascript:;" class="del del_cart_item" item_in="'+n+"_"+s.id+"_"+s.price_id+"_"+clearSpec(s.purity)+"_"+s.is_pack+'" type="1">删除</a></p>'+" </dd>"+"</dl>"}e(".cart_item_list").html(t);var o=e(".cart_item_list dd").size();e(".cart_in_number").html(o),e(".cart_all_money").html(toDecimal2(i.cart.cart_all_goods_price))},i.shopping=function(t,n,r){var i=e(".cart_button"),s=e("."+r),o=s.offset().left+20,u=s.offset().top,a=i.offset().left+i.width()/2-s.width()/2+10,f=i.offset().top;e("#floatOrder").length==0&&e("body").before('<div id="floatOrder" style="position: absolute; z-index:3000;"><img src="'+n+'" width="60" height="60" />'+"</div>");var l=e("#floatOrder");l.is(":animated")||l.css({left:o,top:u}).animate({left:a,top:f-80},500,function(){l.stop(!1,!1).animate({top:f,opacity:0},500,function(){l.fadeOut(300,function(){l.remove()})})})}};return{instance:new i}}),define("style",[],function(){var e={addOnClass:function(e,t){var n=null;if(typeof e=="object")n=$(e);else var n=$("#"+e);n.siblings().removeClass(t),n.addClass(t)}};return e}),define("dialogaddcart",["module","jquery","malldialog","cart","style"],function(e,t,n,r,i){function o(e){var s=t("#dialog_buy_num"),o=s.val(),f=t("#add_cart_dialog_but");if(o.isInteger()&&o>0){o=parseFloat(o),f.removeClass("disable");var l={id:dialogItemDetail.itemIn.id,purity:dialogItemDetail.itemIn.purity,supplier_company_id:dialogItemDetail.companyIn.supplier_company_id},c=o+r.instance.getItemNum(l);if(c<parseFloat(dialogItemDetail.minQuantity))return s.css("color","#F00000"),f.addClass("disable"),e==1&&(s.val(dialogItemDetail.minQuantity),s.css("color","#000000"),f.removeClass("disable"),n.error("购买数不能小于"+dialogItemDetail.minQuantity+dialogItemDetail.minUnit+"！",function(){t("#pay_but").removeClass("disable"),f.focus()})),!1;f.removeClass("disable"),t("#buy_num").css("color","#000000");if(dialogItemDetail.is_pack==1)dialogItemDetail.defaultPurity!=""?(a(),t("#dialog_item_money").html(dialogItemDetail.itemIn.price)):t(".dialog_purity_sel:eq(0)").click();else{var h=r.instance.getNewPrice(dialogItemDetail.priceIn[dialogItemDetail.showLevel][dialogItemDetail.defaultPurity],o);i.addOnClass("dialog_price_form_"+h.id,"on"),t("#dialog_item_money").html(h[priceType]);if(dialogItemDetail.showLevel>0){var p=r.instance.getNewPrice(dialogItemDetail.priceIn[0][dialogItemDetail.defaultPurity],o);t("#old_dialog_item_money").html(p[priceType])}dialogItemDetail.itemIn.direct_buy_price=h[priceType],dialogItemDetail.itemIn.direct_buy_price_id=h.id;var d=r.instance.getNewPrice(dialogItemDetail.priceIn[dialogItemDetail.showLevel][dialogItemDetail.defaultPurity],c);dialogItemDetail.itemIn.price=d[priceType],dialogItemDetail.itemIn.price_id=d.id}dialogItemDetail.itemIn.quantity=o,u()}else f.addClass("disable"),s.css("color","#F00000"),e==1&&(s.val(dialogItemDetail.minQuantity),s.css("color","#000000"),f.removeClass("disable"),n.error("购买数量必须为大于0的数字！",function(){t("#pay_but").removeClass("disable"),f.focus()}))}function u(){dialogItemDetail.itemIn.goods_price=parseFloat(dialogItemDetail.itemIn.quantity)*parseFloat(dialogItemDetail.itemIn.price)}function a(e){t(".dialog_price_option").css("display","none"),t(".dialog_price_option_"+dialogItemDetail.defaultPurityNum).css("display","");if(dialogItemDetail.itemIn.price==0||e==1){var n=t(".dialog_price_option_"+dialogItemDetail.defaultPurityNum+":eq(0)");dialogItemDetail.itemIn.price_id=n.attr("price_id"),i.addOnClass(n,"on"),dialogItemDetail.itemIn.price=t("#dialog_price_"+dialogItemDetail.itemIn.price_id).val()}else if(dialogItemDetail.itemIn.price_id>0)i.addOnClass(t("#dialog_price_form_"+dialogItemDetail.itemIn.price_id),"on");else{var r=t(".dialog_price_option.on").attr("price_id");typeof r!="undefined"&&(dialogItemDetail.itemIn.price_id=r,dialogItemDetail.itemIn.price=t("#dialog_price_"+dialogItemDetail.itemIn.price_id).val())}dialogItemDetail.is_pack==1&&(t("#dialog_item_money").html(dialogItemDetail.itemIn.price),t("#old_dialog_item_money").html(t("#old_dialog_price_"+dialogItemDetail.itemIn.price_id).val())),dialogItemDetail.itemIn.purity=dialogItemDetail.defaultPurity}var s={isInit:0,init:function(){dialogItemDetail.defaultPurity!=""?o(0):t("#add_cart_dialog_but").addClass("disable"),r.instance.setBuyType(0),this.isInit||(this.isInit=1,t(document).on("keyup","#dialog_buy_num",function(){o(0)}),t(document).on("blur","#dialog_buy_num",function(){o(1)}),t(document).on("click",".dialog_purity_sel",function(){dialogItemDetail.defaultPurity=clearSpec(htmlDecode(t(this).html())),dialogItemDetail.defaultPurity!=""&&(t("#add_cart_dialog_but").removeClass("disable"),i.addOnClass(this,"on"),dialogItemDetail.defaultPurityNum=t(this).attr("purity_num"),a(1),t("#dialog_item_money").html(dialogItemDetail.itemIn.price),dialogItemDetail.is_pack!=1&&o(0))}),t(document).on("click",".do_dialog_num",function(){var e=t("#dialog_buy_num"),n=e.val();if(!n.isInteger())return!1;n=parseFloat(n);var i={id:dialogItemDetail.itemIn.id,purity:dialogItemDetail.itemIn.purity,supplier_company_id:dialogItemDetail.companyIn.supplier_company_id},s=n+r.instance.getItemNum(i);if(t(this).hasClass("add"))n+=1;else if(t(this).hasClass("reduce")){if(!(s>dialogItemDetail.minQuantity&&n>1))return!1;n-=1}e.val(n),o(0)}),t(document).on("click","#add_cart_dialog_but",function(){o(0);if(!t(this).hasClass("disable")){r.instance.shopping(dialogItemDetail.itemIn.id,dialogItemDetail.itemIn.img,"cart_item_"+dialogItemDetail.itemIn.id);if(!t(this).hasClass("disable")){n.closeBox();var e=new Array;e=cloneObj(dialogItemDetail.itemIn),r.instance.addItem({goods_price:e.goods_price,item:e,level:dialogItemDetail.showLevel,company:dialogItemDetail.companyIn},dialogItemDetail.priceIn[dialogItemDetail.showLevel][dialogItemDetail.defaultPurity])}}}),t(document).on("click",".dialog_price_option",function(){var e=t("#dialog_buy_num"),n=t("#add_cart_dialog_but");n.removeClass("disable"),i.addOnClass(this,"on"),e.css("color","#000000"),dialogItemDetail.itemIn.price_id=t(this).attr("price_id"),dialogItemDetail.itemIn.price=t("#dialog_price_"+dialogItemDetail.itemIn.price_id).val();var r=0;if(dialogItemDetail.is_pack==1)r=e.val();else{var s=t("#dialog_start_pack_num_"+dialogItemDetail.itemIn.price_id).html();r=parseFloat(s)>=parseFloat(dialogItemDetail.minQuantity)?s:dialogItemDetail.minQuantity,e.val(r)}t("#dialog_item_money").html(dialogItemDetail.itemIn.price);if(dialogItemDetail.showLevel>0){var o=t("#old_dialog_price_"+dialogItemDetail.itemIn.price_id).val();t("#old_dialog_item_money").html(o)}dialogItemDetail.itemIn.quantity=r,u()}))}};return s}),define("doCart",["jquery","store","malldialog","malluser","cart","dialogaddcart"],function(e,t,n,r,i,s){var o={doType:i.instance.getBuyType(),init:function(t){var r=this;i.instance.getCartItem(t),i.instance.getBuyCartItem();var o=0;e(".cart_button").hover(function(t){var n=e(".cart_item_list dd").size(),r=hiddenCart="";n>0?(r="header_cart",hiddenCart="empty_cart"):(r="empty_cart",hiddenCart="header_cart"),t.stopPropagation();if(i)return!1;var i=1,s=e("#"+r);s.slideDown(260,function(){i=0}),e(document).bind("mouseover",function(t){var n=s.offset(),r=parseFloat(s.css("width").replace("px","")),i=parseFloat(s.css("height").replace("px",""));if(n.left+r<t.pageX||n.top+60+i<t.pageY||n.left>t.pageX||n.top-60>t.pageY)s.slideUp(260,function(){}),e(document).unbind("mouseover")})}),e(document).on("click",".exc_add_cart",function(){var t=e(this).attr("product_id");n.open({url:"http://"+mallDomain+"/ajax_order?product_id="+t+"&do_type=1",contentId:"add_cart_form",title:"加入购物车"},function(){s.init()})}),e(document).on("click",".del_cart_item",function(){if(confirm("确定要删除此购物车商品吗？")){var t=e(this).attr("item_in"),n=e(this).attr("type"),i=t.split("_");e(".cart_title").length>0?r.delCartItem(t,n,function(){r.setAllBuyIn(),e("#item_"+t[2]+"_"+t[3]).remove()}):r.delCartItem(t,n)}}),e(".go_button").click(function(){i.instance.setBuyType(0),location.href="http://"+mallDomain+"/cart.html"})},getNewPrice:function(e,t){return i.instance.getNewPrice(e,t)},delCartItem:function(t,n,r){var s=t.split("_"),o=n==1?"header_":"";e("#"+o+"item_"+s[2]+"_"+s[3]).remove();if(o=="header_"){var u=e("#item_"+s[2]+"_"+s[3]);u.length>0&&u.remove()}var a=e("#company_"+s[1]);a.length>0&&e(".per_item_"+s[1]).length==0&&(a.remove(),e("#company_remark_"+s[1]).remove()),i.instance.delItem({companyId:s[1],id:s[2],price_id:s[3],purity:s[4],is_pack:s[5]},r)},setAllBuyIn:function(){var t=this.doType==1?i.instance.buyCart:i.instance.cart;e("#all_money").html(toDecimal2(t.goods_price)),e("#all_pay_money").html(toDecimal2(t.pay_money)),e("#cart_buy_num").html(t.item_active_num);var n=e(".select_all");if(n.length>0){var r=n.prop("checked");t.item_active_num==t.item_num?n.prop("checked",!0):r&&n.prop("checked",!1)}var s=e("#write_order_but");t.goods_price==0?s.length>0&&s.addClass("disable"):s.length>0&&s.removeClass("disable")}};return o}),define("fadeslide",["jquery"],function(e){var t=function(t){var n=this;n.defaultOption={speed:300,banner_box:".banner-box .bd",button_num_box:".banner-btn .hd",button_go_form:".banner-btn",onClass:"on",prev:"prev",next:"next",auto:1,autoSecond:3e3},n.option=null,n.config=function(e){n.option=mergeArray(n.defaultOption,e)},typeof t!="undefined"?n.config(t):n.option=n.defaultOption,n.sildeIn={allNum:0,onNum:1,autoEvent:null},n.init=function(){e(n.option.banner_box+" ul li").css("z-index","1"),e(n.option.banner_box+" ul li:eq(0)").css("z-index","2"),n.sildeIn.allNum=e(n.option.banner_box+" ul li").size();if(n.sildeIn.allNum>1){var t="<ul>";for(var r=1;r<=n.sildeIn.allNum;r++)t+="<li "+(r==1?'class="'+n.option.onClass+'"':"")+">"+r+"</li>";t+="</ul>",e(n.option.button_num_box).append(t),e(n.option.banner_box+" ul li").css("position","absolute"),e(n.option.button_num_box+" ul").css({position:"relative","z-index":10}),e(n.option.button_go_form).css({position:"relative","z-index":10}),e(n.option.button_num_box+" ul li").click(function(){var t=e(this).html();n.slide(t)}),e(n.option.button_num_box+" ul").hover(function(){n.clearAutoSlide()},function(){n.autoSlide()}),e(n.option.button_go_form+" a").click(function(){var t=e(this).attr("class");t.indexOf(n.option.prev)>-1?n.slidePrev():t.indexOf(n.option.next)>-1&&n.slideNext()}).hover(function(){n.clearAutoSlide()},function(){n.autoSlide()}),n.option.auto&&n.autoSlide()}},n.slideNext=function(){var e=parseInt(n.sildeIn.onNum),t=n.sildeIn.onNum<n.sildeIn.allNum?e+1:1;n.slide(t)},n.slidePrev=function(){var e=parseInt(n.sildeIn.onNum),t=n.sildeIn.onNum>1?e-1:n.sildeIn.allNum;n.slide(t)},n.slide=function(t){if(t!=this.sildeIn.onNum){var r=t-1,i=this.sildeIn.onNum-1,s=e(n.option.banner_box+" ul li:eq("+i+")"),o=e(n.option.banner_box+" ul li:eq("+r+")");o.css({opacity:"1"}),o.css({"z-index":2}),s.css({"z-index":3}),s.stop(!0,!1).fadeTo(n.option.speed,0,function(){n.sildeIn.onNum=t,s.css({"z-index":1})}),e(n.option.button_num_box+" ul li:eq("+i+")").removeClass(n.option.onClass),e(n.option.button_num_box+" ul li:eq("+r+")").addClass(n.option.onClass)}},n.autoSlide=function(){n.sildeIn.autoEvent=setInterval(function(){n.slideNext()},n.option.autoSecond)},n.clearAutoSlide=function(){clearInterval(n.sildeIn.autoEvent)}};return t}),define("mallpublic",["module","jquery","malldialog"],function(e,t,n){t(document).ready(function(){window.DB.READY=!0,t("#form1-top-search-buts-post").click(function(){var e=t("#top_search_keyword").val().trim();typeof e!="undefined"&&""!=e&&t("#mall_top_search").submit()}),t("#mall_top_search").submit(function(){var e=t("#top_search_keyword"),n=e.val();n!=""&&e.val(n.trim())});var e=t(".product_category");e.css("display")=="none"&&t(".category_menu_all").hover(function(n){n.stopPropagation();if(r)return!1;var r=1;e.slideDown(260,function(){r=0}),t(document).bind("mouseover",function(n){var r=e.offset(),i=parseFloat(e.css("width").replace("px","")),s=parseFloat(e.css("height").replace("px",""));if(r.left+i<n.pageX||r.top+60+s<n.pageY||r.left>n.pageX||r.top-60>n.pageY)e.slideUp(260,function(){e.css("display","none")}),t(document).unbind("mouseover")})}),t(window).scroll(function(){var e=parseInt(t(document).scrollTop());e>100?t(".go_top").css("display","block"):t(".go_top").css("display","none")}),t(".go_top").click(function(){t("html,body").animate({scrollTop:"0px"},300)}),t("#form1-top-search-buts-post").on("click",function(){var e=t("#top_search_keyword").val().trim();typeof e!="undefined"&&""!=e&&t("#mall_top_search").submit()}),t(".auto_size_img").each(function(){var e=parseFloat(t(this).css("width")),n=parseFloat(t(this).css("height")),r,i,s=1,o=new Image;o.src=t(this).attr("src");var u=o.width,a=o.height;i=e/u,r=n/a;if(e==0&&n==0)s=1;else if(e==0)r<1&&(s=r);else if(n==0)i<1&&(s=i);else if(i<1||r<1)s=i<=r?i:r;s<1&&(u*=s,a*=s),t(this).css("width",u),t(this).css("height",a)})})}),define("page/zx",["module","jquery","doCart","malldialog","fadeslide","mallpublic"],function(e,t,n,r,i){t(document).ready(function(){n.init();var e=new i;e.init(),t(".product-x ul li").mouseover(function(){t(this).find(".price .fl p i").addClass("hover"),t(this).find(".price .fr a").addClass("btn0-bg")}),t(".product-x ul li").mouseleave(function(){t(this).find(".price .fl p i").removeClass("hover"),t(this).find(".price .fr a").removeClass("btn0-bg")}),t(".zx_form_submit").click(function(){var e=t(this).attr("_tab"),n=t(this).attr("_order");t(this).siblings().attr("_tab",""),e==""||e==undefined?(e="desc",t(this).attr("_tab",e).addClass("cur").children("i").addClass("down"),t(this).siblings().removeClass("cur").attr("_tab","").children("i").removeClass("up").removeClass("down"),t("input[name=order]").val(n),t("input[name=sort]").val(e)):(e="desc"==e?"asc":"desc",t(this).attr("_tab",e).siblings().removeClass("cur"),t("input[name=order]").val(n),t("input[name=sort]").val(e),"asc"==e?t(this).children("i").removeClass("down").addClass("up"):t(this).children("i").removeClass("up").addClass("down")),t("#product_list_form").submit()})})});