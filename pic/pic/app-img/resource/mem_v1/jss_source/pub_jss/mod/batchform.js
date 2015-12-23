define(['jquery', 'oninputchange'],function($){
/*
	首页批量搜索
*/

    var is_init=false,
        c2=$('#c2'),			//输入框
        ro=$('#ser_li'),
        ua=window['UA'],
        isGG=ua.isGG,
        isSA=ua.isSA,
        isIE=ua.isIE,
        leng=window['DB'].leng,
        msg=leng=='zh'?'请输入关键字':'Please enter a keyword';		//行号

    var change=function(isr){	//更新批量搜索行号
        isr=isr||0;
        var v=c2.val();
        if(isr){
            v=v.rtrim();
        }
        v=v.replace(/\r/gi,'').split('\n');
        var len=v.length;
        ro.val(function(){
            var t=[];
            for(var i=1; i<=len; i++){
                t.push(i);
            }
            return t.join('\n');
        }).scrollTop(c2.scrollTop());
    }

    var init=function(){
        if(is_init) return;
        is_init=true;

        c2.focus(function(){
            var ev=c2.val();
            var dv=c2.data('defv');
            if(!dv){
                c2.val('');
                c2.data('defv',1);
                change();
            }
            c2.removeClass('grey');
        }).onInputChange(function(v,eo){
            change();
        }).scroll(function(){
            ro.scrollTop(c2.scrollTop());
        });

        $('#batchform').submit(function(){ //批量搜索提交
            var c=$.trim(c2.val());
            if(c==''){
                alert(msg);
                c2.focus();
                return false;
            }
            return true;
        });

        change(1);//初始化

        $('#batch_example1, #batch_example2').click(function(){
            var is_example1=this.id==='batch_example1';
            var xy=$(this).position();
            if(is_example1)
            {
                $('#batch_form_content_tips2').hide();
                if(leng=='zh')
                {
                    if(isGG || isSA){
                        $('#batch_form_content_tips1').css({'top':xy.top+30,'left':xy.left-250}).find('i').css({'left':xy.left-70});
                    }
                    if(isIE){
                        $('#batch_form_content_tips1').css({'top':xy.top+30,'left':xy.left-250}).find('i').css({'left':xy.left-70});
                    }
                }
                else{
                    $('#batch_form_content_tips1').css({'top':xy.top+30}).find('i').css({'left':xy.left-10});
                }
                $('#batch_form_content_tips1').toggle();
            }
            else
            {
                $('#batch_form_content_tips1').hide();
                $('#batch_form_content_tips2').css({'top':xy.top+30}).find('i').css({'left':xy.left-10});
                $('#batch_form_content_tips2').toggle();
            }

        });
        $('.batch_tips_close').click(function(){
            $(this).parent().hide();
        });
	};

	return {
		init:	init
	}
});
