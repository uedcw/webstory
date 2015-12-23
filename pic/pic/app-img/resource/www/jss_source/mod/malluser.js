/*
 * 商城用户模块
 */
define(['jquery', 'malldialog'], function($, dialog){
    //var leng=window['DB'].leng;

	//molbase user
	var malluser = {
		//获取用户服务器端信息 登陆 未登录
		getUserIn : function(callBack){
	        $.ajax({
	            type: 'post',
	            url: 'http://'+mallDomain+'/ajax_user',
	            data: {},
	            dataType: 'json',
	            success: function (data) {
	                callBack(data);
	            }
	        });
	    },
	    //检查用户状态
	    checkLogin : function(callBack){
	        $.ajax({
	            type: 'post',
	            url: 'http://'+mallDomain+'/ajax_user',
	            data: {},
	            dataType: 'json',
	            success: function (data) {
	                if(typeof data['user_id'] != 'undefined' && data['user_id'] != 0){
	                  if(data.buy_verify != 1){
	                     dialog.notice("手机认证用户开放此功能，立即认证!<br />客服热线：4007-281-666 或者<br />Email：service@molbase.com", function(){
	                        window.location.href ='http://'+wwwDomain+'/zh/index.php?app=member&act=mobile_verify';
	                     });
	                  } else {
	                      if(typeof callBack == 'function'){
	                          callBack();
	                      }
	                  }
	                } else {
	                    dialog.notice("请先登录您的帐号!", function(){
	                        window.location.href ='http://'+wwwDomain+'/zh/index.php?app=member&act=login';
	                    });
	                }
	            },
	            error:function(XMLHttpRequest, ts){
	                if(XMLHttpRequest.status == 401){
	                    dialog.notice("请先登录您的帐号!", function(){
	                        window.document.location.href = 'http://'+wwwDomain+'/zh/login.html';
	                    });
	                }
	            }
	        });
	    }
	}

    return malluser;
});
