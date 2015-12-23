define([
'module',        // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',        // jquery
'store',
'malldialog',
'doCart',
'loadBanner',
'mallpublic',
'slide',
'scroll'
], function(module, $, store, dialog, doCart){
	
	function redirectToLog(){
	    window.location.href ='http://'+wwwDomain+'/zh/index.php?app=member&act=login';
	}
	function redirectToVer(){
	    window.location.href ='http://'+wwwDomain+'/zh/index.php?app=member&act=mobile_verify';
	} 
	//yi:comon function
	function openUrl(url)
	{
	    var f=document.createElement("form");
	    f.setAttribute("action" , url);
	    f.setAttribute("method" , 'get');
	    f.setAttribute("target" , '_blank');
	    window.document.body.appendChild(f);
	    f.submit();
	}
	
    $(document).ready(function(){
		
    	//初始化购物车
    	doCart.init();
    	//初始顶部banner
    	var topBannerObj = $('.top_banner');
    	if(topBannerObj.length > 0){
    		topBannerObj.loadBanner({
    			closeTime : 5000,
    			openCallBack : function(){
    				//console.log('is open');
    			},
    			closeCallBack : function(){
    				//console.log('is closed');
    			}
    		});
    	}
    	
    	$('#ask_form_content').focus(function(){
    		window.location.href="http://"+mallDomain+"/newfbuy.html";
    	})
    	$("#slides").slides({
            preloadImage: 'http://'+resDomain+'/img/loading.gif',
            play: 5000,
            pause: 2500,
            hoverPause: true
        });

        $('.guide_but').click(function(){
        	dialog.notice('请选择要删除的物品！');
        });
        $('.hot_product ul li').not('.title').hover(function(){
            $(this).addClass( 'on_hover');
        }, function(){
        	$(this).removeClass('on_hover');
        });
        $('.supply_product ul li,.requirement_product li ').not('.h_title').hover(function(){
            $(this).addClass( 'on_hover');
        }, function () {
            $(this).removeClass( 'on_hover');
        });
        $(".area_buy").scrollList();
        
        //yi:化工助手功能
        $("#search_cas_no, #search_msds").click(function(){
            
            var type   = ('search_msds' == $(this).attr("id"))? 2: 1;
            var cas_no = ( 1==type)? $("#get_cas_no").val().trim(): $("#get_msds").val().trim();
            var this_a = $(this);
            this_a.attr('href', 'javascript:;').removeAttr('target');
            if(cas_no=='' || cas_no==undefined)
            {
            	dialog.notice('请输入正确的cas号'); return false;
            }
            else
            {
                //验证cas_no
                cas_regx = /^[0-9]{2,7}(-{1,2}| {1,2}|,{1,2}|_{1,2}|\|{1,2})[0-9]{2}(-{1,2}| {1,2}|,{1,2}|_{1,2}|\|{1,2})[0-9]{1}$/;
                if(cas_regx.test(cas_no))
                {  
                    //计算mol_id
                    var ajaxurl = 'http://'+mallDomain+'/ajax_product';
                    var data = {cas_no:cas_no, type:type, action:'get_mol_id', reqtype:'ajax'};   
                    $.ajax({
                        url:  ajaxurl,
                        data: data,
                        async:false,
                        success:function(data){
                            var res = eval('('+data+')');
                            if(res != '' && res != 0 && cas_no != '')
                            {
                                var open_url = (1==type)? "http://www.molbase.com/zh/"+cas_no+"-moldata-"+res+".html": "http://www.molbase.com/zh/"+cas_no+"-moldata-"+res+".html?pt=msds#tabs";
                                //1.open窗口
                                //window.open(open_url);
                                //2.本地弹窗
                                //window.document.location.href = open_url;
                                //3.a方式
                                this_a.attr('target', '_blank').attr('href', open_url);
                            }
                            else
                            {
                                //var msg = (1==type)?'词典数据不存在':'MSDS不存在';
                                var msg = '对不起，您要查找的化合物信息，我们正在收集中';
                                dialog.notice(msg); return false;
                            }
                        } 
                    }); 
                }
                else
                {
                	dialog.notice('请输入正确的cas号'); return false;
                }
            }
        });
        
        //yi:帮我找功能
        $("#ask_form_bt").click(function(){
            var ask_con = $("#ask_form_content").val();
            var cont = store.get('index_post_content');
    		if(cont){
                //ask_con = cont;
    		}
            if(ask_con=='' || ask_con==undefined)
            {
            	dialog.error('需求内容不能为空!');
            }
            else
            {
    			store.set('index_post_content', ask_con);
            	var ajaxurl = 'http://'+mallDomain+'/ajax-gqp-zhao';//res: 1-提交成功， 0-提交失败， 小于0-登陆失败
                var data = {content:ask_con, type:0, reqtype:'ajax'};
                $.ajax({
                    url:  ajaxurl,
                    data: data,
                    success:function(res){
                        res = parseInt(res);
                        if(res == 1)
                        {
                        	dialog.success("提交成功,我们会在24小时内审核您发布的信息");
    					}
    					else if(res == -11)
    					{
                            dialog.notice("为了更好为您服务，请先认证您的手机！", redirectToVer);
                        }else if(res == -3)
    					{
                            dialog.error("您今天发送的采购/供求信息已超过5条，请明天再试");
                        }
    					else if(res == -2)
    					{
                            dialog.error("您提交的信息我们正在审核中，请不要重复提交");
                        }
                        else if(res<0)
                        {
                        	dialog.error("请真实填写您要发布的信息，以便我们能更好的为您服务");
                        }
                        else
                        {
                        	dialog.error("需求提交失败，请联系客服！");
                        }
                        return false;
                    },
                    error:function(XMLHttpRequest, ts){
                    	if(XMLHttpRequest.status==401){
                    		dialog.notice("请先登陆，再提交需求", function(){
                    			window.document.location.href = 'http://'+wwwDomain+'/zh/login.html';
                    		});
                    	}
                    }
                });          
            }
        });
        
        //求购模块
        var isBuy = 0;
        $('.click_buy').click(function(){
        	isBuy = 1;
            dialog.open({
                contentId: 'hope_form1'
            });
            var datad = $(this).children('a').attr('value');
            if(datad.length>0){
                var datad = eval("("+datad+")");
                $('.handle_box_form .number').text(datad.sale_no);
                $('#add_supp_form .number').text(datad.sale_no);
    			$('#form_d16').text(datad.less_number+' '+ datad.less_number_unit);
    			$('#form_d15').text('¥' + datad.pay_price+'/'+datad.pay_unit);
    			$('#form_d17').text(datad.valid_until);
    			$('#form_d18').text(datad.doc_cut);
    			$("#form_d18").attr("title", datad.doc);
                $('#form_d11').text(datad.company_name_cut);
                $('#form_d12').text(datad.product_name_cut+' ( '+datad.cas+' ) ');
                $("#form_d12").attr("title", datad.product_name);
                $('#form_d13').text(datad.purty);
                $('#form_d14').text(datad.number+' '+datad.unit);
                $('#form_d199').text(datad.id);
            }
        });
        $('.click_sale').click(function(){
        	isBuy = 0;
            dialog.open({
                contentId: 'hope_form0'
            });
            var datad = $(this).children('a').attr('value'); 
            if(datad.length>0){
                var datad = eval("("+datad+")");
                $('.handle_box_form .number').text(datad.buy_no);
                $('#form_d05').text(datad.utime);
    			$('#form_d06').text('¥' + datad.pay_price + '/' + datad.pay_unit);
    			$('#form_d07').text(datad.doc_cut);
    			$("#form_d07").attr("title", datad.doc);
                $('#form_d01').text(datad.company_name_cut);
                $('#form_d02').text(datad.product_name_cut+' ( '+datad.cas+' ) ');
                $("#form_d02").attr("title", datad.product_name);
                $('#form_d03').text(datad.purty);
                $('#form_d04').text(datad.number+' '+datad.unit);
                $('#form_d099').text(datad.id);
            }
        });
        $('.sub_buy').click(function(){
    		$('.sub_buy').prop('disabled',true);
            if(!isBuy){
    			var did = $('#form_d099').text();
    			var ct = $("#pdcontent0").val();
            	$.post('http://'+mallDomain+'/ajax-gqp-you', { content: ct, fid: did }, function(data){
                    if(data){
    					$('.sub_buy').prop('disabled',false);
                        data = parseInt(data);
                        if(data == 1){
                            dialog.success("您的信息已发布成功，我们的工作人员会尽快审核并跟进", closeSupplyBox);
                        }else if(data == -11){
                            dialog.notice("为了更好为您服务，请先认证您的手机！", redirectToVer);
                        }else if(data == -3){
                            dialog.notice("您今天发送的采购/供求信息已超过5条，请明天再试");
                        }else if(data == -2){
                            dialog.notice("您已回复过此条供求信息，不需要重复提交");
                        }else if(data<0){
                            dialog.notice("请真实填写您要发布的信息，以便我们能更好的为您服务");
                        }else{
                            dialog.notice("需求提交失败，请联系客服！");
                        }
                    }
                }).error(function(){
    				$('.sub_buy').prop('disabled',false);
    				dialog.notice("请先登录后提交内容!", redirectToLog);
    			});
            }else{
    			var did = $('#form_d199').text();
    			var ct = $("#pdcontent1").val();
                $.post('http://'+mallDomain+'/ajax-gqp-zhao', { content: ct, fid: did },
                function(data){
    				$('.sub_buy').prop('disabled',false);
                    if(data){
                        data = parseInt(data);
                        if(data == 1){
                            dialog.success("您的信息已发布成功，我们的工作人员会尽快审核并跟进", closeSupplyBox);
                        }else if(data == -11){
                            dialog.notice("为了更好为您服务，请先认证您的手机！", redirectToVer);
                        }else if(data == -3){
                            dialog.notice("您今天发送的采购/供求信息已超过5条，请明天再试");
                        }else if(data == -2){
                            dialog.notice("您已回复过此条供求信息，不需要重复提交");
                        }else if(data<0){
                            dialog.notice("请真实填写您要发布的信息，以便我们能更好的为您服务");
                        }else{
                            dialog.notice("需求提交失败，请联系客服！");
                        }
                    }
                }).error(function(){
    				$('.sub_buy').prop('disabled',false);
    				dialog.notice("请先登录后提交内容!", redirectToLog);
    			});
            }
        });
        
    	// document Ready END
	});
});