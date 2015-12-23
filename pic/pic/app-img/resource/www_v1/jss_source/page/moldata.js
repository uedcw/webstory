define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'searchauto',   // 文本搜索自动完成
'pubjs',
'top10'
], function(module, $, searchauto){

    $(document).ready(function(){
        // 初始化搜索框自动完成
        searchauto.init();

    	// // $(".hot_top .staus a").mouseover(function(){
    	// // 	var v_id=$(this).data("id");
    	// // 	$("#p"+v_id).show().siblings(".product").hide();
    	// // 	$(this).addClass("cur");
    	// // 	$(this).siblings().removeClass("cur");
    	// // })
     //    //var tab_t,li,tab_c,div,onmouseover;
     //    tab("tab_t","li","tab_c","div","onmouseover")
     //     function tab(tab_t,tab_t_tag,tab_c,tag_c_tag,evt){
     //      var tab_t = $(".staus");
     //      var tab_t_li = $(".staus a");
     //      var tab_c = $("#product_con");
     //      var tab_c_li = $("#product_con .product");
     //      var len = tab_t_li.length;
     //      var i=0;
     //      var timer = null;
     //      var num=0;
     //       for(i=0; i<len; i++){
     //        tab_t_li[i].index = i;
     //        tab_t_li[i][evt] = function(){
     //         clearInterval(timer);
     //         num = this.index;
     //         tab_change()
     //        }
     //        tab_t_li[i].onmouseout = function(){
     //         autoplay();
     //        }
     //       }
     //      function tab_change(){
     //       for(i=0; i<len; i++){
     //        tab_t_li[i].className = '';
     //        $("#product_con #p"+i).hide();
     //       }
     //       tab_t_li[num].className = 'cur';
     //       $("#product_con #p"+num).fadeIn();
     //       $("#product_con #p"+num).siblings(".product").fadeOut();
     //      }
     //      function autoplay(){
     //       timer = setInterval(function(){
     //        num++;
     //        if(num>=len) num=0;
     //        tab_change();
     //       },5000);
     //      }
     //      //autoplay();
     //     }
     new Marquee(
      {
        MSClassID : "product_con",
        ContentID : "product_list",
        TabID   : "staus_slide",
        Direction : 2,
        Step    : 0.1,
        Width   : 810,
        Height    : 260,
        Timer   : 20,
        DelayTime : 8000,
        WaitTime  : 0,
        ScrollStep: 810,//如果是0，就是渐变
        SwitchType: 0,//如果是2就是渐变效果
        AutoStart : 1
      })
  });
});