define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'searchauto',   // 文本搜索自动完成
'message',
'moment',       // 时间差格式化
'pubjs',
], function(module, $,searchauto,message,moment){

    $(document).ready(function(){
        window['DB']['READY']=true;
           // 初始化搜索框自动完成
        searchauto.init();

       try{
                //时间戳
        $(".relative-time").each(function(i){
           var v_time= $(".relative-time").eq(i).data("time");
            var d1=moment(v_time, "YYYY-MM-DD HH:mm:ss").fromNow();
            $(".relative-time").eq(i).text(d1);
          });
            }catch(e){
            }
        //无缝滚动
        new Marquee("price",0,0,358,198,50,0,0);

        //banner轮播**************************************

  var sWidth = $("#focus").width(); //获取焦点图的宽度（显示面积）
	var len = $("#focus ul li").length; //获取焦点图个数
	var index = 0;
	var picTimer;

	//以下代码添加数字按钮和按钮后的半透明条，还有上一页、下一页两个按钮
	var btn = "<div class='btn'>";
	for(var i=0; i < len; i++) {
        j=i+1;
		btn += "<span>"+j+"</span>";
	}
	btn += "</div><div class='preNext pre'></div><div class='preNext next'></div>";
	$("#focus").append(btn);
	//为小按钮添加鼠标滑入事件，以显示相应的内容
	$("#focus .btn span").mouseover(function() {
		index = $("#focus .btn span").index(this);
         $(this).addClass("on");
         $(this).siblings().removeClass("on");
		showPics(index);
	}).eq(0).trigger("mouseover");
	//上一页按钮
	$("#focus .pre").click(function() {
		index -= 1;
		if(index == -1) {index = len - 1;}
		showPics(index);
	});

	//下一页按钮
	$("#focus .next").click(function() {
		index += 1;
		if(index == len) {index = 0;}
		showPics(index);
	});

	//本例为左右滚动，即所有li元素都是在同一排向左浮动，所以这里需要计算出外围ul元素的宽度
	$("#focus ul").css("width",sWidth * (len));

	//鼠标滑上焦点图时停止自动播放，滑出时开始自动播放
	$("#focus").hover(function() {
		clearInterval(picTimer);
	},function() {
		picTimer = setInterval(function() {
			showPics(index);
			index++;
			if(index == len) {index = 0;}
		},5000); //此4000代表自动播放的间隔，单位：毫秒
	}).trigger("mouseleave");

	//显示图片函数，根据接收的index值显示相应的内容
	function showPics(index) { //普通切换
		var nowLeft = -index*sWidth; //根据index值计算ul元素的left值
		$("#focus ul").stop(true,false).animate({"left":nowLeft},300); //通过animate()调整ul元素滚动到计算出的position
		$("#focus .btn span").removeClass("on").eq(index).addClass("on"); //为当前的按钮切换到选中的效果
	}


    //*************************************

    //公司轮播*********************************

        var index2 = 0;
        var picTimer2;
        var len2 = $("#focus2 ul li").length;
        $("#focus2 ul li").each(function(i,a){
            $(".focus").append("<span>"+i+"</span>");
            $(".focus span").eq(0).addClass("cur");
        });
        if(len2<=1){$(".focus span").hide()}
        else if(len2>=1){$(".focus span").show()}
        $(".focus  span").mouseover(function() {
            index2 = $(".focus span").index(this);
            showPics2(index2);
        });

            //自动播放
        $("#focus2").hover(function() {
            clearInterval(picTimer2);
        },function() {
              picTimer2 = setInterval(function() {
                showPics2(index2);
                index2++;
                if(index2 == len2) {index2 = 0;}
            },8000);
        }).trigger("mouseleave");
        var showPics2=function(index2) {
        $(".focus  span").eq(index2).addClass("cur");
        $(".focus  span").eq(index2).siblings().removeClass("cur");
        $("#focus2 ul li").eq(index2).fadeIn();
        $("#focus2 ul li").eq(index2).siblings().fadeOut();
    };
    //**********************************

        //右侧鼠标hover显示步骤
        $(".question ul li").click(function() {
            $(this).children(".hover").show();
            $(".question .back").show();
        });

        $(".question .back").on("mousedown",function(){
            $(this).hide();
            $(".question ul li .hover").hide();
        });

        //tab切换
         var marquee_obj=$("#doing");
        $(".state .tab li").mouseover(function() {
            var i=$(this).attr("data-id");
            $(this).addClass("cur");
            $(this).siblings().removeClass("cur");
            $(this).parent().siblings(".tab"+i).show();
            $(this).parent().siblings(".tab"+i).siblings(".tab-con").hide();
            if(i==2){
              if(marquee_obj.data('isinit').toInt()>0){
                   return;
                }
               marquee_obj.data('isinit',1);
               new Marquee("doing",0,0,360,225,50,0,0);
            }
        });
            $(".notice .tab li").mouseover(function() {
            var i=$(this).attr("data-id");
            $(this).addClass("cur");
            $(this).siblings().removeClass("cur");
            $(this).parent().siblings(".tab"+i).show();
            $(this).parent().siblings(".tab"+i).siblings(".tab-con").hide();
        });

    // document Ready END
	});
});
