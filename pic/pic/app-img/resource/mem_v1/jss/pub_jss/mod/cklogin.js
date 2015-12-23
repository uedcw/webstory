define(['jquery',
'placeholder'       //全局引用placeholder处理
], function($){
/*
	AJAX检查用户登录
*/
    var leng=window['DB'].leng,
        utxt=(leng=='en' ? 'Visitor' : '游客');

    /**
     * 会员中心发送验证邮件--点击再次发送验证邮件
     */
//    function send_mail_retry()
//    {
//        $("#yi_send_mail_retry").attr('onclick', '').css('color','#ddd').css('cursor','default');
//        var data = {reqtype:'ajax'};
//        $.post('/?app=member&act=ajax_send_mail', data, function(res){
//            //ret = eval('('+res+ ')');
//            if(ret.res == true)
//            {
//               // $.alert('<div style="width:450px;text-align:center;">'+ret.msg+'</div>');
//               //  先用系统的.之后统一修改
//                alert(ret.msg);
//            }
//            else
//            {
//                //email send fail
//            }
//            $("#yi_send_mail_retry").attr('onclick', 'send_mail_retry()').css('color','#08c').css('cursor','pointer');
//        },'json');
//    }

    $(document).ready(function(){
        window['DB']['READY']=true;

        // 绑定搜索按钮和搜索自己店铺按钮
        $('#form1-top-search-buts-post, #form1-top-search-buts-self').on('click',function(){
            if(this.id=='form1-top-search-buts-post')
            {
                $('#form1-top-search').attr('action',$('#action-search-all').val());
                $('#form1-top-search-sid').prop('disabled',true);
            }
            else
            {
                $('#form1-top-search').attr('action',$('#action-search-supplier').val());
                $('#form1-top-search-sid').prop('disabled',false);
            }
            $('#form1-top-search').submit();
        });

        var t=$.now();
        $.post('/?app=default&act=cart_value&v='+t,{'t':t},function(rs){
            if(rs.done)
            {
                login_user_email=rs.retval.e;
                login_company_name=rs.retval.p;
                login_link_man=rs.retval.lm;
                login_link_tel=rs.retval.lt;
                if(rs.retval.l){
                    $('#Current_User').text(rs.retval.n);
                    $('#toipbars_login, #toipbars_login_j, #toipbars_reg, #toipbars_reg_j').hide();
                    $('#toipbars_exit, #toipbars_exit_j, #mem_cent').show();
                    if(undefined != rs.retval.v && '0' == rs.retval.v){
                        $('#h_email_a').show();
                    }else{
                        $('#h_email_a').hide();
                    }
                    $('#mem_cent').on('mouseenter',function(){  /* 绑定 topbar 用户中心 鼠标事件 */
                        var w=$('#mem_cent').width();
                        $('#float_list').width(w+43).show();
                    }).on('mouseleave',function(){
                        $('#float_list').hide();
                    });
                }
                else
                {
                    $('#Current_User').text(utxt);
                    $('#h_email_a').hide();
                }
            }
        },'json');
    });

//    // 询单发邮件
//	$("#yi_goon_inquiry").on('click', function(){
//		var inquiry_id = $(this).attr("_tab");
//		var data = {inquiry_id: inquiry_id, retval:'json', reqtype:'ajax'};
//		$.post('/?app=inquiry&act=check_user_email', data, function(res){
//		//ret = eval('('+res+ ')');
//		if(ret.res == true)
//		{
////			$.alert('<div style="width:450px;text-align:center;">'+ret.msg+'</div>', '', function(){
////				window.location = window.location;
////			});
//            //  先用系统的.之后统一修改
//            alert(ret.msg);
//            window.location = window.location;
//		}
//		else
//		{
//			//todo fail
//			alert(ret.msg);
//		}
//		//$("#yi_send_mail_retry").attr('onclick', 'send_mail_retry()').css('color','#08c').css('cursor','pointer');
//	},'json');
//	});

});