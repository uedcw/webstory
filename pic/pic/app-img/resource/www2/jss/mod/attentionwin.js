define(["module","jquery","message","imgs"],function(e,t,n,r){function a(e){var u=e.data("mid"),a=e.data("cas"),f=e.data("name"),l=e.data("img"),c=i==="zh"?"关注产品":"Add to Bookmark";n.win(o,function(){var n=this,u=t("#"+o),h=t("#"+l).attr("src");u.data("bind")||(u.data("bind",1),t("#close_"+o).on("click",function(){s.get(o+"_win").remove()})),u.find(".cs").html('<a href="./cas-'+a+'.html" style="color:#000;font-size:12px;font-weight:100;">'+a+"</a>"),u.find(".na").html('<a href="./cas-'+a+'.html" ><span style="color:#000;font-weight:100;font-size:12px;">'+f+"</span></a>"),u.find(".ima").attr({href:"./cas-"+a+".html",title:f}),n.title(c),r.ready(h,function(){var e=r.zoom(this.width,this.height,120,120);u.find(".im").attr("src",h).width(e.width).height(e.height)}),e.find("span").text(i=="zh"?"已关注":"In Bookmark")})}function f(){var e=t(this),r=e.data("isa").toInt(),i=e.data("is5").toInt();if(i){n.warning(u);return}if(r===1)a(e);else{var s=e.data("mid"),o=e.data("cas"),f="user_footprint_ok_form";t.post("./index.php?app=search&act=AddtoAttention",{mol_id:s,cas:o},function(r){r=t.trim(r).toInt();if(r==4){window.location.href="./index.php?act=login";return}if(r==5){n.warning(u);return}a(e)})}}var i=window.DB.leng,s=n.dialog,o="user_footprint_ok_form",u=i=="zh"?"对不起！您最多关注50个产品！":"Sorry, only 50 products at most in your attention.";return{open:f}});