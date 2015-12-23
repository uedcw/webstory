define(['jquery'], function($){
/*
    搜索框自动完成
*/
    var UP_AUTOC_LAYER=null,
        UP_AUTOC_OBJ=null,
        UP_AUTOC_DAT=null,
        UP_AUTOC_LII=-1,
        UP_AUTOC_TXT='',
        LENG=window['DB'].leng;

    function c_auto_complete_html(d){
        UP_AUTOC_LAYER=$('<ul id="'+d+'"></ul>').appendTo(document.body).on('mouseenter','li',function(){
            var eo=$(this);
            UP_AUTOC_LII=eo.index();
            eo.siblings().removeClass('current');
            eo.addClass('current');
        }).on('mouseleave','li',function(){
            $(this).removeClass('current');
        }).on('click','li',function(){
            var t=UP_AUTOC_DAT[$(this).index()].keys
            UP_AUTOC_OBJ.val(t);
            UP_AUTOC_LAYER.hide();
            $('#form1-top-search').submit();
        });
    }

    function bind_auto_complete_document(event){
        try{
            if(event.target.parentNode.id=='auto_complete_layer'){
                return;
            }
            UP_AUTOC_LAYER.hide();
        }catch(e){
        }
    }

    function init(){
        $('input.s_key_input').focus(function(){
            $(document).on('mousedown',bind_auto_complete_document);
        }).blur(function(){
            $(document).off('mousedown',bind_auto_complete_document);
        }).on('keyup',function(event){
            var j=event.which;
            if(j==13)return;
            if(j==38 || j==40)
            {
                try{
                if(!UP_AUTOC_LAYER.length || UP_AUTOC_LAYER.is(':hidden'))return;
                }catch(e){return;}
                var li=UP_AUTOC_LAYER.find('li');
                var len=li.length;
                var ii=UP_AUTOC_LII;
                if(j==38){//up
                    UP_AUTOC_LII--;
                }else{
                    UP_AUTOC_LII++;
                }
                if(UP_AUTOC_LII>=len || UP_AUTOC_LII<0){
                    UP_AUTOC_LII=(j==38)?len:-1;
                }
                if(UP_AUTOC_LII===-1 || UP_AUTOC_LII===len){
                    UP_AUTOC_OBJ.val(UP_AUTOC_TXT);
                    li.removeClass('current');
                    return;
                }
                if(ii!==-1){
                    li.eq(ii).removeClass('current');
                }
                var t=li.eq(UP_AUTOC_LII).addClass('current').text();
                UP_AUTOC_OBJ.val(UP_AUTOC_DAT[UP_AUTOC_LII].keys);
                return;
            }

            UP_AUTOC_OBJ=$(this);
            var v=UP_AUTOC_OBJ.val();

            if(v.length<3){
                try{
                UP_AUTOC_LAYER.hide();
                }catch(e){
                    return;
                }
                return;
            }
            if(v===UP_AUTOC_TXT)return;
            UP_AUTOC_TXT=v;
            var d='auto_complete_layer';
            if(!$('#'+d).length){
                c_auto_complete_html(d);
            }
            var htm='';

            $.get('/'+LENG+'/search.html?search_type=text&search_type=remind&lang='+LENG,{search_keyword:v},function(rs){
                if(!rs.done)return;
                if(rs.retval.len){
                    UP_AUTOC_DAT=rs.retval.rows;
                    $.each(rs.retval.rows,function(ii,row){
                        htm+='<li>'+row.connect+'</li>';
                    });
                    var xy=UP_AUTOC_OBJ.offset();
                    UP_AUTOC_LAYER.html(htm).css({width:(UP_AUTOC_OBJ.outerWidth()-2),left:xy.left, top:(xy.top+UP_AUTOC_OBJ.outerHeight()),display:'block'});
                }else{
                    UP_AUTOC_LAYER.hide();
                }
            },'json');
        });
    };

    return {
        init:init
    }
});
