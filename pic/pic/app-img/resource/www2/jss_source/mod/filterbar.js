define(['jquery'], function($){
/*
    CAS筛选工具条
*/
    var leng=window['DB'].leng;

    function init(){

        //筛选: Lead Time
        $('a.setch_b').click(function(){
            $('a.setch_b.c').removeClass('o');
            $(this).toggleClass('o');
        });

        //筛选: 国家
        if($('#set_gj_types').height()>33){
            $('#state_control').show();
        }
        var state_main_height=$('#set_gj_types').height();
        $('#state_control').on('click',function(){
            var eo=$(this);
            var st=eo.data('st').toInt();
            var mh=30;
            if(!st){
                mh=state_main_height;
                st=1;
            }else{
                st=0;
                $('#set_gj_types_muz').show();
                $('#set_gj_types').find('a').removeClass('s');
            }
            eo.data('st',st).toggleClass('up');
            $('#state_txt_1,#state_txt_2').toggle();
            $('#setgj_box').height(mh);
            $('#float_filter_parent').height($("#float_filter").height()+32);
        });

        //筛选: 更多展开
        $('.muzk').on('click',function(){
            var eo=$(this);
            var oid=eo.data('oid');
            $('.muzk:hidden').each(function(){
                var oo=$(this).show();
                var od=oo.data('oid');
                $('#'+od+'_oks').hide();
                $('#'+od).find('a').removeClass('c s');
                if(od==='set_gj_types'){
                    $('#setgj_box').height(30);
                }
            })
            if(oid==='set_gj_types'){
                $('#state_control').data('st',1).addClass('up');
                $('#state_txt_1').hide();
                $('#state_txt_2').show();
                $('#setgj_box').height(state_main_height+35);
                $('#float_filter_parent').height($("#float_filter").height());
            }else{
                $('#float_filter_parent').height($("#float_filter").height()+32);
            }

            eo.hide();
            $('#'+oid+'_oks').show();
            $('#'+oid).find('a').addClass('s');
        });

        //筛选: 规格
        $('a.setch_a').click(function(event){
            var eo=$(this);
            if(eo.hasClass('s') || eo.hasClass('c')){
                event.preventDefault();
                eo.toggleClass('s c');
                return;
            }
        });

        //筛选: 设置确定
        var on_casno=$('#on_casno').text();
        $('.setoks').on('click',function(){
            var ages={};
            $('#set_sup_types, #set_ldt_types, #set_dw_types, #set_sjg_types, #set_gj_types, #set_sort_box').each(function(){
                var eeo=$(this);
                var eid=this.id;
                var nam=eeo.data('input');
                var ags=[];
                eeo.find('a.c, a.o').each(function(){
                    var vv=$(this).data('val');
                    ags.push(vv);
                });
                if(ags.length){
                    ages[nam]=ags.join('-');
                }
                ags=null;
            });

            var lnk='cas-'+on_casno+'-cate';
            $.each(ages,function(i,o){
                lnk+='-'+i+'n'+o;
            });
           // alert(lnk);
            //var urls='/'+leng+'/search.html?search_keyword='+on_casno+'&'+$.param(ages);
            var urls='/'+leng+'/'+lnk+'.html';
            window.location.href=urls;
        });

        //筛选: 关闭更多的设置层
        $('.setcan').on('click',function(){
            var eo=$(this);
            var oid=eo.data('oid');

            $('#'+oid+'_oks').hide();
            $('#'+oid).find('a').removeClass('s c');
            if(oid==='set_gj_types'){
                $('#state_control').click();
                //$('#setgj_box').height(30);
            }
            $('#'+oid+'_muz').show();
        });
    }

    return {
        init:init
    }
});
