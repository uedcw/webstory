define([
	'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
	'jquery',       // jquery
	'message_new',
	'selectbox',
	'oninputchange',
	'pubjs',
	'top10'
], function(module, $,message, selectbox){
	//滚动
	var MarqueeDiv3Control=new Marquee(
		{
			MSClass	  : ["grade","list"],
			Direction : 2,
			Step	  : 0.3,
			Width	  : 264,//一行排几个li，就用ScrollStep: 88*3的宽度
			Height	  : 108,
			Timer	  : 20,
			DelayTime : 3000,
			WaitTime  : 100000,
			ScrollStep: 88,//每个li的宽度加上border的宽度，再加上li之间的间距80+2+6
			SwitchType: 0,
			AutoStart : true
		});
	$(".pre").click(function(){
		MarqueeDiv3Control.Run(3);
	})
	$(".next").click(function(){
		MarqueeDiv3Control.Run(2);
	})
	/*$("dl dt .detail .tit .title").mouseover(function(){
		$(this).parent().siblings(".info_pop").show();
	});*/

    /*$(".detail .tit .title a h3").hover(function() {
            $(this).parent().parent().parent().siblings(".info_pop").show();
        },function(){
           $(this).parent().parent().parent().siblings(".info_pop").hide();        
   });*/

   /* $(".detail .tit .title a h3").hover(function() {
            $(this).parent().parent().parent().siblings(".info_pop").show();
        },function(){
           $(this).parent().parent().parent().siblings(".info_pop").hide();
   });*/


	$(document).ready(function(){


		$('#apply_vip').on('click', function(){
			var _obj = $(this);
			$.ajax({
				type:"get",
				url:"/moldata/ajax_get_member_status",
				datatype:"json",
				data:{},
				success:function(data){
					if(!data.isLogin)//未登录
					{
						window.location=data.url.login_url;
					}
					else
					{
						dataTplRoute(data, _obj);
					}
				},
				error:function(e){
					console.log("ajax交互时存在异常:"+e);
				}
			});
		});


		//         window['DB']['READY']=true;
		//    	//立刻申请VIP供应商
		//    	var tpl=null;
		//        var local_href = location.href;
		//    	$("#apply_vip").on('click',function(){
		//            var eo=$(this);
		//                tpl=eo.data('tpl');
		//            var d_user_id=eo.data("userid").trim();
		//            var d_name=eo.data("name").trim();
		//            var d_company=eo.data("company").trim();
		//            var d_grade=eo.data("grade").trim();
		//            var d_phone=eo.data("phone").trim();
		//            console.log(d_user_id);
		//            if(d_user_id>0){
		//                 message.win(tpl, function(){    //open前
		//                        $doms=$('#'+tpl);
		//                        $('#success_'+tpl).hide();
		//                        $('#'+tpl+'_form').show();
		//                        if(!$doms.data('bind')){//绑定事件
		//                            $doms.data('bind',1);
		//                            //                    page_sets
		//                            $('#'+tpl+'_contacts,#'+tpl+'_phone,#'+tpl+'_company_name').keyup(function(){
		//                                $('#tips_'+tpl).hide().text('');
		//                                $(this).removeClass('error').focus();
		//                            });
		//                            //通过按钮传进来的值初始化弹框form信息
		//                            $('#'+tpl+'_contacts').val(d_name);
		//                            $('#'+tpl+'_phone').val(d_phone);
		//                            $('#'+tpl+'_company_name').val(d_company);

		//                            $('#close_'+tpl+', #close1_'+tpl).on('click',function(){
		//                                dialog.get(tpl+'_win').remove();
		//                               // _this.remove();     //绑定关闭窗口时要用remove();
		//                            });
		//                            //$('#'+tpl+'_form').submit(function(){
		//                            $('#next').on('click',function(){
		//                                var o_contacts=$('#'+tpl+'_contacts');
		//                                var o_phone=$('#'+tpl+'_phone');
		//                                var o_company=$('#'+tpl+'_company_name');
		//                                var o_tips=$('#tips_'+tpl);

		//                                var v_contacts    =$.trim(o_contacts.val());
		//                                var v_phone       =$.trim(o_phone.val());
		//                                var v_company     =$.trim(o_company.val());

		//                                if(v_contacts===''){
		//                                    o_tips.text('联系人不能空').show();
		//                                    o_contacts.addClass('error').focus();
		//                                    return false;
		//                                }
		//                                if(/\d+/.test(v_contacts)){
		//                                    o_tips.text('联系人不能有数字').show();
		//                                    o_contacts.addClass('error').focus();
		//                                    return false;
		//                                }

		//                                if(v_phone===''){
		//                                    o_tips.text('联系电话不能空').show();
		//                                    o_phone.addClass('error').focus();
		//                                    return false;
		//                                }else{
		//                                    if(!/[A-Za-z]+/.test(v_phone)){
		//                                        if(!/[\d\*\(\)\+\-\#]/.test(v_phone)){
		//                                         o_tips.text('电话号码必须为数字，符号仅支持“+”“*”“-”“（”“）”').show();
		//                                         o_phone.addClass('error').focus();
		//                                         return false;
		//                                        }
		//                                    }else{
		//                                         o_tips.text('电话号码必须为数字，符号仅支持“+”“*”“-”“（”“）”').show();
		//                                         o_phone.addClass('error').focus();
		//                                         return false;
		//                                    }
		//                                }

		//                                if(v_company===''){
		//                                    o_tips.text('公司名称不能空').show();
		//                                    o_company.addClass('error').focus();
		//                                    return false;
		//                                }
		//                               if(/\d+/.test(v_company)){
		//                                    o_tips.text('公司名称不能有数字').show();
		//                                    o_company.addClass('error').focus();
		//                                    return false;
		//                                }

		//                                var db={
		//                                    'link_man':v_contacts,
		//                                    'phone':v_phone,
		//                                    'company_name':$.trim(o_company.val())
		//                                };
		//                                $.post('/index.php?app=suppliers&act=VipSupplierSave',db,function(rs){
		//                                //$.ajaxFormPost('/index.php?app=suppliers&act=VipSupplierSave', db, function(rs){
		//                                    if(rs.done){
		//                                         $('#'+tpl+'_contacts').removeClass('error').val('');
		//                                         $('#'+tpl+'_phone').removeClass('error').val('');
		//                                         $('#'+tpl+'_company_name').removeClass('error').val('');
		//                                         $('#tips_'+tpl).text('').hide();
		//                                         $('#'+tpl+'_form,#fail_'+tpl).hide();
		//                                         $('#success_'+tpl).show();
		//                                    }
		//                                },document.domain);
		//                                return false;
		//                            });
		//                        }
		//                       //_this.title(' ');
		//                },function(){   //close时
		//                   $('#'+tpl+'_contacts').removeClass('error').val('page_sets.link_man');
		//                     $('#'+tpl+'_phone').removeClass('error').val('page_sets.link_tel');
		//                     $('#'+tpl+'_company_name').removeClass('error').val('page_sets.company_name');
		//                     $('#tips_'+tpl).text('').hide();
		//                });
		//            }
		//            else{
		//               location.href = local_href+"/zh/login.html";
		//            }

		// });
		//下拉
		selectbox(document.getElementById('country'));
		selectbox(document.getElementById('city'));
	});

	function dataTplRoute(data, obj) {
		var tpl = obj.data('tpl');
         /*
        data.url
        login_url = http://dev3.zh.molbase.dev/zh/login.html
        service_url = http://cs.ecqun.com/cs/?id=660133&cid=659827&scheme=0&handle=&url=http%3A%2F%2Fwww.molbase.com%2Fzh%2Findex.html&version=4.0.0.0
        certify_url = http://dev3.zh.molbase.dev/member-profile.html?type=approve
        */

		message.win(tpl, function () {    //open前
            var win=this;
            var ohs=$('#'+tpl);

			win.title('提示');
            // 绑定事件
            if(!ohs.data('bind')){
                ohs.data('bind',1);

                if (data.userType == 'seller' && data.gradeType == 'noChecked') {
                    $('#tips0_moldata_detail_supply_win').css('display', 'block');
                }
                else if (data.userType == 'seller' && data.gradeType == 'inCheck') {
                    $('#tips1_moldata_detail_supply_win').css('display', 'block');
                }
                else if (data.userType == 'seller' && data.gradeType == 'isChecked') {
                    $('#success_moldata_detail_supply_win').css('display', 'block');
                }
                else if (data.userType == 'seller' && data.gradeType == 'isVIP') {
                    $('#viptip_moldata_detail_supply_win').css('display', 'block');
                }
                else if (data.userType == 'buyer' && data.gradeType == 'noChecked') {
                    $('#tips0_moldata_detail_supply_win').css('display', 'block');
                }
                else if (data.userType == 'buyer' && data.gradeType == 'inCheck') {
                    $('#tips1_moldata_detail_supply_win').css('display', 'block');
                }
                else if (data.userType == 'buyer' && data.gradeType == 'isChecked') {
                    $('#success_moldata_detail_supply_win').css('display', 'block');
                }

                $('#close_moldata_detail_supply_win_success').click(function(){
                    $('#supplier_apply_vip_form').submit();
                });
                $('#close_moldata_detail_supply_win_tips0').click(function(){
                    window.location.href=data.url.certify_url;
                });
                $('#close_moldata_detail_supply_win_tips1').click(function(){
                    window.location.href=data.url.service_url;
                });
            }
		});
	}

});