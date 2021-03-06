/*!
 * jQuery 页面滚动浮动层智能定位插件
 * smartFloat 1.3.0
 * Date: 2013-10-21
 * Author: Steven http://wangwen1220.github.io/
 *
 * 2013-10-21 v1.3.0 添加点位元素，在窗口尺寸改变时获取元素的左偏移
 * 2013-08-23 v1.2.0 添加 margin 参数设置
 * 2012-10-31 v1.1.0 添加自定义元素宽度和占位元素
 * 2010-12-06 v1.0.0 看了张鑫旭的浮动层智能定位例子，有了想改成插件的冲动，于是有了此插件
 * 说明：需要注意的一点，导航的宽度必须是固定值，不能是 auto 或者 100% 因为 fixed 和 absolute 都不认识
 * 当然你也可以手动获取到导航的宽度，然后写到浮动导航样式里
 * 不过有个前提，导航原先样式里不能有 position:relative，情况可能比较多，最简单的方法还是把导航宽度定死。
 * 注意：静态流元素添加占位元素，否则当窗口高度稍大于文档高度时定位会失效

set:
{
    top: 10,
    left: offset_left,
    zindex: 999,            // 此值不宜过高，要根据具体情况而定
    margin: 0,              // margin 也会影响元素的定位，默认重置为 0
    width: default_width,
    placeholder: false      // 是否占位
}

demo:

        $('.sea_key').smartfloat({
            placeholder:true
        });

 */

;(function (factory){
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($) {
  $.fn.smartfloat = function(opt) {
    return this.each(function() {
      var $this = $(this),
        window_width = $(window).width(),
        // 距离屏幕顶部和左侧的距离
        offset_top = $this.offset().top,
        offset_left = $this.offset().left,
        // 默认样式记录，还原初始样式时候需要
        default_position = $this.css('position'),
        default_top = $this.css('top'),
        default_left = $this.css('left'),
        default_zindex = $this.css('z-index'),
        default_margin = $this.css('margin'),
        default_width = $this.css('width');

      // 默认设置
      var config = $.extend({
        top: 10,
        left: offset_left,
        zindex: 77, // 此值不宜过高，要根据具体情况而定
        margin: 0, // margin 也会影响元素的定位，默认重置为 0
        width: default_width,
        placeholder: false // 是否占位
      }, opt || {});
      var top = config.top,
        left = config.left,
        zindex = config.zindex,
        margin = config.margin,
        width = config.width,
        placeholder = config.placeholder,
        $placeholder;

      // 占位元素
      $placeholder = $('<div/>').css({
        'position': default_position,
        // 'top': default_top,
        'left': default_left,
        // 'width': $this.outerWidth(),
        // 'height': $this.outerHeight(),
        'margin-left': $this.css('margin-left')
      }).insertAfter($this);

      // 鼠标滚动
      $(window).scroll(function() {
        var scroll_top = $(this).scrollTop();
        if(scroll_top + top > offset_top) {
          // 显示占位元素
          if (placeholder) {
            $placeholder.css({
              'top': default_top,
              'width': $this.outerWidth(),
              'height': $this.outerHeight(),
              'margin': default_margin
            });
          }

          // 添加类来控制一些复杂的布局
          $this.addClass('smart-float');
          if(window.XMLHttpRequest) {
            $this.css({
              'position': 'fixed',
              'top': top,
              'left': left,
              'z-index': zindex,
              'margin': margin,
              'width': width
            });
          } else { // for IE6
            // IE6 不认识 position: fixed，单独用 position: absolute 模拟
            $this.css({
              'position': 'absolute',
              'top': scroll_top + top,
              'left': default_left,
              'z-index': zindex,
              'margin': margin,
              'width': width
            });
            // 防止出现抖动 - 请慎用，会替换 html 已定义的背景图
            // $('html').css({'background-image': 'url(about:blank)', 'background-attachment': 'fixed'});
          }
        } else {
          // 隐藏占位元素
          if (placeholder) {
            $placeholder.css({
              'top': 'auto',
              'width': 'auto',
              'height': 'auto',
              'margin': '0',
              'margin-left': $this.css('margin-left')
            });
          }

          // 还原初始样式
          $this.removeClass('smart-float').css({
            'position': default_position,
            'top': default_top,
            'left': default_left,
            'z-index': default_zindex,
            'margin': default_margin,
            'width': default_width
          });
        }
      }).resize(function() { // 窗口尺寸改变
        if (opt && opt.left) return;
        left = $placeholder.offset().left;
        $(window).scroll();
      }).trigger('scroll');
    });
  };
}));