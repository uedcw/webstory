define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message'
], function(module, $,message){

    $(document).ready(function(){
       
  //    var MarqueeDiv3Control=new Marquee(
		// {
		// 	MSClass	  : ["top10","toplist"],
		// 	Direction : 2,
		// 	Step	  : 0.3,
		// 	Width	  : 1150,//一行排几个li，就用ScrollStep: 88*3的宽度
		// 	Height	  : 265,
		// 	Timer	  : 20,
		// 	DelayTime : 3000,
		// 	WaitTime  : 100000,
		// 	ScrollStep: 1150,//每个li的宽度加上border的宽度，再加上li之间的间距80+2+6
		// 	SwitchType: 0,
		// 	AutoStart : true
		// });
		// $("#list1").mouseover(function(){
		// 	$(this).addClass("cur").siblings().removeClass("cur");
		// 	MarqueeDiv3Control.Run(3)
		// })
		// $("#list2").mouseover(function(){
		// 	$(this).addClass("cur").siblings().removeClass("cur");
		// 	MarqueeDiv3Control.Run(3)
		// })
		
		// $(".pre").click(function(){
		// 	$("#list1").toggleClass("cur");
		// 	if($("#list1").hasClass("cur")){
		// 	$("#list2").removeClass("cur");
		// 	}
		// 	else{
		// 		$("#list2").addClass("cur");
		// 	}
		// 	MarqueeDiv3Control.Run(3);
		// })
		// $(".next").click(function(){
		// 	$("#list2").toggleClass("cur");
		// 	if($("#list2").hasClass("cur")){
		// 	$("#list1").removeClass("cur");
		// 	}
		// 	else{
		// 		$("#list1").addClass("cur");
		// 	}
		// 	MarqueeDiv3Control.Run(2);
		// })
       //上一页按钮
       var len=2;
       var index = 0;
        var sWidth = 1150;//获取焦点图的宽度（显示面积）
       $(".top10 .btn span").mouseover(function() {
		index = $(".top10 .btn span").index(this);
         $(this).addClass("on");
         $(this).siblings().removeClass("cur");
		showPics(index);
	}).eq(0).trigger("mouseover");
	$(".top10 .pre").click(function() {
		index -= 1;
		if(index == -1) {index = len - 1;}
		showPics(index);
	});

	//下一页按钮
	$(".top10 .next").click(function() {
		index += 1;
		if(index == len) {index = 0;}
		showPics(index);
	});
    //显示图片函数，根据接收的index值显示相应的内容
	function showPics(index) { //普通切换
		var nowLeft = -index*sWidth; //根据index值计算ul元素的left值\
		$(".top10 .banner").stop(true,false).animate({"left":nowLeft},300); //通过animate()调整ul元素滚动到计算出的position
		$(".top10 .btn span").removeClass("cur").eq(index).addClass("cur"); //为当前的按钮切换到选中的效果
	}
  });
});