//直销页面
define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'doCart',
'malldialog',
'autocheck',
'mallpublic'
], function(module, $, doCart, dialog, autocheck){
	//提交表单
	$(document).ready(function(){
		//初始化购物车
    	doCart.init();
    	var checkInput = new autocheck({returnData:0});
		checkInput.init();	//初始化
		

		//我要卖货
		$('#postsalesub').click(function(){
			checkInput.checkAll( function(){
				 var company_name = $('.form input[name="company_name"]').val();
		         var contact_user = $('.form input[name="contact_user"]').val();
		         var email        = $('.form input[name="email"]').val();
		         var contact_phone = $('.form input[name="contact_phone"]').val();
		         var Content = $('.form textarea[name="Content"]').val();
		         var message_no = $('.form input[name="message_no"]').val();
		         var start_time = $('.form input[name="start_time"]').val();
		         var user_id    = $('.form input[name="user_id"]').val(); 
		         $.ajax({
		      		type : "post",
		      		url : "http://"+mallDomain+"/ajax_platmessage?do_type=2",
		      		data : {
		      			company_name : company_name,
		      			contact_user : contact_user,
		      			email        : email,
		      			contact_phone: contact_phone,
		      			Content      : Content,
		      			message_no   : message_no,
		      			start_time   : start_time,
		      			user_id      : user_id
		      		},
		      		dataType : "html",
		      	    success : function(t) {
		      	    	if(t==1){
		      	    		dialog.error("请正确填写公司名称，便于我们更好的为您服务！");
		      	    	} else if(t==2){
		      	    		dialog.error("请正确填写联系人，便于我们更好的为您服务！");
		                }else if(t==3||t==4){
		       				dialog.error("请正确填写邮箱，便于我们更好的为您服务！");
		                } else if(t==10){
	                  		$.ajax({
	                			type : "post",
	                			url : "ajax_platmessage?do_type=3",
	                			data : {
	                				message_no   : message_no
	                			},
	                			dataType : "html",
	                			success : function(t) {
	    		                	dialog.success("您的委托已提交成功，客服审核后会尽快与供应商联系");;
	                			},
	                			error  :function(){
	                				dialog.error("提交出错，回复数量未增加");
                    			}
	                		});
		                } else if(t == 11){
		                	dialog.error("请勿重复提交！");
		                }
		      	    },
		      		error  :function(){
		      			dialog.error("提交出错，数据保存失败");
	          		}
		         });
			 });
         });
		 //我要买货
		 $('#postbuysub').click(function(){
			 checkInput.checkAll( function(){
	             var company_name = $('.form input[name="company_name"]').val();
	             var contact_user = $('.form input[name="contact_user"]').val();
	             var email        = $('.form input[name="email"]').val();
	             var contact_phone = $('.form input[name="contact_phone"]').val();
	             var Content = $('.form textarea[name="Content"]').val();
	             var message_no = $('.form input[name="message_no"]').val();
	             var start_time = $('.form input[name="start_time"]').val();
	             var user_id    = $('.form input[name="user_id"]').val(); 
	
	             
	       		$.ajax({
	       			type : "post",
	       			url : "http://"+mallDomain+"/ajax_platmessage?do_type=2",
	       			data : {
	       				company_name : company_name,
	       				contact_user : contact_user,
	       				email        : email,
	       				contact_phone: contact_phone,
	       				Content      : Content,
	       				message_no   : message_no,
	       				start_time   : start_time,
	       				user_id      : user_id
	       			},
	       			dataType : "html",
	       			success : function(t) {
	       				if(t==1){
	        				 dialog.error("请正确填写公司名称，便于我们更好的为您服务！");
	                    } else if(t==2){
	                    	dialog.error("请正确填写联系人，便于我们更好的为您服务！");
	                    } else if(t==3||t==4){
	        				 dialog.error("请正确填写邮箱，便于我们更好的为您服务！");
	                    } else if(t==10){
	                  		$.ajax({
	                			type : "post",
	                			url : "ajax_platmessage?do_type=3",
	                			data : {
	                				message_no   : message_no
	                			},
	                			dataType : "html",
	                			success : function(t) {
	    	                    	dialog.success("您的报价提交成功，客服审核完成后会尽快与采购商联系");
	                			},
	                			error  :function(){
	                				dialog.error("提交出错，回复数量未增加");
                    			}
	                		});
	                    } else if(t == 11){
	                    	dialog.error("请勿重复提交！");
		                }
	       			},
	       			error  :function(){
	  				    dialog.error("提交出错，数据保存失败");
	       			}
	       		});
			 });
       });
	   
	   //立即发布需求（卖货）
		$('#fplat_sale').click(function(){
			checkInput.checkAll( function(){
			   var user_id = $('input[name="user_id"]').val();
			   var product_name = $('input[name="product_name"]').val();
			   var Purity = $('input[name="Purity"]').val();
			   //var min_order = $('input[name="min_order"]').val();
			   var min_order_num = $('input[name="min_order_num"]').val();
			   var min_order_unit = $('select[name="min_order_unit"]').val();
			   if(min_order_unit == ""||typeof(min_order_unit) == 'undefined'){
				   min_order_unit = "kg";
			   }
	           if(!min_order_num.isNumber()){
			    	dialog.error("采购数量需填数字！");
			    	return;
	           }
	           if(min_order_num<0){
			    	dialog.error("采购数量需要大于0！");
			    	return;
	           }
			   var min_order = min_order_num+" "+min_order_unit;
			   var Price =  $('input[name="price"]').val();
			   var company_name = $('input[name="company_name"]').val();
			   var Email = $('input[name="email"]').val();
			   var contact_phone = $('input[name="contact_phone"]').val();
			   var Remark = $('textarea[name="Remark"]').val();
			   var region_id = $('input[name="region_id"]').val();
			   var contact_user = $('input[name="contact_user"]').val();
			   //判断商家信息是否显示
			   var show_info = 0;
			   if($('input[name="show_info"]').prop('checked')){
				   show_info = 1;
			   }
			   var message_no = $('input[name="message_no"]').val();
			   var add_time = $('input[name="add_time"]').val();
			   var last_update = $('input[name="last_update"]').val();
			   var stock = $('input[name="stock"]').val();
			   if(stock.isNumber()&&Price.isNumber()){
				   stock = stock+" "+min_order_unit;
				   Price = Price+"/"+min_order_unit;
			   }
			   console.log( {
					contact_user:contact_user,
					user_id      : user_id,
					product_name :product_name,
					Purity       :Purity,
					min_order    :min_order,
					Price        :Price,
					company_name :company_name,
					Email        :Email,
					contact_phone:contact_phone,
					Remark       :Remark,
					region_id    :region_id,
					show_info    :show_info,
					message_no   :message_no,
					add_time     :add_time,
					last_update  :last_update,
					stock        :stock
					
				});  
			   $.ajax({
					type : "post",
					url : "http://"+mallDomain+"/ajax_platmessage?do_type=0",
					data : {
						contact_user:contact_user,
						user_id      : user_id,
						product_name :product_name,
						Purity       :Purity,
						min_order    :min_order,
						Price        :Price,
						company_name :company_name,
						Email        :Email,
						contact_phone:contact_phone,
						Remark       :Remark,
						region_id    :region_id,
						show_info    :show_info,
						message_no   :message_no,
						add_time     :add_time,
						last_update  :last_update,
						stock        :stock
					},
					
					dataType : "html",
					success : function(t) {
					    if(t==1){
					    	dialog.error("请正确填写公司名称，便于我们更好的为您服务！");
					     } else if(t==2){
					    	 dialog.error("请正确填写联系人，便于我们更好的为您服务！");
					     } else if(t==3||t==4){
							 dialog.error("请正确填写邮箱，便于我们更好的为您服务！");
					     } else if(t==5){
					    	 dialog.error("请正确填写产品名称，便于我们更好的为您服务！");
					     } else if(t==6){
							 dialog.error("请正确填写纯度，便于我们更好的为您服务！");
					     } else if(t==7){
					    	 dialog.error("请正确填写最小起订量，便于我们更好的为您服务！");
					     } else if(t==10){
					      	 window.location.href = "gqsuccess.html?message_no="+message_no+"&type=0";
					     } else if(t == 11){
	                    	dialog.error("请勿重复提交！");
					     }
					},
					error  :function(){
					    dialog.error("提交出错，数据保存失败");
					}
				})
		           
			});
		});
	   //立即发布需求（购买）
       $('#fplat_buy').click(function(){
    	   checkInput.checkAll( function(){
	           var user_id = $('input[name="user_id"]').val();
	           var product_name = $('input[name="product_name"]').val();
	           var Purity = $('input[name="Purity"]').val();
	           var Amount = $('input[name="weight"]').val()+' '+$('select[name="unit"]').val();
	           var Price =  $('input[name="Price"]').val();
	           var company_name = $('input[name="company_name"]').val();
	           var Email = $('input[name="email"]').val();
	           var contact_phone = $('input[name="contact_phone"]').val();
	           var Remark = $('textarea[name="Remark"]').val();
	           var region_id = $('input[name="region_id"]').val();
	           var contact_user = $('input[name="contact_user"]').val();
	           var message_no = $('input[name="message_no"]').val();
	           //判断商家信息是否显示
	           var show_info = 0;
	           if($('input[name="show_info"]').prop('checked')){
	        	   show_info = 1;
	               }
	           var message_no = $('input[name="message_no"]').val();
	           var last_update = $('input[name="last_update"]').val();
		       var valid = $('select[name="valid_time"]').val();

	           $.ajax({
	      			type : "post",
	      			url : "http://"+mallDomain+"/ajax_platmessage?do_type=1",
	      			data : {
	      				contact_user:contact_user,
	      				user_id      : user_id,
	      				product_name :product_name,
	      				Purity       :Purity,
	      				Amount       :Amount,
	      				Price        :Price,
	      				company_name :company_name,
	      				Email        :Email,
	      				contact_phone:contact_phone,
	      				Remark       :Remark,
	      				region_id    :region_id,
	      				show_info    :show_info,
	      				message_no   :message_no,
	      				last_update  :last_update,
	      				valid_time   :valid
	      			},
	      			dataType : "html",
	      			success : function(t) {
	                   if(t==1){
	       				 dialog.error("请正确填写公司名称，便于我们更好的为您服务！");
	                   } else if(t==2){
	                  	 dialog.error("请正确填写联系人，便于我们更好的为您服务！");
	                   } else if(t==3||t==4){
	       				 dialog.error("请正确填写邮箱，便于我们更好的为您服务！");
	                   } else if(t==5){
	                  	 dialog.error("请正确填写产品名称，便于我们更好的为您服务！");
	                   } else if(t==6){
	       				 dialog.error("请正确填写纯度，便于我们更好的为您服务！");
	                   } else if(t==7){
	                  	 dialog.error("请正确填写采购数量，便于我们更好的为您服务！");
	                   } else if(t==10){
	                	   window.location.href = "gqsuccess.html?message_no="+message_no+"&type=1";
	                   } else if(t == 11){
	                    	dialog.error("请勿重复提交！");
	                   }
	      			},
	      			error  :function(){
	   				    dialog.error("提交出错，数据保存失败");
	      			}
	      		});
    	   });
        });
	});
   
});