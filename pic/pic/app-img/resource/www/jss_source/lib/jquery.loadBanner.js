//初始加载banner
;(function (factory){
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($){
    $.fn.extend({
		loadBanner:function(options){
	        var defaults ={
	           effectTime : 800, //展开执行时间
			   closeTime : 0,  	 //自动关闭时间，0表示不自动关闭，关闭时间指的是在加载显示之后时间
			   effect : 1,		 //1:slide 向下滑动  2:fade 渐显示
			   openCallBack : null,	//banner打开之后执行的回调
			   closeCallBack : null	//banner关闭之后执行的回调
			}
			options = $.extend(defaults, options);
			
			return this.each(function(){
				var _bannerForm = $(this);
				var _banner = $(this).find('img');
				var _interval = null; //循环定时器
				var loadBanner = {
					init : function(){
						var src = _banner.attr('src');
						this.imgReady(src, function(){
							loadBanner.open();
						});
					},
					isCache : function(src){	//banner图片是否缓存
						var img = new Image();
						img.src = src;
						
						return img.complete;
					},
					imgReady : (function() {
						var list = [],
						intervalId = null,
						tick = function() {
							var i = 0;
							for (; i < list.length; i++) {
								list[i].end ? list.splice(i--, 1) : list[i]()
							}; ! list.length && stop()
						},
						stop = function() {
							clearInterval(intervalId);
							intervalId = null
						};
						return function(src, ready, load, error) {
							var onReady, width, height, newWidth, newHeight, img = new Image();
							img.src = src;
							if (img.complete) {
								ready.call(img);
								load && load.call(img);
								return
							};
							width = img.width;
							height = img.height;
							img.onError = function() {
								error && error.call(img);
								onReady.end = true;
								img = img.onload = img.onError = null
							};
							onReady = function() {
								newWidth = img.width;
								newHeight = img.height;
								if (newWidth !== width || newHeight !== height || newWidth * newHeight > 1024) {
									ready.call(img);
									onReady.end = true
								}
							};
							onReady();
							img.onload = function() { ! onReady.end && onReady();
								load && load.call(img);
								img = img.onload = img.onError = null
							};
							if (!onReady.end) {
								list.push(onReady);
								if (intervalId === null) intervalId = setInterval(tick, 40)
							}
						}
					})(),
					open : function(){			//打开banner
						if(options.effect == 1){
							_bannerForm.slideDown(options.effectTime, function(){
								if(typeof options.openCallBack == 'function'){
									options.openCallBack();
								}
								if(options.closeTime > 0){
									loadBanner.autoClose();
								}
							});
						} else {options.effect == 2}{
							
						}
						
					},
					autoClose : function(){	//延迟自动关闭
						if(!_bannerForm.is(":animated")){
							setTimeout(function(){
								loadBanner.close();
							}, options.closeTime);
						}
					},
					close : function(){	//执行关闭
						if(options.effect == 1){
							_bannerForm.slideUp(options.effectTime, function(){
								if(typeof options.closeCallBack == 'function'){
									options.closeCallBack();
								}
							});
						} else {options.effect == 2}{
							
						}
					}
				};
				
				loadBanner.init();
				
			});
		}
    });
}));