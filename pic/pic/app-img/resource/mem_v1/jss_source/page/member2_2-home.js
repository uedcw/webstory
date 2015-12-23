define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'selectbox',
'member',
'placeholder'
], function(module, $,message,selectbox){
    $(document).ready(function(){
     //询盘报价
       console.log(2);
       $(".title-mon").click(function(e) {
        var c_id=$(this).data("id");
        $.ajax({
        url: '/zh/index.php?app=member_message&act=readmessage',
                type: 'get',
                data:{"id":c_id},
        success:function(msg){
                    //console.log(msg);
        }
      });
        var read=$(this).find("b").data("read");
        if(!read){
            //$(this).find("b").attr("data-read",'1');
            $(this).find("b").removeClass("bold");
            $(this).find(".cont-bok").hide();
        }
            $(this).siblings(".selct").toggle();
        });

     	// 中间table切换
		 $(".ul li").click(function(){
          $(this).addClass('selected').siblings().removeClass('selected');
					$(this).addClass('caes').siblings().removeClass('caes');
					$(".meas_ul li").eq($(this).index()).show().siblings().hide();
				});

      //询盘供应商 
     $(".tit_rt").click(function(){
           $(".tb0").toggle();     
        });

    });
 


    //删除类
     $("#del a").click(function(){
          $("#dld").remove()
     })


      selectbox(document.getElementById('demo-basic'));
});

