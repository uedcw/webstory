define(['module','jquery','message'], function(module, $, message){
    //左边手风琴效果
    $(".member .m-left dt").click(function(e) {
        $(this).siblings("dd").toggle();
        $(this).children("i").toggleClass("down")
    });
});
