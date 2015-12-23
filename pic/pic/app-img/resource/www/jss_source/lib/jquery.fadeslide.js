/*
 * 商城渐隐滚动模块
 */
define(['jquery'], function($){
    //var leng=window['DB'].leng;
	var mallFadeSlide = function(setOption) {
		var _this = this;

		_this.defaultOption = {
			speed : 300,
			banner_box : '.banner-box .bd',
			button_num_box : '.banner-btn .hd',
			button_go_form : '.banner-btn',
			onClass : 'on',
			prev : 'prev',
			next : 'next',
			auto : 1,
			autoSecond :3000	
		}
		_this.option = null;
		_this.config = function(setOption){
	        _this.option = mergeArray(_this.defaultOption, setOption);
	    }
		if (typeof setOption != 'undefined') {
	        _this.config(setOption);
	    } else {
	    	_this.option = _this.defaultOption;
	    }

		_this.sildeIn = {
			allNum : 0,		//滚动的banner数
			onNum : 1,		//当前滚动第几个
			autoEvent : null //循环滚动的对象
		};

		_this.init = function(){
			$(_this.option.banner_box+' ul li').css('z-index', '1');
			$(_this.option.banner_box+' ul li:eq(0)').css('z-index', '2');

			_this.sildeIn.allNum = $(_this.option.banner_box+' ul li').size();
			if(_this.sildeIn.allNum  > 1){
				var numBtnHtml = '<ul>';
				for(var i=1; i<=_this.sildeIn.allNum; i++){
					numBtnHtml += '<li '+(i == 1 ? 'class="'+_this.option.onClass+'"' : '')+'>'+i+'</li>';
				}
				numBtnHtml += '</ul>';
				$(_this.option.button_num_box).append(numBtnHtml);
				
				$(_this.option.banner_box+' ul li').css('position', 'absolute');
				$(_this.option.button_num_box+' ul').css({'position': 'relative', 'z-index' : 10})
				$(_this.option.button_go_form).css({'position': 'relative', 'z-index' : 10})

				$(_this.option.button_num_box+' ul li').click(function(){
					var n = $(this).html();
					_this.slide(n)
				});
				
				$(_this.option.button_num_box+' ul').hover(function() {
					_this.clearAutoSlide();
				}, function() {
					_this.autoSlide();
				});

				$(_this.option.button_go_form+' a').click(function(){
					var className = $(this).attr('class');
					if(className.indexOf(_this.option.prev) > -1){
						_this.slidePrev();
					} else if(className.indexOf(_this.option.next) > -1 ){
						_this.slideNext();
					}
				}).hover(function() {
					_this.clearAutoSlide();
				}, function() {
					_this.autoSlide();
				});

				if(_this.option.auto){
					_this.autoSlide();
				}
			}
		};
		
		_this.slideNext = function(){
			var onNum = parseInt(_this.sildeIn.onNum);
			var doNum = _this.sildeIn.onNum  < _this.sildeIn.allNum ? onNum+1 : 1;
			_this.slide(doNum);
		}

		_this.slidePrev = function(){
			var onNum = parseInt(_this.sildeIn.onNum);
			var doNum = _this.sildeIn.onNum  > 1 ? onNum-1 : _this.sildeIn.allNum;
			_this.slide(doNum);
			
		}

		_this.slide = function(n){
			if(n != this.sildeIn.onNum){
				var eqNum = n-1;
				var beforeNum = this.sildeIn.onNum - 1;
				var beforeObj = $(_this.option.banner_box+' ul li:eq('+beforeNum+')');

				var curObj = $(_this.option.banner_box+' ul li:eq('+eqNum+')');
				curObj.css({'opacity':'1'});
				curObj.css({ 'z-index' : 2});
				beforeObj.css({ 'z-index' : 3});

				beforeObj.stop(true,false).fadeTo(_this.option.speed, 0, function(){
					_this.sildeIn.onNum  = n;
					beforeObj.css({ 'z-index' : 1});
				});

				//更新当前的banner
				$(_this.option.button_num_box+' ul li:eq('+beforeNum+')').removeClass(_this.option.onClass);
				$(_this.option.button_num_box+' ul li:eq('+eqNum+')').addClass(_this.option.onClass);
				
			}
		}

		_this.autoSlide = function(){
			_this.sildeIn.autoEvent = setInterval(function(){
				_this.slideNext();
			}, _this.option.autoSecond);
		}

		_this.clearAutoSlide = function(){
			clearInterval(_this.sildeIn.autoEvent);
		}
	}
    return mallFadeSlide;
});
