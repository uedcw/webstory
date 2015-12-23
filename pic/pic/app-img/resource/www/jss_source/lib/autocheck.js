/*
 * 商城验证模块
 */
define(['jquery'], function($){
    //var leng=window['DB'].leng;
	var mallCheck = function(setOption) {
		var _this = this;
		_this.defaultOption = {
			'attrName' : 'name',
			'label' : 'label',
			'returnData' :	1, 	//是否返回验证框的值 1:返回  0：不返回
			'data' : {},
			'input' : '.input'	//绑定的检查元素
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
	    _this.reg = {
	    	phone : /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
	    	email : /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i,
	    	number  : /^[\-\+]?((([0-9]{1,3})([,][0-9]{3})*)|([0-9]+))?([\.]([0-9]+))?$/,
	    	integer : /^[\-\+]?\d+$/
	    }
	    _this.init = function(){
	    	$(document).on("blur", _this.option.input, function(){
				var _input = $(this);
				_this.check(_input);
			});
	    }
	    
	    //检查所有表单
	    _this.checkAll = function(callBack){
	    	var inputObj = $( _this.option.input);
			var num = inputObj.length;
			var n = 0;
			$('.input').each(function(){
				n++;
				var obj = $(this);
				if(_this.check(obj)){
					if(num == n ){
						if(typeof callBack == 'function'){
							if(_this.option.returnData){	//如果返回form表达值
								callBack(_this.option.data);
							} else {
								callBack();
							}
						}
					}
				} else {
					return false;
				}
			});
	    }
		//检查提交选项
		_this.check = function(obj){
			var val = obj.val();
			var subName = obj.attr('name');
			if(obj.hasClass('write')){	//必填写字段
				var errorMess = '';
				var label = '';
				label = obj.attr('inlabel');
				if(typeof label == 'undefined'){
					var prevObj  = obj.prev();
					var prevName = '';
					if(typeof prevObj.get(0) != 'undefined'){
						prevName = prevObj.get(0).tagName.toLowerCase()
					}
					var labelObj = null;
					if(prevName == 'label'){	//前一个元素为label
						labelObj = prevObj;
					} else {					//不是则在父元素前一个元素寻找
						var pPrevObj = obj.parent().prev();
						if(typeof pPrevObj.get(0) != 'undefined' ){
							prevName =pPrevObj.get(0).tagName.toLowerCase();
							if(prevName == 'label'){
								labelObj = pPrevObj;
							} else {
								return false;		//找不到验证的元素名称
							}
						} else {
							return false;
						}
						
					}
					label = labelObj.html().replace('：', '').replace(':', '');
				}
				if(val != ''){
					var regObj = null;
					if(typeof _this.reg[subName] != 'undefined'){
						regObj = new RegExp(_this.reg[subName]);
					}
					if(regObj != null && !regObj.test(val)){
						errorMess = label+'格式不正确!';
					} else if(_this.option.returnData){
						_this.option.data[subName] = val;
					}
				} else {
					errorMess = label+'不能为空！';
				}
				var nextObj = obj.next();
				obj.removeClass('error');
				if(nextObj.hasClass('error')){
					nextObj.remove();
				} else {
					var nNextObj = nextObj.next();
					if(nNextObj.hasClass('error')){
						nNextObj.remove();
					}
				}
			
				if(errorMess != ''){
					errorMess = '<span class="error">'+errorMess+'</span>';
					var nextObj = obj.next();
					if(typeof nextObj.get(0) != 'undefined'){
						nextObj.after(errorMess);
					} else {
						obj.after(errorMess);
					}
					obj.addClass('error');
					
					return false;
				} else {
					return true;
				}
			} else {
				_this.option.data[subName] = val;
				return true;
			}
		}
	}
    return mallCheck;
});
