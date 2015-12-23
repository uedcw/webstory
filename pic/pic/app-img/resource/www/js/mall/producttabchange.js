//店铺页面截取热门商品长度
$(function(){
	$('.detail').click(function(){
	   var _this = $(this);

	   if(!_this.hasClass("on")){
		   var contentId = _this.attr('content_id');
		   _this.parent().parent().find('li .detail').removeClass('on');

		   _this.addClass('on');
		   var cObj = $('#'+contentId);
		   $('.all_content').children().css('display', 'none');

		   $('.'+contentId).css('display', 'block');
	   }
	})
})