define("ajaxtpl",["jquery"],function(e){var t=window.DB.leng;return function(n,r,i){r=r||e.noop(),i=i||"index";var s=document.getElementById(n);s?r(s,n,i):e.get("/"+t+"/index.php?app=ajaxhtml&tp=new",{boxid:n,act:i},function(t){t!==""?(e(document.body).append(t),r(document.getElementById(n),n,i)):alert("no tpl: "+n)})}}),define("popup",["jquery"],function(e){function i(){this.destroyed=!1,this.__popup=e("<div />").css({display:"none",position:"absolute",outline:0}).attr("tabindex","-1").html(this.innerHTML).appendTo("body"),this.__backdrop=this.__mask=e("<div />").css({opacity:.7,background:"#000"}),this.node=this.__popup[0],this.backdrop=this.__backdrop[0],t++}var t=0,n=!("minWidth"in e("html")[0].style),r=!n;return e.extend(i.prototype,{node:null,backdrop:null,fixed:!1,destroyed:!0,open:!1,returnValue:"",autofocus:!0,align:"bottom left",innerHTML:"",className:"ui-popup",show:function(t){if(this.destroyed)return this;var s=this,o=this.__popup,u=this.__backdrop;this.__activeElement=this.__getActive(),this.open=!0,this.follow=t||this.follow;if(!this.__ready){o.addClass(this.className).attr("role",this.modal?"alertdialog":"dialog").css("position",this.fixed?"fixed":"absolute"),n||e(window).on("resize",e.proxy(this.reset,this));if(this.modal){var a={position:"fixed",left:0,top:0,width:"100%",height:"100%",overflow:"hidden",userSelect:"none",zIndex:this.zIndex||i.zIndex};o.addClass(this.className+"-modal"),r||e.extend(a,{position:"absolute",width:e(window).width()+"px",height:e(document).height()+"px"}),u.css(a).attr({tabindex:"0"}).on("focus",e.proxy(this.focus,this)),this.__mask=u.clone(!0).attr("style","").insertAfter(o),u.addClass(this.className+"-backdrop").insertBefore(o),this.__ready=!0}o.html()||o.html(this.innerHTML)}return o.addClass(this.className+"-show").show(),u.show(),this.reset().focus(),this.__dispatchEvent("show"),this},showModal:function(){return this.modal=!0,this.show.apply(this,arguments)},close:function(e){return!this.destroyed&&this.open&&(e!==undefined&&(this.returnValue=e),this.__popup.hide().removeClass(this.className+"-show"),this.__backdrop.hide(),this.open=!1,this.blur(),this.__dispatchEvent("close")),this},remove:function(){if(this.destroyed)return this;this.__dispatchEvent("beforeremove"),i.current===this&&(i.current=null),this.__popup.remove(),this.__backdrop.remove(),this.__mask.remove(),n||e(window).off("resize",this.reset),this.__dispatchEvent("remove");for(var t in this)delete this[t];return this},reset:function(){var e=this.follow;return e?this.__follow(e):this.__center(),this.__dispatchEvent("reset"),this},focus:function(){var t=this.node,n=this.__popup,r=i.current,s=this.zIndex=i.zIndex++;r&&r!==this&&r.blur(!1);if(!e.contains(t,this.__getActive())){var o=n.find("[autofocus]")[0];!this._autofocus&&o?this._autofocus=!0:o=t,this.__focus(o)}return n.css("zIndex",s),i.current=this,n.addClass(this.className+"-focus"),this.__dispatchEvent("focus"),this},blur:function(){var e=this.__activeElement,t=arguments[0];return t!==!1&&this.__focus(e),this._autofocus=!1,this.__popup.removeClass(this.className+"-focus"),this.__dispatchEvent("blur"),this},addEventListener:function(e,t){return this.__getEventListener(e).push(t),this},removeEventListener:function(e,t){var n=this.__getEventListener(e);for(var r=0;r<n.length;r++)t===n[r]&&n.splice(r--,1);return this},__getEventListener:function(e){var t=this.__listener;return t||(t=this.__listener={}),t[e]||(t[e]=[]),t[e]},__dispatchEvent:function(e){var t=this.__getEventListener(e);this["on"+e]&&this["on"+e]();for(var n=0;n<t.length;n++)t[n].call(this)},__focus:function(e){try{this.autofocus&&!/^iframe$/i.test(e.nodeName)&&e.focus()}catch(t){}},__getActive:function(){try{var e=document.activeElement,t=e.contentDocument,n=t&&t.activeElement||e;return n}catch(r){}},__center:function(){var t=this.__popup,n=e(window),r=e(document),i=this.fixed,s=i?0:r.scrollLeft(),o=i?0:r.scrollTop(),u=n.width(),a=n.height(),f=t.width(),l=t.height(),c=(u-f)/2+s,h=(a-l)*382/1e3+o,p=t[0].style;p.left=Math.max(parseInt(c),s)+"px",p.top=Math.max(parseInt(h),o)+"px"},__follow:function(t){var n=t.parentNode&&e(t),r=this.__popup;this.__followSkin&&r.removeClass(this.__followSkin);if(n){var i=n.offset();if(i.left*i.top<0)return this.__center()}var s=this,o=this.fixed,u=e(window),a=e(document),f=u.width(),l=u.height(),c=a.scrollLeft(),h=a.scrollTop(),p=r.width(),d=r.height(),v=n?n.outerWidth():0,m=n?n.outerHeight():0,g=this.__offset(t),y=g.left,b=g.top,w=o?y-c:y,E=o?b-h:b,S=o?0:c,x=o?0:h,T=S+f-p,N=x+l-d,C={},k=this.align.split(" "),L=this.className+"-",A={top:"bottom",bottom:"top",left:"right",right:"left"},O={top:"top",bottom:"top",left:"left",right:"left"},M=[{top:E-d,bottom:E+m,left:w-p,right:w+v},{top:E,bottom:E-d+m,left:w,right:w-p+v}],_={left:w+v/2-p/2,top:E+m/2-d/2},D={left:[S,T],top:[x,N]};e.each(k,function(e,t){M[e][t]>D[O[t]][1]&&(t=k[e]=A[t]),M[e][t]<D[O[t]][0]&&(k[e]=A[t])}),k[1]||(O[k[1]]=O[k[0]]==="left"?"top":"left",M[1][k[1]]=_[O[k[1]]]),L+=k.join("-")+" "+this.className+"-follow",s.__followSkin=L,n&&r.addClass(L),C[O[k[0]]]=parseInt(M[0][k[0]]),C[O[k[1]]]=parseInt(M[1][k[1]]),r.css(C)},__offset:function(t){var n=t.parentNode,r=n?e(t).offset():{left:t.pageX,top:t.pageY};t=n?t:t.target;var i=t.ownerDocument,s=i.defaultView||i.parentWindow;if(s==window)return r;var o=s.frameElement,u=e(i),a=u.scrollLeft(),f=u.scrollTop(),l=e(o).offset(),c=l.left,h=l.top;return{left:r.left+c-a,top:r.top+h-f}}}),i.zIndex=1024,i.current=null,i}),define("dialog-config",{autofocusDefBut:"ok",backdropBackground:"#000",backdropOpacity:.7,content:'<span class="ui-dialog-loading">Loading..</span>',title:"",statusbar:"",button:null,ok:null,cancel:null,okValue:"OK",cancelValue:"Cancel",cancelDisplay:!0,width:"",height:"",padding:"",skin:"",quickClose:!1,cssUri:"",innerHTML:'<div i="dialog" class="ui-dialog"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div><table class="ui-dialog-grid"><tr><td i="header" class="ui-dialog-header"><button i="close" class="ui-dialog-close">&#215;</button><div i="title" class="ui-dialog-title"></div></td></tr><tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content"></div></td></tr><tr><td i="footer" class="ui-dialog-footer"><div i="statusbar" class="ui-dialog-statusbar"></div><div i="button" class="ui-dialog-button"></div></td></tr></table></div>'}),define("dialog",["jquery","popup","dialog-config"],function(e,t,n){var r=0,i=new Date-0,s=!("minWidth"in e("html")[0].style),o="createTouch"in document&&!("onmousemove"in document)||/(iPhone|iPad|iPod)/i.test(navigator.userAgent),u=!s&&!o,a=function(t,n,s){var f=t=t||{};if(typeof t=="string"||t.nodeType===1)t={content:t,fixed:!o};t=e.extend(!0,{},a.defaults,t),t.original=f;var l=t.id=t.id||i+r,c=a.get(l);return c?c.focus():(u||(t.fixed=!1),t.quickClose&&(t.modal=!0,t.backdropOpacity=0),e.isArray(t.button)||(t.button=[]),s!==undefined&&(t.cancel=s),t.cancel&&t.button.push({id:"cancel",value:t.cancelValue,callback:t.cancel,display:t.cancelDisplay,autofocus:t.autofocusDefBut=="cancel"}),n!==undefined&&(t.ok=n),t.ok&&t.button.push({id:"ok",value:t.okValue,callback:t.ok,autofocus:t.autofocusDefBut=="ok"}),a.list[l]=new a.create(t))},f=function(){};f.prototype=t.prototype;var l=a.prototype=new f;return a.create=function(n){var i=this;e.extend(this,new t);var s=n.original,o=e(this.node).html(n.innerHTML),u=e(this.backdrop);return this.options=n,this._popup=o,e.each(n,function(e,t){typeof i[e]=="function"?i[e](t):i[e]=t}),n.zIndex&&(t.zIndex=n.zIndex),o.attr({"aria-labelledby":this._$("title").attr("id","title:"+this.id).attr("id"),"aria-describedby":this._$("content").attr("id","content:"+this.id).attr("id")}),this._$("close").css("display",this.cancel===!1?"none":"").attr("title",this.cancelValue).on("click",function(e){i._trigger("cancel"),e.preventDefault()}),this._$("dialog").addClass(this.skin),this._$("body").css("padding",this.padding),n.quickClose&&u.on("onmousedown"in document?"mousedown":"click",function(){return i._trigger("cancel"),!1}),this.addEventListener("show",function(){u.css({opacity:0,background:n.backdropBackground}).animate({opacity:n.backdropOpacity},150)}),this._esc=function(e){var n=e.target,r=n.nodeName,s=/^input|textarea$/i,o=t.current===i,u=e.keyCode;if(!o||s.test(r)&&n.type!=="button")return;u===27&&i._trigger("cancel")},e(document).on("keydown",this._esc),this.addEventListener("remove",function(){e(document).off("keydown",this._esc),delete a.list[this.id]}),r++,a.oncreate(this),this},a.create.prototype=l,e.extend(l,{content:function(t){var n=this._$("content");return typeof t=="object"?(t=e(t),n.empty("").append(t.show()),this.addEventListener("beforeremove",function(){e("body").append(t.hide())})):n.html(t),this.reset()},title:function(e){return this._$("title").text(e),this._$("header")[e?"show":"hide"](),this},width:function(e){return this._$("content").css("width",e),this.reset()},height:function(e){return this._$("content").css("height",e),this.reset()},button:function(t){t=t||[];var n=this,r="",i=0;return this.callbacks={},typeof t=="string"?(r=t,i++):e.each(t,function(t,s){var o=s.id=s.id||s.value,u="";n.callbacks[o]=s.callback,s.display===!1?u=' style="display:none"':i++,r+='<button type="button" i-id="'+o+'"'+u+(s.disabled?" disabled":"")+(s.autofocus?' autofocus class="ui-dialog-autofocus"':"")+">"+s.value+"</button>",n._$("button").on("click","[i-id="+o+"]",function(t){var r=e(this);r.attr("disabled")||n._trigger(o),t.preventDefault()})}),this._$("button").html(r),this._$("footer")[i?"show":"hide"](),this},statusbar:function(e){return this._$("statusbar").html(e)[e?"show":"hide"](),this},_$:function(e){return this._popup.find("[i="+e+"]")},_trigger:function(e){var t=this.callbacks[e];return typeof t!="function"||t.call(this)!==!1?this.close().remove():this}}),a.oncreate=e.noop,a.getCurrent=function(){return t.current},a.get=function(e){return e===undefined?a.list:a.list[e]},a.list={},a.defaults=n,a}),define("message",["jquery","ajaxtpl","dialog"],function(e,t,n){function o(e,t){e=e||"success";var n=i?' style="'+i+'"':"",r=s?" "+s:"";return'<table class="sys_mess"><tr><th valign="center"><div class="ico ico_'+e+'"></div></th><td valign="center"><div class="msg'+s+'"'+n+">"+t+"</div></td></tr></table>"}function u(t,i,s){var u=e.extend({title:r.title,content:""},s);return u.content||(u.content=o(t,i)),n(u)}function a(t){return e.isFunction(t)}function f(t){var n={autofocusDefBut:"cancel",cancelValue:r.cancel,cancel:function(){return!0}};return typeof t=="undefined"?n:a(t)?(n.cancel=t,n):("styles"in t&&(i=t.styles,delete t.styles),"addcss"in t&&(s=t.addcss,delete t.addcss),e.isEmptyObject(t)?n:e.extend(n,t))}function l(e,t){var n=f(t);n.cancelValue=r.ok;var i=u("success",e,n);return i.showModal()}function c(e,t){var n=f(t),r=u("error",e,n);return r.showModal()}function h(e,t){var n=f(t),r=u("warning",e,n);return r.showModal()}function p(r,i,s,o){i=i||e.noop(),s=s||e.noop(),o=o||"index",t(r,function(e,t,r){n({id:t+"_win",content:e,title:"loading",onshow:i,onremove:s}).showModal()},o)}if(window["DB"].leng=="zh")var r={title:"消 息",ok:"确 定",cancel:"取 消"};else var r={title:"Message",ok:"OK",cancel:"Cancel"};var i="",s="";return{success:l,ok:l,error:c,warning:h,win:p,dialog:n}}),define("searchauto",["jquery"],function(e){function u(s){t=e('<ul id="'+s+'"></ul>').appendTo(document.body).on("mouseenter","li",function(){var t=e(this);i=t.index(),t.siblings().removeClass("current"),t.addClass("current")}).on("mouseleave","li",function(){e(this).removeClass("current")}).on("click","li",function(){var i=r[e(this).index()].keys;n.val(i),t.hide(),e(".so:visible form")[0].submit()})}function a(e){try{if(e.target.parentNode.id=="auto_complete_layer")return;t.hide()}catch(n){}}function f(){e("input.s_key_input").focus(function(){e(document).on("mousedown",a)}).blur(function(){e(document).off("mousedown",a)}).on("keyup",function(a){var f=a.which;if(f==13)return;if(f==38||f==40){try{if(!t.length||t.is(":hidden"))return}catch(l){return}var c=t.find("li"),h=c.length,p=i;f==38?i--:i++;if(i>=h||i<0)i=f==38?h:-1;if(i===-1||i===h){n.val(s),c.removeClass("current");return}p!==-1&&c.eq(p).removeClass("current");var d=c.eq(i).addClass("current").text();n.val(r[i].keys);return}n=e(this);var v=n.val();if(v.length<3){try{t.hide()}catch(l){return}return}if(v===s)return;s=v;var m="auto_complete_layer";e("#"+m).length||u(m);var g="";e.get("/index.php?app=search&search_type=remind&lang="+o,{search_keyword:v},function(i){if(!i.done)return;if(i.retval.len){r=i.retval.rows,e.each(i.retval.rows,function(e,t){g+="<li>"+t.connect+"</li>"});var s=n.offset();t.html(g).css({width:n.outerWidth()-2,left:s.left,top:s.top+n.outerHeight(),display:"block"})}else t.hide()},"json")})}var t=null,n=null,r=null,i=-1,s="",o=window.DB.leng;return{init:f}}),function(e){typeof define=="function"&&define.amd?define("placeholder",["jquery"],e):typeof exports=="object"?e(require("jquery")):e(jQuery)}(function(e){var t="placeholder",n=document,r=Object.prototype.toString.call(window.operamini)=="[object OperaMini]",i="placeholder"in n.createElement("input")&&"placeholder"in n.createElement("textarea")&&!r,s={FOCUS:"focus.placeholder",BLUR:"blur.placeholder"},o={cssClass:"placeholder",normalize:!1},u=e.fn.val,a=function(t){return e.nodeName(t,"input")||e.nodeName(t,"textarea")},f=function(t){var n=["placeholder","name","id"],r={},i;for(var s=0,o=t.attributes.length;s<o;s++)i=t.attributes[s],i.specified&&e.inArray(i.name,n)<0&&(r[i.name]=i.value);return r},l=function(e){e.css({position:"",left:""})},c=function(e){e.css({position:"absolute",left:"-9999em"})};if(i&&!o.normalize)return;i?i&&o.normalize&&(e.fn.val=function(){var n=arguments,r=this[0];if(!r)return;return n.length?this.each(function(r,i){var s=e(i),o=e.data(i,t),f=i._placeholder;o&&f&&a(i)&&(!n[0]&&i.value!==f?s.addClass(o.cssClass).attr("placeholder",f):n[0]&&s.hasClass(o.cssClass)&&s.removeClass(o.cssClass)),u.apply(s,n)}):u.apply(this,n)}):e.fn.val=function(){var n=arguments,r=this[0],i;if(!r)return;return n.length?this.each(function(r,i){var s=e(i),o=e.data(i,t),f=s.attr("placeholder");o&&f&&a(i)?!n[0]&&i.value!==f?i.value=s.addClass(o.cssClass).attr("placeholder"):n[0]&&(s.hasClass(o.cssClass)&&s.removeClass(o.cssClass),u.apply(s,n)):u.apply(s,n)}):(i=e(r).attr("placeholder"),i&&a(r)?r.value===i?"":r.value:u.apply(this,n))},e.fn[t]=function(n){var r=e.extend(o,n);if(!this.length||i&&!r.normalize)return;return n==="destroy"?this.filter(function(n,r){return e.data(r,t)}).removeClass(r.cssClass).each(function(n,r){var s=e(r).unbind(".placeholder"),o=r.type==="password",a=s.attr("placeholder");i?delete r._placeholder:(r.value===a&&(r.value=""),o&&(l(s),s.prev().unbind(".placeholder").remove())),e.fn.val=u,e.removeData(r,t)}):this.each(function(n,o){if(e.data(o,t))return;e.data(o,t,r);var u=e(o),a=o.type==="password",h=u.attr("placeholder"),p=null,d=null,v=null;i?i&&r.normalize&&(o._placeholder=u.attr("placeholder"),d=function(){o.value||u.addClass(r.cssClass).attr("placeholder",h)},v=function(){u.removeAttr("placeholder").removeClass(r.cssClass)}):(d=function(){u.val()?u.val()&&a&&v():a?(l(p),c(u)):u.val(h).addClass(r.cssClass)},a?(v=function(){l(u),c(p)},p=e("<input>",e.extend(f(o),{type:"text",value:h,tabindex:-1})).addClass(r.cssClass).bind(s.FOCUS,function(){u.trigger(s.FOCUS)}).insertBefore(u)):v=function(){u.hasClass(r.cssClass)&&(o.value="",u.removeClass(r.cssClass))}),u.bind(s.BLUR,d).bind(s.FOCUS,v).trigger(s.BLUR)})},e(function(){e("input[placeholder], textarea[placeholder]")[t]()})}),define("pubjs",["placeholder"],function(){function t(e,t){var n=e,r=t,i=navigator.userAgent.toLowerCase();if(i.indexOf("360se")>-1)alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");else if(i.indexOf("msie 8")>-1)window.external.AddToFavoritesBar(n,r);else if(document.all)try{window.external.addFavorite(n,r)}catch(s){alert("您的浏览器不支持,请按 Ctrl+D 手动收藏!")}else window.sidebar?window.sidebar.addPanel(r,n,""):alert("您的浏览器不支持,请按 Ctrl+D 手动收藏!")}$(".chat").click(function(){window.open("http://cs.ecqun.com/cs/?id=660133&cid=659827&scheme=0&handle=&url=http%3A%2F%2Fwww.molbase.com%2Fzh%2Findex.html&version=4.0.0.0","newwindow","height=5, width=890, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no")}),$(document).ready(function(){window.DB.READY=!0});var e=$.now();$.post("/zh/index.php?app=default&act=cart_value&v="+e,{t:e},function(e){$(".login-load").show();if(e.done){var t=e.retval.n,n=e.retval.tips;e.retval.l?($("#login").fadeIn("fast"),$("#user_name").text(t).fadeIn("fast"),$("#login .exit").fadeIn("fast"),n<=0?($("#message").fadeIn("fast"),$("#message .message").hide(),$("#message .no-message").fadeIn("fast")):($("#message").fadeIn("fast"),$("#message .message").fadeIn("fast"),$("#tips").text(n),$("#message .no-message").hide()),typeof ga!="undefined"&&e.retval.i>0&&ga("set","&uid",e.retval.i)):($("#user_name").hide(),$(".vistor").fadeIn("fast"),$("#login .exit").hide(),$("#message").hide(),$("#no-login").fadeIn("fast"),$("#login").fadeIn("fast"))}},"json"),$("#login .exit").click(function(){$("#user_name").hide(),$(".vistor").show(),$("#login .exit").hide(),$("#message").hide(),$("#no-login").show(),$.post("/zh/index.php?app=member&act=ajaxLogout",function(e){},"json")}),$(".collect").click(function(){t("摩贝化合物搜索","http://www.molbase.com")}),window.onscroll=function(){var e=document.documentElement.scrollTop||document.body.scrollTop;e>300?$(".fix_nav ul li.top").fadeIn():$(".fix_nav ul li.top").fadeOut()},$(".fix_nav ul li.top").click(function(){return $("html,body").animate({scrollTop:"0px"},800),!1}),$(".search .tab li").click(function(){var e=$(this).attr("data-id");$(this).addClass("cur"),$(this).siblings().removeClass("cur"),$(this).parent().siblings(".f"+e).show(),$(this).parent().siblings(".f"+e).siblings(".so").hide();var t=(e+1)%3?(e+1)%3:3,n=(e-1)%3?(e-1)%3:3;$(" .search #keyword_"+e).css("display","block"),$(" .search #keyword_"+t).css("display","none"),$(" .search #keyword_"+n).css("display","none")}),new Marquee("link",0,.1,1040,20,20,3e3,1e3,20)}),define("top10",["module","jquery","message"],function(e,t,n){t(document).ready(function(){function i(e){var n=-e*r;t(".top10 .banner").stop(!0,!1).animate({left:n},300),t(".top10 .btn span").removeClass("cur").eq(e).addClass("cur")}var e=2,n=0,r=1150;t(".top10 .btn span").mouseover(function(){n=t(".top10 .btn span").index(this),t(this).addClass("on"),t(this).siblings().removeClass("cur"),i(n)}).eq(0).trigger("mouseover"),t(".top10 .pre").click(function(){n-=1,n==-1&&(n=e-1),i(n)}),t(".top10 .next").click(function(){n+=1,n==e&&(n=0),i(n)})})}),define("page/moldata_catalog",["module","jquery","message","searchauto","pubjs","top10"],function(e,t,n,r){t(document).ready(function(){r.init(),t(".expand").click(function(){t(this).toggleClass("cur"),t(".tab-con dl").siblings(".other").toggleClass("cur"),t(".tab-con dl").siblings(".other").toggle()})})});