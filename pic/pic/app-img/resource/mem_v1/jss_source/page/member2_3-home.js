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
            $(this).find("b").removeClass("bold");
            $(this).find(".cont-bok").hide();
        }
            $(this).siblings(".selct").toggle();
        });

       	// 中间table切换
		    $(".ul li").click(function(){
          $(this).addClass('selected').siblings().removeClass('selected')
					$(this).addClass('curret').siblings().removeClass('curret');
					$(".meas_ul li").eq($(this).index()).show().siblings().hide();
				});
      
      //
      $(".min_ain").mouseover(function(){
          $(".min-span").show();
      });
      $(".min_ain").mouseout(function(){
          $(".min-span").hide();
      })
      //删除类
     $("#del a").click(function(){
          $("#dld").remove()
     })

 

    });

    selectbox(document.getElementById('demo-basic'));
});