
(function($){
    $.fn.extend({
		scrollList:function(options){
	        var defaults ={
		       actName:'li',          //显示条数名；
			   maxShowNum:'6',       //最多的显示条数；
			   actNameH:'35',       //一次移动的距离；
			   ulClass:'.area_buy_list',           //被复制层的class
			   copyUlClass:'.area_buy_list_2',     //复制层的class
			   autoTime:'2500',  //自动运行时间；
			   clickGoUpC:'',        //点击向上class;
			   clickDownUpC:'',   //点击向下class;
			   goStart:'go_tart',
			   autoCloss:'flase'    //自动运行开关,当为'flase'时为开，其它则关；
			}
			options = $.extend(defaults, options);
			
			return this.each(function(){
		       var o = options;
			   var counts =1;
			   var linum = $($(this).find(o.actName),$(this)).size();
			   var ul_class = $($(this).find(o.ulClass),$(this));
			   var copy_ul_class = $($(this).find(o.copyUlClass),$(this));
               if(o.clickGoUpC != '') {
                   var click_go_up_c = $($(this).find(o.clickGoUpC), $(this));
               }
               if(o.clickDownUpC != '') {
                   var click_go_down_C = $($(this).find(o.clickDownUpC), $(this));
               }
			   var go_start = $($(this).find(o.goStart),$(this));
			   
			   	if(linum > o.maxShowNum){
				  $(copy_ul_class).html($(ul_class).html());
				  goStartList();
				}
				
				var thiswrap = $($(ul_class).parent().parent(),$(this));
				
				//自动运行函数
				function auto_function(){
					if(counts <= linum){
					$(ul_class).animate({top:'-=' + o.actNameH},o.autoTime);
					$(copy_ul_class).animate({top:'-=' + o.actNameH},o.autoTime);
					counts++;
					}else{
					$(ul_class).animate({top:0},0);
					$(copy_ul_class).animate({top:0},0);
					counts = 1;	
					}
				}
				
				//点击向上移动时；
				if(linum > o.maxShowNum){
					$(click_go_up_c).click(function(){
						if(counts <= linum){
							$(ul_class).animate({top:'-=' + o.actNameH},0);
							$(copy_ul_class).animate({top:'-=' + o.actNameH},0);
							counts++;
						}else{
							$(ul_class).animate({top:0},0);
							$(copy_ul_class).animate({top:0},0);
							counts = 1;
						}
					});
				}
				
				//点击向下移动时；
				if(linum > o.maxShowNum){
					$(click_go_down_C).click(function(){
						if(counts > 1){
							counts--;
							$(ul_class).animate({top:'-'+ counts*o.actNameH},0);
							$(copy_ul_class).animate({top:'-'+ counts*o.actNameH},0);
						}else{
							$(ul_class).animate({top:0},0);
							$(copy_ul_class).animate({top:0},0);
							counts = linum+1;
						}
				    });
				}
				
				//鼠标经过所发生的开始停止；
				if(linum > o.maxShowNum){
					$(thiswrap).hover(function(){
					   goStopList();
					},function(){
					   goStartList();
					});
				}
				
				
				function goStartList(){
					if(o.autoCloss === 'flase'){
					   go_start = setInterval(auto_function,o.autoTime);
					}
				}
				
				function goStopList(){
				    clearInterval(go_start);
				}
			});
		}
    });
}(jQuery));