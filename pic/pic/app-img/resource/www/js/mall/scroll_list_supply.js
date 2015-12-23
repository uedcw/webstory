$(function() {
    var $this = $("#news");
    var scrollTimer;
    $this.hover(function() {
        clearInterval(scrollTimer);
    }, function() {
        scrollTimer = setInterval(function() {
            scrollNews($this);
        }, 2000);
    }).trigger("mouseleave");

    function scrollNews(obj) {
        var $self = obj.find("ul");
        var lineHeight = $self.find("li:first").height();
        var totalheight = $self.height();
        $self.animate({
            "marginTop": -lineHeight + "px"
        }, 300, function() {
               if(totalheight<lineHeight){
                   $self.css({
                       marginTop: totalheight
                   }).find("li:first").appendTo($self);
               }else{
                   $self.css({
                       marginTop: 0
                   }).find("li:first").appendTo($self);
               }

        })
    }
})