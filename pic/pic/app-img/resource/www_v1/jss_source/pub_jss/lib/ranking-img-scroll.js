define(['jquery'], function($){
/*
 * a_inquiry_ranking.view.html 底部的图片滚动插件
 */

    var index = 0,
        Swidth = 1200,
        timer = null,
        oLi=null,
        len =0;

        function NextPage(){
            if(index>1){
                index = 0 ;
            }
            oLi.removeClass("cur").eq(index).addClass("cur");
            $(".top10_main").stop(true, false).animate({left: -index*Swidth+"px"},600)
        }

        function PrevPage(){
            if(index<0){
                index = 1 ;
            }
            oLi.removeClass("cur").eq(index).addClass("cur");
            $(".top10_main").stop(true, false).animate({left: -index*Swidth+"px"},600)
        }

        function init(){
            oLi=$(".tab-T-3 li");
            len=oLi.length;
            if(!len)return;

            oLi.each(function(a){
                $(this).click(function(){
                    index = a ;
                    NextPage();
                });
            });

            $(".next").click(function(){
                 index++ ;
                 NextPage();
            });

            $(".prev").click(function(){
                 index-- ;
                 PrevPage();
            });
        }

        return {
            init:init
        };
});