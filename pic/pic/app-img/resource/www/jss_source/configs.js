/*
	全局配置
*/
require.config({
    paths: {
        'jquery':           'lib/jquery-1.11.2',        // 不参与合并
        'json':             'lib/json2',                // 不参与合并
        'placeholder':      'lib/jquery.placeholder',   // placeholder插件(让低版本浏览器支持placeholder属性)
        'scroll':       	'lib/jquery.scrolllist',    //文字单条滚动
        'slide' : 			'lib/jquery.slides',		//banner滚动
        'fadeslide' : 		'lib/jquery.fadeslide',		//banner渐隐切换（直销页面使用）
        'marquee' : 		'lib/jquery.marquee',		//文字无缝滚动

        'store':            'lib/store',                // 浏览器本地存储
        'number':           'lib/number',               // 精确数值计算
        'imgs':             'lib/imgs',                 // 图片处理(zoom,ready)
        'suningimg':        'lib/suningimg',            // 图片焦点图
        'drag':             'lib/drag',                 // drag拖拽
        'autocheck':        'lib/autocheck',           	//验证插件
        'malldialog':       'lib/malldialog',           //商城弹出框
        'style':       		'lib/style',           		//页面样式操作,
        'loadBanner':       'lib/jquery.loadBanner',    //页面初始banner展现效果
        
        'malluser':         'mod/malluser',             //商城用户
        'mallpublic':       'mod/mallpublic',           //商城公共模块（事件，公用方法）
        'cart':          	'mod/cart',              	//购物车
        'doCart' : 			'mod/docart',             	//操作购物车
        'dialogaddcart' : 	'mod/dialogaddcart'        //弹出框购物车
    },
    shim: {
        'placeholder':{
            deps: ['jquery'],
            exports: 'jQuery.fn.placeholder'
        },
        'scroll':{
            deps: ['jquery'],
            exports: 'jQuery.fn.scrollList'
        },
        'slide':{
        	deps: ['jquery'],
        	exports: 'jQuery.fn.slides'
        },
        'fadeslide':{
        	deps: ['jquery'],
        	exports: 'jQuery.fn.slide'
        },
        'loadBanner':{
        	deps: ['jquery'],
        	exports: 'jQuery.fn.loadBanner'
        },
        'marquee':{
        	deps: ['jquery'],
        	exports: 'jQuery.fn.kxbdMarquee'
        },
        'cart':{
            deps: ['jquery'],
            exports: 'cart'
        },
        'autocheck':{
            deps: ['jquery']
        },
        'malldialog':{
            deps: ['jquery']
        },
        'dialogaddcart': {
        	deps: ['cart']
        }
    }
});

