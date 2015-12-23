define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message_new',
'attentionwin', // 关注(弹)层
'searchauto',   // 文本搜索自动完成
'pubjs',
'top10'
], function(module, $,message,attentionwin, searchauto){

   function suppliersRefresh(id,p)
    {
        $.ajax({
            type:"get",
            url:"/moldata/ajax_get_supplier",
            datatype:"json",
            data:
            {
                id:id,
                p:p
            },
            success:function (data){
               // console.log(data);
                $('#left_supplier').html(data);
            },
            error:function(e){
                //console.log("ajax交互时产生异常,事件代码:"+e);
            }
        });
    }

    var form_id=null;
    var eventobjs=null;
	//判断屏幕滚动
	var scrollFun=function(fixoffset,fixsubmit){
        var fix_y=fixoffset.offset().top.toInt()+300; //87 50 36
        var scx_y=$(window).scrollTop().toInt();
        var win_y=$(window).height().toInt();
        var cayy=fix_y - win_y;
        if(scx_y >= cayy){
           fixsubmit.css("top","-120px");
           fixsubmit.addClass("change");
        }else{
            fixsubmit.css("top","260px");
            fixsubmit.removeClass("change");
        }
    };
    $(document).ready(function(){
        // 初始化搜索框自动完成
        searchauto.init();

    	//判断屏幕滚动
    	var fixsubmit=$('.fix_memu_jump');//滚动到一定告诉的时候该元素需要做什么
        var fixoffset=$('.sroll_location');//需要滚动的位置
    	scrollFun(fixoffset,fixsubmit);
        window.onscroll=function(){
             scrollFun(fixoffset,fixsubmit);
        };
        window.onresize=function(){
            scrollFun(fixoffset,fixsubmit);
        };
        //点击右侧固定菜单跳转
         $(".fix_memu_jump ul li").click(function() {
         	if($(this).parents(".fix_memu_jump").hasClass("change")){
         		window.location.hash = "#info"; 
         	}
         	$(this).addClass("cur").siblings().removeClass("cur");
            var text=$(this).children("span").text().trim();
            var ico=$(this).data("ico");
            var con=$(this).data("id");
            if(ico=="i6"){
            	$(".info-tit .road").show();
            }
            else{
            	$(".info-tit .road").hide();
            }
            if(ico=="i8"){
            	$(".info-tit .tab").show();
            }
            else{
            	$(".info-tit .tab").hide();
            }
            if(ico=="i10"){
            	$(".stream-num").show();
            }
            else{
            	$(".stream-num").hide();
            }
            $(".info-tit h3").text(text);
            $(".error").attr("data-type",con);
            $(".error").attr("data-text",text);
            $(".info-tit i."+ico).show().siblings("i").hide();
            $("#"+con).show().siblings().hide();
        });
        //MSDS切换
        $(".info-tit .tab li").click(function() {
        	$(this).addClass("cur").siblings().removeClass("cur");
        	var indexs=$(this).data("id");
        	$(".msds .t"+indexs+"-con").show().siblings().hide();
         });
        //海关数据切换
        $(".data ul li").click(function() {
            $(this).addClass("cur").siblings().removeClass("cur");
            var indexs=$(this).data("id");
            $(".data #t"+indexs).show().siblings(".tab-con").hide();
         });
        //图谱切换
         $(".map .l-tab li").click(function() {
            $(this).addClass("cur").siblings().removeClass("cur");
            var indexs=$(this).data("id");
            $(".map #t"+indexs).show().siblings(".tab-con").hide();
         });
         $(".map .tab-con .b-tab li").click(function() {
            $(this).addClass("cur").siblings().removeClass("cur");
            var src=$(this).data("src");
            $(this).parent().siblings(".wrap-img").find(".big-pic").attr("src",src);
         });



         //我要供货弹框
        var tpl=null;
        $("#apply_supply").on('click',function(){
            var eo=$(this);
                tpl=eo.data('tpl');
            message.win(tpl, function(){    //open前
                $doms=$('#'+tpl);
                var _this=this;
              //  $('#success_'+tpl).show();
                if(!$doms.data('bind')){//绑定事件
                    $doms.data('bind',1);

                    $('#close_'+tpl).on('click',function(){
                        dialog.get(tpl+'_win').remove();
                       // _this.remove();     //绑定关闭窗口时要用remove();
                    });
                    
                }
               
               _this.title('操作提示');
        },function(){   //close时
          
        });
     });
//换一组
$('.left').on('click','.supplierChange',function(){
//$(".total").delegate("a","click",function(){
    // alert("11");
    var molidd=$(this).data("mol_id");
    var pp=parseInt($(this).data("p"));
    $.ajax({
            type:"get",
            url:"/moldata/ajax_get_supplier",
            datatype:"json",
            data:
            {
                id:molidd,
                p:pp
            },
            success:function (data){
               // console.log(data);
                $('#left_supplier').html(data);
            },
            error:function(e){
                //console.log("ajax交互时产生异常,事件代码:"+e);
            }
        });
});
//海关数据
//$('.con').on('click','.customChange',function(){
     $(".customChange").on('click',function(){
    var hscode_id=$(this).data("hscode_id");
     $.ajax({
            type:"get",
            url:"/moldata/ajax_get_custom",
            datatype:"json",
            data:
            {
                id:hscode_id
            },
            success:function (data){
               // console.log(data);
                $('#t1').html(data);
            },
            error:function(e){
                console.log("ajax交互时产生异常,事件代码:"+e);
            }
        });

});
//合成路线
//$('.con').on('click','.syntheticChange',function(){
    $(".syntheticChange").on('click',function(){
    var stab=$(this).data("stab");
    var sp=$(this).data("sp");
    var mol_id=$(this).data("mol_id");
      $.ajax({
        type:"get",
        url:"/moldata/ajax_get_synthetic",
        datatype:"json",
        data:
        {
            id:mol_id,
            p:sp,
            tab:stab
        },
        success:function (data){
           // console.log(data);
            $('#synthetic').html(data);
        },
        error:function(e){
            console.log("ajax交互时产生异常,事件代码:"+e);
        }
    });


});
 $(".zh-name .more").on('click',function(){
       $(this).siblings(".expand").toggle();
     });
  // 绑定关注功能的按钮事件
        $('a.addattention').on('click', attentionwin.open);
         $('.p-bottom').on('click','.zan',function(){
        // $(".zan").on('click',function(){
            $(this).removeClass("zan");
             var urll=$(this).data("url");
             var text=parseInt($(this).children("span").text());
             text=text+1;
             $(this).children("span").text(text);
             $.post(urll,function(rs){
            });
              return false;
         });
         var pnum=2;
         var eventobjs=null;
        //点击更多 
       $(".view-more").on('click',function(){
            eventobjs=this;
            var total=$(eventobjs).data("total-page");
            var urll=$(eventobjs).data("url");
            var idd=$(eventobjs).data("container");
            $.get(urll,{"page":pnum},function(rs){
               if(pnum>=total){
                    $(eventobjs).hide();
                }
                pnum=pnum+1;
                $(idd).append(rs);
                //console.log(rs);
            });   
       });
        //纠错弹框
        var tpl_0=null;
        var error_title=null;
        $('.error').click(function(){
        //$('.info-tit').on('click','#error',function(){
            eventobjs=this;
            var eo=$(eventobjs);
                tpl_0=$(eventobjs).data('tpl');
                form_id=$(eventobjs).data("type");
                error_title=$(eventobjs).data("text");
                console.log(form_id);
            message.win(tpl_0, function(){    //open前
                $doms=$('#'+tpl_0);
                var _this=this;
                $('#'+form_id+'_form').show();
                $('#'+form_id+'_form').siblings("ul").hide();
                if(!$doms.data('bind')){//绑定事件
                    $doms.data('bind',1);

                    $('#close_'+tpl_0).on('click',function(){
                        dialog.get(tpl_0+'_win').remove();
                       // _this.remove();     //绑定关闭窗口时要用remove();
                    });
                    
                }
               
               _this.title('【'+error_title+'】'+' - 问题反馈');
        },function(){   //close时
          
        });
     });
    $(".view_name").click(function(){
        $(this).parent().siblings(".other_name").slideDown();
        $(this).hide();
        $(this).siblings().show();
    });
    $(".detail-list dl dd a.up").click(function(){
        $(this).parent().siblings(".other_name").slideUp();
        $(this).hide();
        $(this).siblings().show();
    });
  });
});