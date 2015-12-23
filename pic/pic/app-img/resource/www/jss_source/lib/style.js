//操作页面样式
define(function(){
	var style = {
		//去除同级元素样式，并添加样式到自（ 支持对象传入，id传入）
		addOnClass : function (id, className){
	        var obj = null;
	        if(typeof id == 'object'){
	            obj = $(id);
	        } else {    
	            var obj  = $('#'+id);
	        }
	        obj.siblings().removeClass(className);
	        obj.addClass(className);
	    }	
	}

    return style;
});
