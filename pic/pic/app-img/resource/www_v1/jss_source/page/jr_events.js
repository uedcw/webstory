define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message_new',
'pubjs'
], function(module, $,message){
	
    $(document).ready(function(){
    //倒计时
    function GetRTime(){
        var EndTime= new Date('2015/8/30 00:00:00');
        var NowTime = new Date();
        var t =EndTime.getTime() - NowTime.getTime();
        var d=Math.floor(t/1000/60/60/24);
        if(d<10){
            d="0"+d;
        }
        else{
            d=d;
        }
        document.getElementById("t_d").innerHTML = d;
    }
    function Gethour(){
       var EndTime= new Date('2015/8/30 00:00:00');
       var NowTime = new Date();
       var t =EndTime.getTime() - NowTime.getTime();
       if(t >= 0){  
       var h=Math.floor(t/1000/60/60%24);
       var m=Math.floor(t/1000/60%60);
       var s=Math.floor(t/1000%60);
       document.getElementById("t_h").innerHTML = h;
       document.getElementById("t_m").innerHTML = m;
       document.getElementById("t_s").innerHTML = s;
    }else{
           //$(".countdown").hide();

      }
    }
    setInterval(GetRTime,0); 
    setInterval(Gethour,0);
        //无缝滚动
        new Marquee("table",0,0,528,197,50,0,0);
    	//立刻申请VIP供应商
    	var tpl=null;
    	$("#loan_apply_vip").on('click',function(){
            var eo=$(this);
                tpl=eo.data('tpl');
                message.win(tpl, function(){    //open前
                var _this=this,   
                $doms=$('#'+tpl);
                if(!$doms.data('bind')){//绑定事件
                    $doms.data('bind',1);
                }
              _this.title('操作提示');
        },function(){   //close时
          
        });
 });
        
  });
});