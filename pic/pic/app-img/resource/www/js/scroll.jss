
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


(function(a) {
    a.fn.slides = function(b) {
        return b = a.extend({}, a.fn.slides.option, b), this.each(function() {
            function w(g, h, i) {
                if (!p && o) {
                    p = !0, b.animationStart(n + 1);
                    switch (g) {
                        case "next":
                            l = n, k = n + 1, k = e === k ? 0 : k, r = f * 2, g = -f * 2, n = k;
                            break;
                        case "prev":
                            l = n, k = n - 1, k = k === -1 ? e - 1 : k, r = 0, g = 0, n = k;
                            break;
                        case "pagination":
                            k = parseInt(i, 10), l = a("." + b.paginationClass + " li." + b.currentClass + " a", c).attr("href").match("[^#/]+$"), k > l ? (r = f * 2, g = -f * 2) : (r = 0, g = 0), n = k
                    }
                    h === "fade" ? b.crossfade ? d.children(":eq(" + k + ")", c).css({
                        zIndex: 10
                    }).fadeIn(b.fadeSpeed, b.fadeEasing, function() {
                        b.autoHeight ? d.animate({
                            height: d.children(":eq(" + k + ")", c).outerHeight()
                        }, b.autoHeightSpeed, function() {
                            d.children(":eq(" + l + ")", c).css({
                                display: "none",
                                zIndex: 0
                            }), d.children(":eq(" + k + ")", c).css({
                                zIndex: 0
                            }), b.animationComplete(k + 1), p = !1
                        }) : (d.children(":eq(" + l + ")", c).css({
                            display: "none",
                            zIndex: 0
                        }), d.children(":eq(" + k + ")", c).css({
                            zIndex: 0
                        }), b.animationComplete(k + 1), p = !1)
                    }) : d.children(":eq(" + l + ")", c).fadeOut(b.fadeSpeed, b.fadeEasing, function() {
                        b.autoHeight ? d.animate({
                            height: d.children(":eq(" + k + ")", c).outerHeight()
                        }, b.autoHeightSpeed, function() {
                            d.children(":eq(" + k + ")", c).fadeIn(b.fadeSpeed, b.fadeEasing)
                        }) : d.children(":eq(" + k + ")", c).fadeIn(b.fadeSpeed, b.fadeEasing, function() {
                            a.browser.msie && a(this).get(0).style.removeAttribute("filter")
                        }), b.animationComplete(k + 1), p = !1
                    }) : (d.children(":eq(" + k + ")").css({
                        left: r,
                        display: "block"
                    }), b.autoHeight ? d.animate({
                        left: g,
                        height: d.children(":eq(" + k + ")").outerHeight()
                    }, b.slideSpeed, b.slideEasing, function() {
                        d.css({
                            left: -f
                        }), d.children(":eq(" + k + ")").css({
                            left: f,
                            zIndex: 5
                        }), d.children(":eq(" + l + ")").css({
                            left: f,
                            display: "none",
                            zIndex: 0
                        }), b.animationComplete(k + 1), p = !1
                    }) : d.animate({
                        left: g
                    }, b.slideSpeed, b.slideEasing, function() {
                        d.css({
                            left: -f
                        }), d.children(":eq(" + k + ")").css({
                            left: f,
                            zIndex: 5
                        }), d.children(":eq(" + l + ")").css({
                            left: f,
                            display: "none",
                            zIndex: 0
                        }), b.animationComplete(k + 1), p = !1
                    })), b.pagination && (a("." + b.paginationClass + " li." + b.currentClass, c).removeClass(b.currentClass), a("." + b.paginationClass + " li:eq(" + k + ")", c).addClass(b.currentClass))
                }
            }

            function x() {
                clearInterval(c.data("interval"))
            }

            function y() {
                b.pause ? (clearTimeout(c.data("pause")), clearInterval(c.data("interval")), u = setTimeout(function() {
                    clearTimeout(c.data("pause")), v = setInterval(function() {
                        w("next", i)
                    }, b.play), c.data("interval", v)
                }, b.pause), c.data("pause", u)) : x()
            }
            a("." + b.container, a(this)).children().wrapAll('<div class="slides_control"/>');
            var c = a(this),
                d = a(".slides_control", c),
                e = d.children().size(),
                f = d.children().outerWidth(),
                g = d.children().outerHeight(),
                h = b.start - 1,
                i = b.effect.indexOf(",") < 0 ? b.effect : b.effect.replace(" ", "").split(",")[0],
                j = b.effect.indexOf(",") < 0 ? i : b.effect.replace(" ", "").split(",")[1],
                k = 0,
                l = 0,
                m = 0,
                n = 0,
                o, p, q, r, s, t, u, v;
            if (e < 2) return a("." + b.container, a(this)).fadeIn(b.fadeSpeed, b.fadeEasing, function() {
                o = !0, b.slidesLoaded()
            }), a("." + b.next + ", ." + b.prev).fadeOut(0), !1;
            if (e < 2) return;
            h < 0 && (h = 0), h > e && (h = e - 1), b.start && (n = h), b.randomize && d.randomize(), a("." + b.container, c).css({
                overflow: "hidden",
                position: "relative"
            }), d.children().css({
                position: "absolute",
                top: 0,
                left: d.children().outerWidth(),
                zIndex: 0,
                display: "none"
            }), d.css({
                position: "relative",
                width: f * 3,
                height: g,
                left: -f
            }), a("." + b.container, c).css({
                display: "block"
            }), b.autoHeight && (d.children().css({
                height: "auto"
            }), d.animate({
                height: d.children(":eq(" + h + ")").outerHeight()
            }, b.autoHeightSpeed));
            if (b.preload && d.find("img:eq(" + h + ")").length) {
                a("." + b.container, c).css({
                    background: "url(" + b.preloadImage + ") no-repeat 50% 50%"
                });
                var z = d.find("img:eq(" + h + ")").attr("src");
                a("img", c).parent().attr("class") != "slides_control" ? t = d.children(":eq(0)")[0].tagName.toLowerCase() : t = d.find("img:eq(" + h + ")"), d.find("img:eq(" + h + ")").attr("src", z).one('load', function() {
                	
                	d.find(t + ":eq(" + h + ")").fadeIn(b.fadeSpeed, b.fadeEasing, function() {
                        a(this).css({
                            zIndex: 5
                        }), a("." + b.container, c).css({
                            background: ""
                        }), o = !0, b.slidesLoaded()
                    })
                }).each(function() {
                	if(this.complete) $(this).load();
                });
            } else d.children(":eq(" + h + ")").fadeIn(b.fadeSpeed, b.fadeEasing, function() {
                o = !0, b.slidesLoaded()
            });
            b.bigTarget && (d.children().css({
                cursor: "pointer"
            }), d.children().click(function() {
                return w("next", i), !1
            })), b.hoverPause && b.play && (d.bind("mouseover", function() {
                x()
            }), d.bind("mouseleave", function() {
                y()
            })), b.generateNextPrev && (a("." + b.container, c).after('<a href="#" class="'+ b.switchForm+' ' + b.prev + '"></a>'), a("." + b.prev, c).after('<a href="#" class="'+ b.switchForm+' ' + b.next + '"></a>')), a("." + b.next, c).click(function(a) {
                a.preventDefault(), b.play && y(), w("next", i)
            }), a("." + b.prev, c).click(function(a) {
                a.preventDefault(), b.play && y(), w("prev", i)
            }), b.generatePagination ? (b.prependPagination ? c.prepend("<div class="+ b.paginationFormClass+"><ul class=" + b.paginationClass + "></ul></div>") : c.append("<div class="+ b.paginationFormClass+"><ul class=" + b.paginationClass + "></ul></div>"), d.children().each(function() {
                a("." + b.paginationClass, c).append('<li><a href="#' + m + '">' + (m + 1) + "</a></li>"), m++
            })) : a("." + b.paginationClass + " li a", c).each(function() {
                a(this).attr("href", "#" + m), m++
            }), a("." + b.paginationClass + " li:eq(" + h + ")", c).addClass(b.currentClass), a("." + b.paginationClass + " li a", c).click(function() {
                return b.play && y(), q = a(this).attr("href").match("[^#/]+$"), n != q && w("pagination", j, q), !1
            }), a("a.link", c).click(function() {
                return b.play && y(), q = a(this).attr("href").match("[^#/]+$") - 1, n != q && w("pagination", j, q), !1
            }), b.play && (v = setInterval(function() {
                w("next", i)
            }, b.play), c.data("interval", v));

            if(b.generateNextPrev){
                var isFade = 0;
                $(document).bind('mouseover', function(e) {
                    var _this = $('.'+ b.container);
                    var targ = e.target;
                    if (targ.nodeType == 3) targ = targ.parentNode  // Safari
                    var slideSet = _this.offset();
                    var slideWidth = parseFloat(_this.css('width').replace('px', ''));
                    var slideHeight = parseFloat(_this.css('height').replace('px', ''));
                    if(
                        (slideSet.left + slideWidth) < e.clientX || (slideSet.top + slideHeight) < e.clientY
                            || slideSet.left > e.clientX || slideSet.top > e.clientY
                     ){
                        if(isFade) return false;
                        isFade = 1;
                        $('.' + b.switchForm).fadeOut(function(){
                            isFade = 0;
                        });
                    } else{
                        if(isFade) return false;
                        isFade = 1;
                        $('.' + b.switchForm).fadeIn(function () {
                            isFade = 0
                        });

                    }

                });

            }
        })
    }, a.fn.slides.option = {
        preload: !1,
        preloadImage: "http://"+resDomain+"/img/loading.gif",
        container: "slides_container",
        generateNextPrev: !0,
        switchForm:'slides_switch',
        next: "next_but",
        prev: "prev_but",
        pagination: !0,
        generatePagination: !0,
        prependPagination: !1,
        paginationFormClass:'pagination_form',
        paginationClass: "pagination",
        currentClass: "current",
        fadeSpeed: 350,
        fadeEasing: "",
        slideSpeed: 350,
        slideEasing: "",
        start: 1,
        effect: "slide",
        crossfade: !1,
        randomize: !1,
        play: 0,
        pause: 0,
        hoverPause: !1,
        autoHeight: !1,
        autoHeightSpeed: 350,
        bigTarget: !1,
        animationStart: function() {},
        animationComplete: function() {},
        slidesLoaded: function() {}
    }, a.fn.randomize = function(b) {
        function c() {
            return Math.round(Math.random()) - .5
        }
        return a(this).each(function() {
            var d = a(this),
                e = d.children(),
                f = e.length;
            if (f > 1) {
                e.hide();
                var g = [];
                for (i = 0; i < f; i++) g[g.length] = i;
                g = g.sort(c), a.each(g, function(a, c) {
                    var f = e.eq(c),
                        g = f.clone(!0);
                    g.show().appendTo(d), b !== undefined && b(f, g), f.remove()
                })
            }
        })
    }
})(jQuery);