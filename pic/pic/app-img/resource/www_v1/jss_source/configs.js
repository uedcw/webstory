/*
	全局配置
*/
require.config({
    paths: {
        'jquery':           'pub_jss/lib/jquery-1.11.2',        // 不参与合并
        'chemwriter':       'pub_jss/lib/chemwriter',           // 结构图画板(chemwriter 2.15.3) 不参与合并
        'json':             'pub_jss/lib/json2',                // 不参与合并

        'nicescroll':       'pub_jss/lib/jquery.nicescroll',    // 滚动条插件
        'cookie':           'pub_jss/lib/jquery.cookie',        // cookie插件
        'oninputchange':    'pub_jss/lib/jquery.oninputchange', // oninput插件(监听输入框值变化)
        'placeholder':      'pub_jss/lib/jquery.placeholder',   // placeholder插件(让低版本浏览器支持placeholder属性)
        'pagination':       'pub_jss/lib/jquery.pagination',    // pagination分页插件
        'tabs':             'pub_jss/lib/jquery.tabs',          // tabs插件
        'smartfloat':       'pub_jss/lib/jquery.smartfloat',    // float插件
        'validate':         'pub_jss/lib/jquery.validate',      // validate验证插件
        'ajaxformpost':     'pub_jss/lib/jquery.ajaxformpost',  // ajaxFormPost提交插件
        'dialog':           'pub_jss/lib/dialog',               // dialog 6.4
        'dialog-config':    'pub_jss/lib/dialog-config',        // dialog配置文件
        'popup':            'pub_jss/lib/popup',                // HTML5的popup实现(dialog必须)
        'store':            'pub_jss/lib/store',                // 浏览器本地存储
        'url':              'pub_jss/lib/url',                  // 获得URL中的参数值
        'focus':            'pub_jss/lib/focus',                // 延时focus
        'number':           'pub_jss/lib/number',               // 精确数值计算
        'message':          'pub_jss/lib/message',              // 系统消息提示组件
        'message_new':      'pub_jss/lib/message_new',          // 系统消息提示组件
        'form2js':          'pub_jss/lib/form2js',              // 获得表单的JS代码,用于快速开发
        'ajaxtpl':          'pub_jss/lib/ajaxtpl',              // AJAX加载HTML模板文件
        'ajaxtpl_new':      'pub_jss/lib/ajaxtpl_new',              // AJAX加载HTML模板文件
        'imgs':             'pub_jss/lib/imgs',                 // 图片处理(zoom,ready)
        'suningimg':        'pub_jss/lib/suningimg',            // 图片焦点图
        'drag':             'pub_jss/lib/drag',                 // drag拖拽
        'selectbox':        'pub_jss/lib/selectbox',            // selectbox
        'webuploader':      'pub_jss/lib/webuploader',          // webuploader
        'rankingimgs':      'pub_jss/lib/ranking-img-scroll',   // 底部的ranking 图片 滚动
        'marquee':          'pub_jss/lib/marquee',              // 无缝滚动
        'moment':           'pub_jss/lib/moment',               // 时间差格式化插件

        'cklogin':          'pub_jss/mod/cklogin',              // AJAX检查用户登录
        'chemw':            'pub_jss/mod/chemw',                // 封装并扩展后的结构图画板(chemwriter)
        'fungform':         'pub_jss/mod/fungform',             // 首页官能团
        'batchform':        'pub_jss/mod/batchform',            // 首页批量搜索
        'searchauto':       'pub_jss/mod/searauto',           // 搜索框自动完成
        'backtop':          'pub_jss/mod/backtop',              // 返回顶部
        'guidelayer':       'pub_jss/mod/guidelayer',           // CAS页引导层
        'filterbar':        'pub_jss/mod/filterbar',            // CAS筛选工具条
        'inquirywin':       'pub_jss/mod/inquirywin',           // 询单(弹)层
        'loginwin':         'pub_jss/mod/loginwin',             // 登录(弹)层
        'loginwin_v1':      'pub_jss/mod/loginwin_v1',          // 登录(弹)层
        'attentionwin':     'pub_jss/mod/attentionwin',         // 关注(弹)层
        'favstore':         'pub_jss/mod/favstore',             // 关注店铺
        'inquiryckmail':    'pub_jss/mod/inquiryckmail',        // 询单用户邮箱验证处理
        'pubjs':            'pub_jss/mod/pubjs',               // 页面公共JS
        'top10':            'pub_jss/mod/top10'      
    },
    shim: {
        'nicescroll':{
            deps: ['jquery'],
            exports: 'jQuery.fn.nicescroll'
        },
        'cookie':{
            deps: ['jquery'],
            exports: 'jQuery.fn.cookie'
        },
        'oninputchange':{
            deps: ['jquery'],
            exports: 'jQuery.fn.onInputChange'
        },
        'placeholder':{
            deps: ['jquery'],
            exports: 'jQuery.fn.placeholder'
        },
        'pagination':{
            deps: ['jquery'],
            exports: 'jQuery.fn.pagination'
        },
        'tabs':{
            deps: ['jquery'],
            exports: 'jQuery.fn.tabs'
        },
        'smartfloat':{
            deps: ['jquery'],
            exports: 'jQuery.fn.smartfloat'
        },
        'validate':{
            deps: ['jquery'],
            exports: 'jQuery.fn.validate'
        },
        'ajaxformpost':{
            deps: ['jquery'],
            exports: 'jQuery.fn.ajaxFormPost'
        },
        'dialog':{
            deps: ['jquery','popup','dialog-config'],
            exports: 'dialog'
        },
        'popup':{
            deps: ['jquery']
        },
        'drag':{
            deps: ['jquery']
        },
        'selectbox':{
            deps: ['jquery','popup']
        },
        'chemwriter':{
            exports: 'chemwriter'
        },
        'chemw':{
            deps: ['store','chemwriter'],
            exports: 'chemw'
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
})();