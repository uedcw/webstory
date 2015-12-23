;(function (factory) {
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
    jQuery.extend({
        ajaxFormNums:0,
        ajaxFormPost:function(sURL, datas, callBack, domain){/*[sURL=提交地址, datas=要提交的数据对像, callBack=回调,domain=域]*/
            domain=domain||'molbase.com';
            var on='TEMP_POST_'+$.ajaxFormNums;
            var dv=$('<div style=""></div>').attr('id', on+'_DIV').css({'position':'absolute', 'z-index':10, 'top':'-200000px'});
            var df=$('<form id="'+on+'_FORM" name="'+on+'_FORM" method="post" action="'+sURL+'" target="'+on+'_IFRAME"></form>');
            try{
                window['ajaxFormPostSubmit'][$.ajaxFormNums]=df[0];
            }catch(e){
                window['ajaxFormPostSubmit']=[];
                window['ajaxFormPostSubmit'][$.ajaxFormNums]=df[0];
            }
            var fs='javascript:void(function(){document.open();document.domain=\''+domain+'\';document.write(\'<!DOCTYPE html><html><head><script>parent.ajaxFormPostSubmit['+$.ajaxFormNums+'].submit();</script></head><body></body></html>\');document.close();}())';
            dv.html('<iframe id="'+on+'_IFRAME" name="'+on+'_IFRAME" height="1" width="1" src="'+fs+'" frameborder="0" border="0" scrolling="no"></iframe>');
            $.each(datas,function(i,n){
                df.append($('<textarea></textarea>').attr('name',i).css({width:'1px',height:'1px'}).val(n));
            });
            df.append('<input type="submit" value="Submit" name="b1" style="width:1px;height:1px;" />');
            dv.append(df);
            $(document.body).append(dv);
            $('#'+on+'_IFRAME').bind('load',function(){
                if($.isFunction(callBack)){
                    try{
                        var rs=JSON.parse(window.name);
                    }catch(e){
                        var rs=window.name;
                    }
                    callBack(rs);
                }else{
                    alert('ajaxFormPost callBack no find');
                }
                window.setTimeout(function(){$('#'+on+'_DIV').remove();window.name='';},1);
            });
            $.ajaxFormNums++;
        }
    });
}));

/*
function pub_ajaxform_return($result)
{
	return "<script>document.domain='molbase.com';parent.name='$result';</script>";
}

        // POST数据
        var dbss={
            user_name:'alen',
            password:'1234561',
            captcha:'8888',
            reqtype:'ajaxpost'
        };

        $.ajaxFormPost('http://dev2.molbase.com/index.php?app=member&act=login',dbss,function(rs){
            alert(rs)
        });

//配置

'ajaxformpost':     'lib/jquery.ajaxformpost',  // ajaxFormPost提交插件

        'ajaxformpost':{
            deps: ['jquery'],
            exports: 'jQuery.fn.ajaxFormPost'
        },

*/