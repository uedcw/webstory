define(['placeholder'], function(){
    //客服弹框
    $('.chat').click(function() {
　　    window.open ("http://cs.ecqun.com/cs/?id=660133&cid=659827&scheme=0&handle=&url=http%3A%2F%2Fwww.molbase.com%2Fzh%2Findex.html&version=4.0.0.0", "newwindow", "height=5, width=890, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no") //写成一行
　　})

    $(document).ready(function(){
        window['DB']['READY']=true;
　　});

     //判断登陆
       var t=$.now();
       // $.post('/zh/index.php?app=default&act=cart_value&v='+t,{'t':t},function(rs){
        $.post('/zh/index.php?app=default&act=cart_value&v='+t,{'t':t},function(rs){
            $(".login-load").show();
          if(rs.done)
            {
                var user_name=rs.retval.n;
                var tips=rs.retval.tips;
                if(rs.retval.l){
                    $('#login').fadeIn("fast");
                    $('#user_name').text(user_name).fadeIn("fast");
                    $('#login .exit').fadeIn("fast");
                    if(tips<=0){
                       $('#message').fadeIn("fast");
                       $('#message .message').hide();
                       $('#message .no-message').fadeIn("fast");
                    }else{
                       $('#message').fadeIn("fast");
                       $('#message .message').fadeIn("fast");
                       $('#tips').text(tips);
                       $('#message .no-message').hide();
                    }
                    if(typeof ga!=="undefined" && rs.retval.i>0){/* GA USERID 统计 */
                        ga('set','&uid',rs.retval.i);
                    }
                }
                else
                {
                    $('#user_name').hide();
                    $('.vistor').fadeIn("fast");
                    $('#login .exit').hide();
                    $('#message').hide();
                    $('#no-login').fadeIn("fast");
                    $('#login').fadeIn("fast");
                }
            }
        },'json');
        //退出
        $('#login .exit').click(function() {
                 $('#user_name').hide();
                $('.vistor').show();
                $('#login .exit').hide();
                $('#message').hide();
                $('#no-login').show();
        $.post('/zh/index.php?app=member&act=ajaxLogout',function(rs){
        },'json');
         })

        //加入收藏
        function addFavorite2(url1,title1) {
            var url = url1;
            var title = title1;
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("360se") > -1) {
                alert("由于360浏览器功能限制，请按 Ctrl+D 手动收藏！");
            }
            else if (ua.indexOf("msie 8") > -1) {
                window.external.AddToFavoritesBar(url, title); //IE8
            }
            else if (document.all) {
          try{
           window.external.addFavorite(url, title);
          }catch(e){
           alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
          }
            }
            else if (window.sidebar) {
                window.sidebar.addPanel(title, url, "");
            }
            else {
          alert('您的浏览器不支持,请按 Ctrl+D 手动收藏!');
            }
        }
         $('.collect').click(function(){

            addFavorite2("摩贝化合物搜索","http://www.molbase.com")

             });
        //判断浏览器高度，返回顶部出现
        window.onscroll = function () {
            var top = document.documentElement.scrollTop || document.body.scrollTop;
             if(top>300){
			    $(".fix_nav ul li.top").fadeIn()
			 }
             else{$(".fix_nav ul li.top").fadeOut()}
        };
        //返回顶部
        $('.fix_nav ul li.top').click(function(){$('html,body').animate({scrollTop: '0px'}, 800);return false;});
        //搜索框切换
         $(".search .tab li").click(function() {
             var i=$(this).attr("data-id");
            $(this).addClass("cur");
            $(this).siblings().removeClass("cur");
            $(this).parent().siblings(".f"+i).show();
            $(this).parent().siblings(".f"+i).siblings(".so").hide();

             var n = (i+1)%3? (i+1)%3: 3;
             var p = (i-1)%3? (i-1)%3: 3;
             $(" .search #keyword_"+i).css('display','block');
             $(" .search #keyword_"+n).css('display','none');
             $(" .search #keyword_"+p).css('display','none');
         })

         //底部友情链接滚动
          new Marquee("link",0,0.1,1040,20,20,3000,1000,20);//最后一个参数20，滚动区域多高，就设置多少
});
