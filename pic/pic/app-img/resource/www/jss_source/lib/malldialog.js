/*
 * 商城弹出框模块
 */
define(['jquery'], function($){
    //var leng=window['DB'].leng;
	var mallDialog = function(setOption) {
	    var _this = this;
	    _this.defaultOption = {
	        layer: '.black_overlay',
	        boxForm: '.handle_box_form',
	        dataForm : '.handle_box',
	        onlyOneForm:'#login_form',      //只加载一次的模板。如登录模板，ID名称，多个用逗号分开
	        url: '',
	        title:'',						//弹出框标题
	        contentId: ''                   //模板内容ID,必有
	    };

	    _this.option = null;
	    _this.isCreateDialog = 0;
	    _this.isCreateAlert = 0;            //是否加载过弹出框
	    _this.formNum = 0;                  //记录弹出层数量
	    
	    _this.config = function(setOption){
	        _this.option = mergeArray(_this.defaultOption, setOption);
	    }
	    
	    if (typeof setOption != 'undefined') {
	        _this.config(setOption);
	    } else {
	        _this.option =  _this.defaultOption;
	    }
	    
	    _this.alertForm = '<div class="handle_box alert_box" >'
	        +'<h1><span id="alert_title"></span><a href="javascript:;" class="close_box" alert_close="1"></a></h1>'
	        +'<div class="alert_content">'
	        +'    <div class="alert_icon"></div>'
	        +'    <div class="alert_message">'
	        +'        <p id="alert_message"></p>'
	        +'   </div>'
	        +'</div>'
	        +'<div class="box_footer">'
	        +'   <button class="ok" id="alert_ok">确定</button>'
	        +'</div></div>';
	    
	    _this.createDialog = function(){
	        var layerType = 'class';
	        var layerName = '';
	        var boxType = 'class';
	        var boxName = '';
	        if( _this.option.layer.indexOf('#') === 0){   //是ID
	            layerType = 'id';
	            layerName = _this.option.layer.replace('#', '');
	        } else if( _this.option.layer.indexOf('.') === 0){
	            layerName =  _this.option.layer.replace('.', '');
	        } else {
	            return false;
	        }
	        if( _this.option.boxForm.indexOf('#') === 0){   //是ID
	            boxType = 'id';
	            boxName =  _this.option.boxForm.replace('#', '');
	        } else if( _this.option.boxForm.indexOf('.') === 0){
	            boxName =  _this.option.boxForm.replace('.', '');
	        } else {
	            return false;
	        }
	        $('body').append('<div '+layerType+'="'+layerName+'"> </div>');
	        $('body').append('<div '+boxType+'="'+boxName+'"> </div>');
	        //关闭弹出框
	        $(document).on('click', '.close_box',function(){
	            if($(this).attr('alert_close') == 1){   //关闭提示框
	                _this.closeAlert();
	            } else {
	                _this.closeBox();
	            }
	        });
	        $(_this.option.layer).on('dblclick', function(){
	            _this.closeBox();
	        });
	        _this.isCreateDialog = 1;
	    };
	    
	    //加载弹出框
	    _this.createAlert = function(){
	         if(!_this.isCreateAlert){
	             if(!_this.isCreateDialog){
	                 _this.createDialog(); 
	             }
	             $(this.option.boxForm).append(_this.alertForm);
	             _this.isCreateAlert = 1;
	         }
	         var alertObj = $('.alert_box');
	         if( _this.formNum == 0){
	             _this.openLayer();
	             alertObj.siblings().css('display', 'none');
	         }
	         alertObj.css('display', 'block');
	         var positionTop = alertObj.position().top;
	         if(positionTop > 50){
	             var alertTop = parseInt(alertObj.position().top) * -1;
	             
	             alertObj.css('top', alertTop);
	         }
	         _this.formNum++;
	    }
	    
	    _this.loadAjaxContent = function(callBack) {
	        var isReload = 1;
	        if(_this.isCreateDialog){
	            var dataObj = $(_this.option.dataForm);
	            if(dataObj.length > 0){
	                dataObj.css('display', 'none');
	            }
	            if(_this.option.contentId != ''){   
	                if(_this.option.onlyOneForm.indexOf(_this.option.contentId) !== -1 && contentObj.length > 0){
	                    isReload = 0;
	                    contentObj.css('display', 'block');
	                }
	            }
	            var boxContent = '';
	            if(isReload){
	            	boxContent = '<div class="handle_box" id="'+_this.option.contentId+'">'
	        	    	+'<h1><span>'+_this.option.title+'</span><a href="javascript:;" class="close_box"></a></h1><div id="dialog_load">'
	        	    	+'<div class="load_notice">加载中...</div></div></div>';
	            }
	            var alertObj = $('.alert_box');
	            if(alertObj.length > 0){
	                alertObj.before(boxContent);
	            } else {
	                $(_this.option.boxForm).append(boxContent);
	            }
	            var contentObj = $('#'+_this.option.contentId);
	            contentObj.css('display', 'block');
	            
	            if(isReload){
	                $.ajax({
	                    type: 'get',
	                    url: _this.option.url,
	                    data: {},
	                    dataType: 'html',
	                    success: function (content) {
	                    	$('#dialog_load').remove();
	                    	$('#'+_this.option.contentId+' h1').after(content);
	                    	if(typeof callBack == 'function'){
	                    		callBack();
	                    	}
	                    }
	                });
	            }
	           
	        } else {
	            return false;
	        }
	       
	    };
	    _this.loadContent = function (callBack) {
	        var contentObj = $('#'+_this.option.contentId);
	        if(contentObj.length > 0){
	            var contentObj = $('#'+_this.option.contentId);
	            var alertObj = $('.alert_box');
	            if(alertObj.length > 0){
	                alertObj.before(contentObj);
	            } else {
	                $(_this.option.boxForm).append(contentObj);
	            }
	            
	            contentObj.css('display', 'block');
	            contentObj.siblings().css('display', 'none');
	            if(typeof callBack == 'function'){
            		callBack();
            	}
	        } else {
	            return false;
	        }
	    };
	    
	    _this.closeAlert = function(){
	        $('.alert_box').css('display', 'none');
	        if(_this.formNum == 1){     //没有其他内容弹出框
	             $(_this.option.layer).css('display', 'none');
	             $(_this.option.boxForm).css('display', 'none');
	        }
			if(_this.formNum > 0){
				_this.formNum--;
			}
	    }
	    _this.closeBox = function () {

	        if(_this.option.url != '' && _this.option.onlyOneForm.indexOf(_this.option.contentId) === -1){ //加载多次的模板
	            $('#'+_this.option.contentId).remove();    //删除
	        }
	        $(_this.option.layer).fadeOut(function(){
	            $(this).css('display', 'none');
	        })
	        
	        $(_this.option.boxForm).css('display', 'none');
	        if(_this.formNum > 0){
				_this.formNum--;
			}
	    };
	    
	    //打开弹出背景层
	    _this.openLayer = function(){
	        var boxObj = $(_this.option.boxForm);
	        var layerObj = $(_this.option.layer);
	        var position = layerObj.css('position');
	        if (position == 'absolute') {
	            var sTop = $(window).scrollTop();
	            layerObj.css('top', sTop);
	            boxObj.css('top', parseFloat(sTop) + 50);
	        }
	        layerObj.css('display', 'block');
	        boxObj.css('display', 'block');
	    }
	    _this.open = function (setOption, callBack) {
	    	if(typeof setOption.contentId == 'undefined' && setOption.contentId == ''){		
		    	return false;
		    }
	        _this.config(setOption);
	        if( ! _this.isCreateDialog){
	            _this.createDialog();    //创建弹出框架
	        }
	        _this.openLayer();           //打开弹出层
	        if(_this.option.url != ''){
	            _this.loadAjaxContent(callBack);                //加载ajax内容
	        } else if(_this.option.contentId != ''){    //加载本页内容
	            this.loadContent(callBack);
	        } else {
	            return false;
	        }

	        _this.formNum++;
	        
	    };
	    _this.resetEvent = function(eventName, butId, callBack){
	        $('#'+butId).unbind(eventName); 
	        $('#'+butId).bind(eventName, function(){
	            _this.closeAlert();
	            if(typeof callBack == 'function'){
	                callBack();
	            }
	        });
	    }
	    _this.error = function(message, callBack){
	        
	        _this.createAlert();
	        $('#alert_title').html('错误提示');
	        _this.resetAlertIn(message, 'error');
	        _this.resetEvent('click', 'alert_ok', callBack);
	    }
	     
	    _this.success = function(message, callBack){
	        _this.createAlert();
	        $('#alert_title').html('确认');
	        _this.resetAlertIn(message, 'success');
	        _this.resetEvent('click', 'alert_ok', callBack);
	    }
	    
	    _this.notice = function(message, callBack){
	        _this.createAlert();
	        $('#alert_title').html('信息提示');
	        _this.resetAlertIn(message, 'notice');
	        _this.resetEvent('click', 'alert_ok', callBack);
	    }
	    
	    _this.resetAlertIn = function(message, type){
	        $('#alert_message').html(message);
	        var iconObj = $('.alert_icon');
	        iconObj.removeClass();
	        iconObj.addClass('alert_icon '+type);
	    }
	};
	
    return new mallDialog();
});
