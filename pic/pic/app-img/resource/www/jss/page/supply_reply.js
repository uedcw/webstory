define(["module","jquery","doCart","malldialog","mallpublic","fadeslide"],function(e,t,n,r){t(document).ready(function(){n.doCart.init(),t(".prev,.next").hover(function(){t(this).stop(!0,!1).fadeTo("show",.9)},function(){t(this).stop(!0,!1).fadeTo("show",.4)}),t(".banner-box").slide({titCell:".hd ul",mainCell:".bd ul",effect:"fold",interTime:3500,delayTime:500,autoPlay:!1,autoPage:!0,trigger:"click"}),t(".product-x ul li").mouseover(function(){t(this).find(".price .fl p i").addClass("hover"),t(this).find(".price .fr a").addClass("btn0-bg")}),t(".product-x ul li").mouseleave(function(){t(this).find(".price .fl p i").removeClass("hover"),t(this).find(".price .fr a").removeClass("btn0-bg")})})});