/*
 全局定义
*/
(function(){
	try{document.execCommand('BackgroundImageCache',false,true);}catch(e){};
	window.Aobj=function(o,l){if(typeof o!=='object'){return alert(o);};l=l||0;var h,s=[];for(v in o){s.push(v+' = '+o[v]);}h=s.join('\n');if(l)return h;alert(h);}

	var Sys={},
        ua=navigator.userAgent.toLowerCase(),
        s;
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
	(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
	(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
	(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
	(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
	var isIE=Sys.ie||false;
	var isIE6=isIE && (window.VBArray && !window.XMLHttpRequest);
	var isMobile=('createTouch' in document) && !('onmousemove' in document) || /(iPhone|iPad|iPod)/i.test(ua);
	window['UA']={
		isIE:		isIE,
		isIE6:		isIE6,
		isIE7:		isIE==7.0,
		isIE8:		isIE==8.0,
		isIE9:		isIE==9.0,
		isIE10:		isIE==10.0,
		isIE11:		isIE==11.0,
		isFF:		Sys.firefox||false,
		isGG:		Sys.chrome||false,
		isSA:		Sys.safari||false,//safari;
		isMobile:	isMobile,
		isDTD:		/CSS1Compat/i.test(document.compatMode),
		isFixed:	!isIE6 && !isMobile,
		show:function(){
			var t=[];
			t.push('navigator.userAgent: '+navigator.userAgent);
			for(v in window['UA']){
				if(v!=='show'){
					t.push(v+': '+window['UA'][v]);
				}
			}
			alert(t.join('\n'));
		}
	};

	if(!document.all && typeof(HTMLElement)!="undefined" && !window.opera)
	{
		HTMLElement.prototype.contains=function(oNode){if(!oNode){return false;}do if(oNode==this){return true;}while(oNode=oNode.parentNode);return false;};
//		HTMLElement.prototype.insertAdjacentHTML=function(where,html){var e=this.ownerDocument.createRange();e.setStartBefore(this);e=e.createContextualFragment(html);this.insertAdjacentElement(where,e);};
//		HTMLElement.prototype.insertAdjacentElement=function(where,e){switch(where){case 'beforeBegin':this.parentNode.insertBefore(e,this);break;case 'afterBegin':this.insertBefore(e,this.firstChild);break;case 'beforeEnd':this.appendChild(e);break;case 'afterEnd':if(!this.nextSibling){this.parentNode.appendChild(e);}else{this.parentNode.insertBefore(e,this.nextSibling);}break;}};
//		HTMLElement.prototype.__defineGetter__("outerHTML",function(){var ol=this.attributes,sl="<"+this.tagName,i;for(i=0;i< ol.length;i++){if(ol[i].specified){sl+=" "+ol[i].name+'="'+ol[i].value+'"';}}return !this.canHaveChildren?sl+">":sl+">"+this.innerHTML+"</"+this.tagName+">";});
//		HTMLElement.prototype.__defineSetter__("outerHTML",function(str){var oRange=this.ownerDocument.createRange();oRange.setStartBefore(this);this.parentNode.replaceChild(oRange.createContextualFragment(str),this);});
//		HTMLElement.prototype.__defineGetter__("innerText",function(){return this.textContent;});
//		HTMLElement.prototype.__defineSetter__("innerText",function(str){this.textContent = str;});
//		HTMLElement.prototype.__defineGetter__("canHaveChildren",function(){return !/^(area|base|basefont|col|frame|hr|img|br|input|isindex|link|meta|param)$/.test(this.tagName.toLowerCase());});
//		HTMLElement.prototype.__defineGetter__("currentStyle", function(){return this.ownerDocument.defaultView.getComputedStyle(this,null);});
	}

/*	String PATH
	trim		移去字符串前后的空格
	lenB		获得字符串长度,一个中文计算为2个字符
	leftB		截取字符串到指定长度
	slice		字符串切片,n1=开始,n2=从开始位置这后的切片长度n2>n1||-1(尾部)
	inc			查找字符串中是否有s1,s2分隔符(默认为,)返回1||0
	urlArg		获得URL资源字符串中指定的变量值(str=变量名,sDef=默认值)
	toInnerHTML	转换字符串中的THML标签
	toInt		字符串转数字
*/
if(typeof(String.prototype.trim)!="function"){String.prototype.trim=function(){return this.replace(/(^[\s]*)|([\s]*$)/g,"")}};
if(typeof(String.prototype.rtrim)!="function"){String.prototype.rtrim=function(){return this.replace(/(\s*$)/g,"")}};
if(typeof(String.prototype.lenB)!="function"){String.prototype.lenB=function(){return this.replace(/[^\x00-\xff]/g,"**").length}};
if(typeof(String.prototype.leftB)!="function"){String.prototype.leftB=function(len,isOmit){var s;s=this.replace(/\*/g," ").replace(/[^\x00-\xff]/g,"**");if(s.length>len&&isOmit){len-=3};return this.slice(0,s.slice(0,len).replace(/\*\*/g," ").replace(/\*/g,"").length)+(s.length>len&&isOmit?"...":"")}};
if(typeof(String.prototype._slice)!="function"){String.prototype._slice="".slice;};
if(typeof(String.prototype.slice)!="function"){String.prototype.slice=function(n1,n2){var v,b1=typeof(n1)=="number",b2=typeof(n2)=="number";if(!b1||typeof(n2)=="string"){v=eval("this._slice("+(b1?n1:this.indexOf(n1)+(n2==null?1:0)+(this.indexOf(n1)==-1?this.length:0))+(n2==null?"":(b2?n2:(this.indexOf(n2)==-1?"":","+this.indexOf(n2))))+")")}else{v=eval("this._slice(n1"+(n2==null?"":","+n2)+")")}return v}};
if(typeof(String.prototype.inc)!="function"){String.prototype.inc=function(s1,s2){s2=s2||',';return (s2+this.toLowerCase()+s2).indexOf(s2+s1.toLowerCase()+s2)>-1?1:0;}};
if(typeof(String.prototype.urlArg)!="function"){String.prototype.urlArg=function(str,sDef){if(!(/^\d+$/.test(sDef))){sDef=sDef||'';}var a=this.match(new RegExp("(^|&|\\?)"+str+"=[^&]*"));return (a==null||str=="")?sDef:a[0].slice(str.length+2);}};
if(typeof(String.prototype.toInnerHTML)!="function"){String.prototype.toInnerHTML=function(){var s=this.replace(/&/g,"&amp;").replace(/\"/g,"&quot;").replace(/\'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;");return isIE?s.replace(/&apos;/g,"&#39;"):s;};};
if(typeof(String.prototype.toInt)!="function"){String.prototype.toInt=function(){var t=parseInt(this,10);return isNaN(t)?0:t;}};
if(typeof(Number.prototype.toInt)!="function"){Number.prototype.toInt=function(){var t=parseInt(this,10);return isNaN(t)?0:t;}};
//判断字符串是否为数字（包括浮点型）
if(typeof(String.prototype.isNumber)!="function"){
String.prototype.isNumber = function(){
    var reg = new RegExp(/^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/);
    if(reg.test(this)){
        return true;
    } else {
       return false; 
    }
}};
if(typeof(String.prototype.isInteger)!="function"){
	//判断文字是否为整形数字
	String.prototype.isInteger= function(){
	    var reg = new RegExp(/^[\-\+]?\d+$/);
	    if(reg.test(this)){
	        return true;
	    } else {
	       return false; 
	    }
	}
}
if(typeof(String.prototype.subStr)!="function"){
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
}
//克隆对象
if(typeof cloneObj != "function"){
	window['cloneObj'] = function(obj) {
		var copy;

	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = cloneObj(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");
	};
}

//获取对象长度
if(typeof getObjLength != "function"){
	window['getObjLength'] = function(obj) {
	    var count = 0;
	    for(var i in obj){
	        count ++;
	    }
	    return count;
	 };
}
if(typeof mergeArray != "function"){
	//合并对象元素，前者已有的元素覆盖前者
	 window['mergeArray'] = function(defaultArr, newArr){
	     for(var perOption in defaultArr){
	         if(typeof newArr[perOption] == 'undefined'){
	             newArr[perOption] = defaultArr[perOption];
	         }
	     }
	     return newArr;
	 }
}

//格式化价格
if(typeof toDecimal2 != "function"){
	window['toDecimal2'] = function(s){
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
}
//手动异步加载js
if(typeof htmlDecode !="function"){
	window['htmlDecode'] = function(str)   
	{   
	  var s = "";   
	  if (str.length == 0) return "";   
	  s = str.replace(/&amp;/g, "&");   
	  s = s.replace(/&lt;/g, "<");   
	  s = s.replace(/&gt;/g, ">");   
	  s = s.replace(/&nbsp;/g, " ");   
	  s = s.replace(/&#39;/g, "\'");   
	  s = s.replace(/&quot;/g, "\"");
	  s = s.replace(/&#61;/g, "=");
	  s = s.replace(/&#43;/g, "+");
	  s = s.replace(/&minus;/g, "-"); 
	  s = s.replace(/<br>/g, "\n");   
	  return s;   
	}
}

if(typeof htmlEncode !="function"){
	window['htmlEncode'] = function(str)   
	{   
	  var s = "";   
	  if (str.length == 0) return "";   
	  s = str.replace(/&/g, "&amp;");     
	  s = s.replace(/</g, "&lt;");   
	  s = s.replace(/>/g, "&gt;");   
	  s = s.replace(/ /g, "&nbsp;");   
	  s = s.replace(/\'/g, "&#39;");   
	  s = s.replace(/\"/g, "&quot;");   
	  s = s.replace(/\n/g, "<br>"); 
	  return s;
	}
}
if(typeof clearSpec !="function"){
	window['clearSpec'] = function(str){
		var pattern = new RegExp("[`\\\\''\\\"]");
		var rs = ""; 
		for (var i = 0; i < str.length; i++) { 
			rs += str.substr(i, 1).replace(pattern, '='); 
		} 
		rs = rs.replace(/\s+/g, '+');
		rs = rs.replace(/_/g, '-');
		return rs; 
	}
}

})();