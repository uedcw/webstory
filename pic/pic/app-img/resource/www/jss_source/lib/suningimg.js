define(['jquery'],function($){
/*
 * 焦点图
 */
var suningImages = function(){
	var box = $('.show_photo');
	var image = $('.photos');
	var btn = image.find('li');
	var len = btn.length ;
	var ul = image.find('ul');

    var small_width = 68;
    var show_pic_num = 4;

	return{
		init:function(){
			var that = this ;
			var posx ;
			var posy ;
			var i = 0 ;
			ul.css('width',len*small_width);
			image.prev('a').click(function(e){
				if(i<=0){
					return false;
				}
				i--;
				that.scroll(i);
				e.preventDefault();
			})

			image.next('a').click(function(e){
                var s_i = parseInt(len/show_pic_num);
				if(i >= s_i || len<=show_pic_num || (len%show_pic_num == 0 && i == (s_i - 1) )){
					return false;
				}
				i++;
				that.scroll(i);
				e.preventDefault();
			})


			btn.each(function(i){
				$(this).find('a').click(function(e){
					index = i ;
					that.addbk(i);
					that.loadimg(i);
					e.preventDefault();
				})
			})


			var index = 0 ;
			box.click(function(e){
				var e = e || window.event ;
				posx = e.clientX ;
				//判断鼠标位置，鼠标位置大于图片1/2处加
				if(posx>document.documentElement.clientWidth/2){
					index++;
					if(index>=len)
					{
						index=0;
						ul.stop().animate({marginLeft: 0 },300);
					}
					that.next(index);
				}else{
					index--;
					if(index<0){
						index=len-1;
						ul.stop().animate({marginLeft: -small_width*parseInt(index/show_pic_num)*show_pic_num },300);
					};
					that.prev(index);
				}
				e.preventDefault();
			}).mousemove(function(e){
				/*var e = e || window.event ;
				posx = e.clientX ;
				if(posx>document.documentElement.clientWidth/2){
					box.css('cursor','url(http://img.baidu.com/img/image/mousedown.cur),pointer');
					box.attr('title','下一页');
				}else{
					box.css('cursor','url(http://img.baidu.com/img/image/mousedown.cur),pointer');
					box.attr('title','上一页');
				}*/
			});

			$(document).keyup(function(e){
				var e = e || window.event ;
				if(e.which == 39){
					index++;
					if(index>=len){
						index=0;
						ul.stop().animate({marginLeft: 0 },300);
					}
					that.next(index);

				}else if(e.which== 37 ){
					index--;
					if(index<0){
						index=len-1;
						ul.stop().animate({marginLeft: -small_width*parseInt(index/show_pic_num)*show_pic_num },300);
					};
					that.prev(index);
				}
			});

		},
		loadimg:function(i){
			box.html('<div class="loading"></div>');
            var src_obj =  btn.eq(i).find('img');
			var src = src_obj.attr('src');

            var src = src_obj.attr('src');
            var big_src = src_obj.attr('big_src');

			box.html('<img src = ' +big_src+'  />' ).find('img').hide();
			box.find('img').fadeIn(250);
		},
		addbk:function(i){
			btn.eq(i).find('a').addClass('on').parent().siblings().find('a').removeClass('on');
		},
		scroll:function(i){
			ul.stop().animate({marginLeft: -small_width*show_pic_num*i },300);
		},
		next:function(index){
			var that = this ;
			if(((index)%show_pic_num)==0){
				ul.stop().animate({marginLeft: -small_width*(index) },300);
			}
			that.addbk(index);
			setTimeout(function(){that.loadimg(index);},400);
		},
		prev:function(index){
			var that = this ;
			if((index+1)%show_pic_num==0){
				ul.stop().animate({marginLeft: -small_width*parseInt(index/show_pic_num)*show_pic_num },300);
			}
			that.addbk(index);
			setTimeout(function(){that.loadimg(index);},400);
		}
	}
};
return suningImages();
});
