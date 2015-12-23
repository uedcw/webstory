define(['jquery'], function($){
/*
    返回顶部
*/

    function init(){
        var $obj=$("#back-to-top");
        if(!$obj.length)return;

        $obj.css('right',function(){
            var ww=$(window).width();
            var to=(ww - 1200 - 20) / 2 - 40;
            return to;
        }).click(function(){
            $('body,html').animate({scrollTop:0},500);
            return false;
        });

        $(window).resize(function(){
            $obj.css('right',function(){
                var ww=$(window).width();
                var to=(ww - 1200 - 20) / 2 - 40;
                return to;
            });
        }).scroll(function(){
            if($(window).scrollTop()>100){
               $obj.fadeIn(500);
            }
            else{
               $obj.fadeOut(500);
            }
        });
    }

    return {
        init:init
    }
});
