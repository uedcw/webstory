define(function(){
/**
 * 图片相关
 */


/**
 * 缩放
 */
    function DrawImage(W, H, FitWidth ,FitHeight){
        var WW=0;
        var HH=0;
        if(W>0 && H>0){
            if(W/H>= FitWidth/FitHeight){
                if(W>FitWidth){
                    WW=FitWidth;
                    HH=(H*FitWidth)/W;
                }else{
                    WW=W;
                    HH=H;
                }
            }else{
                if(H>FitHeight){
                    HH=FitHeight;
                    WW=(W*FitHeight)/H;
                }else{
                    WW=W;
                    HH=H;
                }
            }
        }
        return {width:parseInt(WW,10),height:parseInt(HH,10)};
    }

/**
 * 图片头数据加载就绪事件 - 更快获取图片尺寸
 * @version	2011.05.27	保证回调执行顺序：error > ready > load；2、回调函数this指向img本身
 * @param	{String}	图片路径
 * @param	{Function}	尺寸就绪
 * @param	{Function}	加载完毕 (可选)
 * @param	{Function}	加载错误 (可选)
 * @example imgReady('http://www.google.com.hk/intl/zh-CN/images/logo_cn.png', function () {
		alert('size ready: width=' + this.width + '; height=' + this.height);
	});
 */
    var imgReady=(function(){var list=[],intervalId=null,tick=function(){var i=0;for(;i<list.length;i++){list[i].end?list.splice(i--,1):list[i]()};!list.length&&stop()},stop=function(){clearInterval(intervalId);intervalId=null};return function(url,ready,load,error){var onready,width,height,newWidth,newHeight,img=new Image();img.src=url;if(img.complete){ready.call(img);load&&load.call(img);return};width=img.width;height=img.height;img.onerror=function(){error&&error.call(img);onready.end=true;img=img.onload=img.onerror=null};onready=function(){newWidth=img.width;newHeight=img.height;if(newWidth!==width||newHeight!==height||newWidth*newHeight>1024){ready.call(img);onready.end=true}};onready();img.onload=function(){!onready.end&&onready();load&&load.call(img);img=img.onload=img.onerror=null};if(!onready.end){list.push(onready);if(intervalId===null)intervalId=setInterval(tick,40)}}})();

    return {
        zoom:DrawImage,
        ready:imgReady
    }

});
