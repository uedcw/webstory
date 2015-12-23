define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'member',
'placeholder'
], function(module, $,message,moment){
    $(document).ready(function(){
        /*console.log(2);*/
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

        })

        //删除选项
       $("#del").click(function(){
           $(".title_main").remove();
              });

        
    });
});

