function a_submit(t){var e;var i=parseInt($('#rank_form input[name="rank_type"]').val());t=parseInt(t);if(t==i){if(t>3){e=t-3}else{e=t+3}}else{e=t}$('#rank_form input[name="rank_type"]').val(e);$("#submit_id").trigger("click")}function serach_submit(){var t=$("#search_text_id").val();if(t==""||typeof t=="undefined"){alert("请先输入cas号或者商品名称！");return false}return true}$(document).ready(function(){$(".product_name").each(function(){if($(this).text().length>30){var t=$(this).text().substring(0,30);$(this).text(t)}})});$(window).load(function(){$(".product_pic").each(function(){var t=$(this);pimsize(t,160,160)})});
//根据图片尺寸判断使用哪种缩放方式                 
function pimsize(img,widths,heights){
    var w;
    var h;
    //window.alert(picimg.width);
    //window.alert(picimg.height);
	var w  = parseFloat(img.css('width').replace('px', ''));
	var h = parseFloat(img.css('height').replace('px', ''));
    if(h>w&&h>160){
        img.css('height','160px');
        return;
        }
    if(w>h&&w>160){
        img.css('width','160px');
        return;
    }
	if(w=h&&w>160){
		img.css('width','160px');
        return;
		}
}