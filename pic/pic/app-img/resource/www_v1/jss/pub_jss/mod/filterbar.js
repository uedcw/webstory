define(["jquery"],function(e){function n(){e("a.setch_b").click(function(){e("a.setch_b.c").removeClass("o"),e(this).toggleClass("o")}),e("#set_gj_types").height()>33&&e("#state_control").show();var n=e("#set_gj_types").height();e("#state_control").on("click",function(){var t=e(this),r=t.data("st").toInt(),i=30;r?(r=0,e("#set_gj_types_muz").show(),e("#set_gj_types").find("a").removeClass("s")):(i=n,r=1),t.data("st",r).toggleClass("up"),e("#state_txt_1,#state_txt_2").toggle(),e("#setgj_box").height(i),e("#float_filter_parent").height(e("#float_filter").height()+32)}),e(".muzk").on("click",function(){var t=e(this),r=t.data("oid");e(".muzk:hidden").each(function(){var t=e(this).show(),n=t.data("oid");e("#"+n+"_oks").hide(),e("#"+n).find("a").removeClass("c s"),n==="set_gj_types"&&e("#setgj_box").height(30)}),r==="set_gj_types"?(e("#state_control").data("st",1).addClass("up"),e("#state_txt_1").hide(),e("#state_txt_2").show(),e("#setgj_box").height(n+35),e("#float_filter_parent").height(e("#float_filter").height())):e("#float_filter_parent").height(e("#float_filter").height()+32),t.hide(),e("#"+r+"_oks").show(),e("#"+r).find("a").addClass("s")}),e("a.setch_a").click(function(t){var n=e(this);if(n.hasClass("s")||n.hasClass("c")){t.preventDefault(),n.toggleClass("s c");return}});var r=e("#on_casno").text();e(".setoks").on("click",function(){var n={};e("#set_sup_types, #set_ldt_types, #set_dw_types, #set_sjg_types, #set_gj_types, #set_sort_box").each(function(){var t=e(this),r=this.id,i=t.data("input"),s=[];t.find("a.c, a.o").each(function(){var t=e(this).data("val");s.push(t)}),s.length&&(n[i]=s.join("-")),s=null});var i="cas-"+r+"-cate";e.each(n,function(e,t){i+="-"+e+"n"+t});var s="/"+t+"/"+i+".html";window.location.href=s}),e(".setcan").on("click",function(){var t=e(this),n=t.data("oid");e("#"+n+"_oks").hide(),e("#"+n).find("a").removeClass("s c"),n==="set_gj_types"&&e("#state_control").click(),e("#"+n+"_muz").show()})}var t=window.DB.leng;return{init:n}});