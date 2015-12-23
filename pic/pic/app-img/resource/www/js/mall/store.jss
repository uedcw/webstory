//店铺页面提交排序类型
function a_submit(id){
    var now_id;
    var old_id =  parseInt($('#rank_form input[name="rank_type"]').val());
    id = parseInt(id);
    if(id==old_id){
        if(id>3){
            now_id = id-3;
        }else{
            now_id = id+3;
        }
    }else{
        now_id = id;
    }
    
  $('#rank_form input[name="rank_type"]').val(now_id);
  $('#submit_id').trigger('click');
}

//店铺页面，搜索栏出发form提交
function serach_submit(){
      var value =   $('#search_text_id').val();
      if(value==""||typeof(value)=='undefined'){
         alert("请先输入cas号或者商品名称！");
         return false;
      }
     return true;
}
//店铺页面截取热门商品长度
$(document).ready(function(){
    $('.product_name').each(function(){
        if($(this).text().length>30){
            var shorttext = $(this).text().substring(0,30);
            $(this).text(shorttext);
        }
    })
})
$(window).load(function(){
    $('.product_pic').each(function(){
       var obj = $(this);
       pimsize(obj,160,160);
    })
    })
//根据图片尺寸判断使用哪种缩放方式                 
function pimsize(img,widths,heights){
    var w;
    var h;
    //window.alert(picimg.width);
    //window.alert(picimg.height);
    var w  = parseFloat(img.css('width').replace('px', ''));
    if(w>160){
        img.css('width','160px');
        }
    var h = parseFloat(img.css('height').replace('px', ''));
    if(h>160){
        img.css('height','160px');
        }
}