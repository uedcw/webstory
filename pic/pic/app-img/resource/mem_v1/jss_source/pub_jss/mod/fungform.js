define(['jquery','nicescroll'],function($){
/*
	首页官能团
*/
	var is_init=false,
		obj=null,
		sc_obj=null,
		sc_pos=[/*0-9*/0,/*A	*/212, /*B	*/1537, /*C	*/1745, /*D	*/2107,
				/*E	*/2488, /*G	*/2690, /*H	*/2905, /*I	*/3435, /*K	*/3801,
				/*L	*/4016, /*N	*/4230, /*O	*/4597, /*P	*/4811, /*Q	*/5494,
				/*S	*/5708, /*T	*/6390, /*U	*/7009],
        get_data=function(){
            return $.trim($('#_gs_db_').val());
        },
        get_obj=function(){
            if(!obj || !obj.length){
                obj=$("#imain_gs_main");
            }
            return obj;
        },
        get_sc=function(){
            return sc_obj;
        },
        init=function(){
            if(is_init){
                obj.show();
                obj.getNiceScroll().show();
                return;
            }

            $('#tab_gs_box').html(get_data());
            window.setTimeout(function(){
                sc_obj=get_obj().niceScroll({
                    background:'#bfbfbf',
                    cursorborder:'1px #bebebe solid',
                    cursorcolor:"#fff",
                    cursorborderradius:4,
                    cursoropacitymin:0.6,
                    cursorwidth:7,
                    autohidemode:'cursor',
                    doScrollTopFun:function(y){
                        //document.title=y;
                    }
                });
            },1);

            $('li.gs_aimg').on('click',function(){
                var eo=$(this);
                var vv=eo.data('vv');
                var idt='sitem_'+vv;
                if(!eo.hasClass('c'))
                {
                    $('#select_ok_items').append('<input type="hidden" id="'+idt+'" name="function_group[]" value="'+vv+'" />');
                    eo.addClass('c');
                }
                else
                {
                    $('#'+idt).remove();
                    eo.removeClass('c');
                }
            });

            $('#imain_gs_main_zm').on('click','li',function(){
                var eo=$(this);
                var t=eo.index();
                $('#imain_gs_main_zm').find('a').removeClass('c');
                eo.find('a').addClass('c');
                sc_obj.doScrollTop(sc_pos[t]);
            });

            $('#gs_form3').submit(function(){
                $('#gs_tips_msg').hide();
                var len=$('#select_ok_items input').length;
                if(len==0)
                {
                    $('#gs_tips_msg').show();
                    return false;
                }
                return true;
            });

            is_init=true;
	}

	return {
        get_sc:get_sc,
		get_obj:get_obj,
		init:	init
	}
});
