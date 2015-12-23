var molbaseCheck = function(setOption) {
	var _this = this;
	_this.defaultOption = {
		'attrName' : 'name',
		'label' : 'label',
		'returnData' :	1, 	//是否返回验证框的值 1:返回  0：不返回
		'data' : {},
		'input' : '.input'	//绑定的检查元素
	}
	_this.option = null;
	if (typeof setOption != 'undefined') {
        _this.config(setOption);
    } else {
    	_this.option = _this.defaultOption;
    }
	
    _this.config = function(setOption){
        _this.option = mergeArray(_this.defaultOption, setOption);
    }
    _this.reg = {
    	phone : /^([\+][0-9]{1,3}[ \.\-])?([\(]{1}[0-9]{2,6}[\)])?([0-9 \.\-\/]{3,20})((x|ext|extension)[ ]?[0-9]{1,4})?$/,
    	email : /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i
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
		var errorMess = '';
		var objParent = obj.parent();
		var val = obj.val();
		var option  = objParent.find('label').html().replace('：', '').replace(':', '');
		var subName = obj.attr(_this.option.attrName);
		if(obj.hasClass('write')){	//必填写字段
			if(val != ''){
				var regObj = null;
				if(typeof _this.reg[subName] != 'undefined'){
					regObj = new RegExp(_this.reg[subName]);
				}
				if(regObj != null && !regObj.test(val)){
					errorMess = option+'格式不正确!';
				} else if(_this.option.returnData){
					_this.option.data[subName] = val;
				}
			} else {
				errorMess = option+'不能为空！';
			}
			objParent.find('.error_mess').remove();
			obj.removeClass('error');
		} else {
			_this.option.data[subName] = val;
		}
		if(errorMess != ''){
			obj.after('<span class="error_mess">'+errorMess+'</span>');
			obj.addClass('error');
			
			return false;
		} else {
			if(_this.option.returnData){
				return _this.option.data;
			} else {
				return true;
			}
		}
	}
}