define(['jquery','cookie'], function($){
/*
    CAS页 引导层
*/
    var isInit=false,
        leng=window['DB'].leng;

    var guide_steps={
        data:[
            {left:190, top:-194, id:'float_filter'},
            {left:50, top:-204, id:'guide_step_2'},
            {left:50, top:-204, id:'guide_step_3'}
        ],
        on_step:0,
        on_txt:null,
        setp_len:3,
        setp_lay:$('#step_lay'),
        step_mat:$('#step_mat'),
        step_box:$('#step_box'),
        cone_but:null,
        step_eo4:null,
        init:function(){
            isInit=true;
            this.setp_lay.show();
            if($('.guide_step_4').length){
                this.data.push({left:0, top:0, id:'guide_step_4'});
                this.step_box.find('.ck1').hide();
                this.step_box.find('.tc').text(4);
            }
            this.setp_len=this.data.length;
            this.step_box.find('.buts_def1').on('click',function(){
                guide_steps.next();
            });
            $('#step_box_close').on('click',function(){
                guide_steps.close();
            });
            guide_steps.next();
        },
        close:function(){
            this.on_step++;
            this.clean();
            if(this.cone_but){
                this.cone_but.remove();
            }
            $('#step_lay,#step_lay1,#step_lay2,#step_lay3,#step_mat,#step_mat1,#step_box').hide();
            $('#step_lay').trigger('myclose');
            $.cookie('g_step_tmp', 1,{
                expires:30*12,
                path:'/'
            });//当前浏览器进程关闭
            $.post('/?app=search&act=ajax_set_user_display',function(rs){
                return true;
            });
        },
        clean:function(){
            var step=this.on_step-1;
            try{
                var db=this.data[(step - 1)];
                if(!db)throw new Error('end');
            }catch(e){
                if(this.eo4){
                    this.eo4.removeClass('step_pos');
                }
                return;
            }

            var eo=$('#'+db.id);
            this.on_txt.hide();
            if(step===2){
                $('#step_lay1').hide();
                eo.removeClass('step_pos');
                return;
            }else if(step===3){
                $('#step_lay1').hide();
                eo.add(eo.next()).removeClass('step_pos');
                return;
            }else{
                eo.removeClass('step_pos');
                return;
            }
        },
        next:function(){
            this.on_step++;
            try{
                var db=this.data[(this.on_step-1)];
                if(!db)throw new Error('end');
            }catch(e){
                guide_steps.close();
                return;
            }
            if(this.on_step>1){
                this.clean();
            }

            var eo4len=0;
            if(this.on_step===4){
                this.eo4=$('.'+db.id);
                eo4len=this.eo4.length;
                if(!eo4len){
                    this.step_box.removeClass('step_box'+(this.on_step-1));
                    return;
                }
                var eo=this.eo4.eq(0);
            }
            else{
                var eo=$('#'+db.id);
            }

            var ow=eo.width();
            var oh=eo.height();
            var xy=eo.offset();
            this.step_box.find('.txt').hide();
            this.on_txt=this.step_box.find('.txt'+this.on_step).show();
            this.step_box.find('.in').text(this.on_step);
            this.step_box.removeClass('step_box'+(this.on_step-1)).addClass('step_box'+this.on_step).css({
                left:xy.left+db.left,
                top:xy.top + db.top,
                display:'block'
            });

            this.step_mat.add('#step_lay2').css({
                width:ow,
                height:oh,
                left:xy.left,
                top:xy.top,
                display:'block'
            });

            if(this.on_step===2){
                $('#step_lay1').css({
                    width:718,
                    height:32,
                    left:xy.left+480,
                    top:xy.top,
                    display:'block'
                });
                eo.addClass('step_pos');
                return;
            }else if(this.on_step===3){
                if(this.setp_len===3)
                {
                    $('#step_box_next').text(function(){
                        return $(this).data('txt');
                    });
                }
                var ohh=(oh + 21) * 2;
                this.step_mat.add('#step_lay2').css({
                    width:ow,
                    height:ohh,
                    left:xy.left,
                    top:xy.top,
                    display:'block'
                });
                $('#step_lay1').css({
                    width:180,
                    height:ohh,
                    left:xy.left+1020,
                    top:xy.top,
                    display:'block'
                });
                eo.add(eo.next()).addClass('step_pos');
                return;
            }else if(this.on_step===4){
                $('#step_box_next').text(function(){
                    return $(this).data('txt');
                });
                if(eo4len===1){
                    if(eo.hasClass('buts-bt1')) //推荐价
                    {
                        this.cone_but=this.eo4.clone().css({
                            position:'absolute',
                            'z-index':999922,
                            left:xy.left,
                            top:xy.top
                        }).appendTo(document.body);
                        this.step_mat.add('#step_lay2').css({
                            width:ow+15,
                            height:oh,
                            padding:5,
                            left:xy.left - 5,
                            top:xy.top - 4,
                            display:'block'
                        });
                        this.step_box.addClass('step_box4_1').css({
                            left:xy.left+155,
                            top:xy.top-20
                        });
                    }else{
                        this.step_mat.add('#step_lay2').css({
                            width:105,
                            height:36,
                            left:xy.left - 5,
                            top:xy.top - 4,
                            display:'block'
                        });
                        this.step_box.addClass('step_box4_2').css({
                            left:xy.left-260,
                            top:xy.top-250
                        });
                    }

                }else if(eo4len===2){
                    this.cone_but=this.eo4.eq(0).clone().css({
                        position:'absolute',
                        'z-index':999922,
                        left:xy.left,
                        top:xy.top
                    }).appendTo(document.body);
                    this.step_mat.add('#step_lay2').css({
                        width:ow+15,
                        height:oh,
                        padding:5,
                        left:xy.left - 5,
                        top:xy.top - 4,
                        display:'block'
                    });
                    var eo2xy=this.eo4.eq(1).offset();
                    $('#step_mat1,#step_lay3').css({
                        width:105,
                        height:36,
                        left:eo2xy.left - 5,
                        top:eo2xy.top - 4,
                        display:'block'
                    });
                    this.step_box.css({
                        left:xy.left+ (leng=='zh'?90:155),
                        top:xy.top-20
                    });
                }
                this.eo4.addClass('step_pos');
                return;
            }else{
                eo.addClass('step_pos');
                return;
            }
        }
    };

    return {
        init:function(){
            if(isInit)return;
            if($.cookie('g_step_tmp')){
                isInit=true;
                $('#step_lay').trigger('myclose');
                return;
            }
            guide_steps.init();
        }
    }
});