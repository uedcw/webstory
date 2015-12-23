define(['module','jquery','message','loginwin','inquiryckmail'], function(module, $, message, loginwin, inquiryckmail){
/*
    inquiryckmail // 询单用户邮箱验证处理
    询单(弹)层
*/

    var dialog=message.dialog;
    var LENG=window['DB'].leng;
    var PAGE_ON_APP=window['DB'].page.app;
    var page_type_inquire=(function(){

        //acc   batchsearch-index   batch
        //acc   search-index        view

        var acc=window['DB'].page.acc;
        if($('#top_main_goods_span').length)    return 'goods'; // 关健字搜索页
        if(acc==='search-index' || acc==='moldata_information-view')                return 'view';  // CAS 列表页 //字典
        if(acc==='batchsearch-index')           return 'batch'; // 批量搜索页
    })();
//    alert(page_type_inquire)

    if(LENG==='en'){
        var win_add_order_form_title='Inquiry with Reference Price';
        var win_add_order_form_done_title='Inquiry with Reference Price';
        var one_inquiry_but_title='For the selected product with the same supplier, you can only Inquiry ONCE within a day';
    }else{
        var win_add_order_form_title='参考价询单';
        var win_add_order_form_done_title='参考价询单';
        var one_inquiry_but_title='对同一个供应商的同一个产品，您一天内只可以询单一次';
    }

    var login_reference_prices=0;
    var up_open_inquire_itemid=-1;
    var win_add_order_form_done_title_is_resbut=0;
    var win_add_order_form_done_is_reload=0;
    var tpl='win_add_order_form';

    if('store-index,store-search,store-topsell,search-search_big_goods'.inc(window['DB'].page.acc)){
        login_reference_prices=1;
    }
    if($('#top_main_goods_span').length){
        login_reference_prices=1;
    }


    // GA 统计代码
    function sendGApageview(tp){
    /*
    cas页面的一般询盘标记为： /JS/cas_search/inquiry
    cas页面的价格询盘标记为：/Js/cas_search/price_inquiry

    关键词页面的一般询盘标记为：/Js/txt_search/inquiry
    关键词页面的价格询盘标记为：/Js/txt_search/price_inquiry

    批量搜索页面的发送所有询盘标记为：/Js/batch_search/all_inquiry
    批量搜索页面的一般产品询盘标记为：/Js/batch_search/inquiry
    */
        if(typeof ga==='undefined')return;

        var txt='';
        if(tp==='d1'){
            txt='/js/cas_search/inquiry';
        }
        else if(tp==='d2'){
            txt='/js/cas_search/price_inquiry';
        }
        else if(tp==='d3'){
            txt='/js/txt_search/inquiry';
        }
        else if(tp==='d4'){
            txt='/js/txt_search/price_inquiry';
        }
        else if(tp==='d5'){
            txt='/js/batch_search/all_inquiry';
        }
        else if(tp==='d6'){
            txt='/js/batch_search/inquiry';
        }
        else if(tp==='d7'){ //价格CAS
            txt='/js/txt_search/price_inquiry_price';
        }
        else if(tp==='d8'){ //价格STR
            txt='/js/txt_search/price_inquiry';
        }
        else{
            return;
        }
        try{
            //console.log(txt);
            ga('send', 'pageview','/'+LENG+txt);
        }catch(e){
        }
    }


    // 单个询单弹层
    function inquiry_form_win(){
        var eo=$(this);
        //是否推荐按钮
        var is_resbut=win_add_order_form_done_title_is_resbut=eo.hasClass('buts-bt1');
        if(eo.hasClass('jg') && eo.is('a')){
            is_resbut=win_add_order_form_done_title_is_resbut=true;
        }

        var itemid=eo.data('itemid');
        if(page_type_inquire!=='batch'){
            if(!$('#one_inquiry_but_'+itemid).length)return;
        }

        var rid=eo.data('rid');
        var arjg=eo.data('arjg').toInt();
        var eo_is_price=!(typeof(eo.attr("data-price"))==="undefined"); //是否为价格触发

        if(page_type_inquire=='view'){ //Cas页
            var tmps_but=$('#one_inquiry_but_'+itemid);
            if(!tmps_but.length || tmps_but.prop('disabled'))return;
            if(is_resbut){//推荐
                sendGApageview('d2');
            }else{//单个
                sendGApageview( (eo_is_price?'d7':'d1') );
            }
        }else if(page_type_inquire=='goods'){//关键字搜索页
            if(is_resbut){//推荐
                sendGApageview('d4');
            }else{//单个
                var tmps_but=$('#one_inquiry_but_'+itemid);
                if(!tmps_but.length || tmps_but.prop('disabled'))return;
                sendGApageview( (eo_is_price?'d8':'d3') );
            }
        }else if(page_type_inquire=='batch'){//批量搜索
            sendGApageview('d6');
        }

        message.win(tpl, function(){
            var win=this;
            var ohs=$('#'+tpl);

            win.title(win_add_order_form_done_title_is_resbut?win_add_order_form_done_title:win_add_order_form_title);

            // 如果点击ID不同则对部份信息重置
            if(up_open_inquire_itemid!==itemid){
                $("s.tps",'#'+tpl).hide();

                // 实例化数据
                //var gdb=JSON.parse($('#_jd_'+itemid).val().replace(/^.+。\{"/, '{"'));
                var gdb=INQUIRY_PG_DATA['_jd_'+itemid];
                var glen=0;
                var slis=[];
                var purity='';

                // 处理供应商列表
                $.each(gdb,function(i,o){
                    var ogid=o.goods_id;
                    var dats=[ogid, o.store_id, o.goods_mol_id, o.casrn].join(',');
                    var laid='iracb_g_'+ogid;
                    //var hcss=' class="g-hidden"';
                    var hcss = '';
                    var readonly='';
                    var checked='';
                    if(!glen){
                        purity=o.purity;
                        hcss='';
                        readonly=is_resbut?'':' disabled="disabled"';
                        checked=' checked="checked"';
                    }
                    slis.push('<li'+hcss+' style="font-size:15px;"><input class="iracb" type="checkbox" id="'+laid+'" name="order_gids" value="'+dats+'"'+checked+readonly+' /><label for="'+laid+'">'+o.store_name+'</label></li>');
                    glen++;
                });

                // 绑定事件
                if(!ohs.data('bind')){
                    ohs.data('bind',1);

                    $('#close_'+tpl).on('click',function(){
                        dialog.get(tpl+'_win').remove();    //绑定关闭窗口时要用remove();
                    });

                    $('#supplierlists_'+tpl).on('change',':checkbox',function(){
                        if($('#supplierlists_'+tpl).find(':checkbox:checked').length){
                            $('#submit_'+tpl).prop('disabled', false).removeClass('d');
                        }else{
                            $('#submit_'+tpl).prop('disabled', true).addClass('d');
                        }
                    });

                    // 登录名验证
                   // inquiryckmail.init($("[name='order_from']",'#'+tpl), $("[name='order_company']",'#'+tpl));

                    // 绑定提交事件
                    $('#forms_'+tpl).submit(inquiry_form_submit);
                }

                // 当前用户
                if(login_user_email){
                    $("[name='order_from']",'#'+tpl).val(login_user_email).addClass('d');
                }

                // 当前用户的公司
                if(login_company_name){
                    $("[name='order_company']",'#'+tpl).val(login_company_name).addClass('d');
                }

                // 当前询单的联系人
                if(login_link_man){
                    $("[name='link_man']",'#'+tpl).val(login_link_man);
                }

                // 当前询单的联系人电话
                if(login_link_tel){
                    $("[name='link_tel']",'#'+tpl).val(login_link_tel);
                }

                // 纯度
                $("[name='order_purity']",'#'+tpl).val(purity);

                // 当前询单商品的 CAS 号
                try{
                var on_cas=$.trim(gdb[0].casrn);
                }catch(e){
                var on_cas=$.trim($('#listcas_'+rid).text());
                }
                on_cas=on_cas?' ('+on_cas+')':'';

                // 当前询单商品名称
                var on_goods_name=$.trim($('#listnam_'+rid).text());
                $("[name='order_product']",'#'+tpl).val(on_goods_name.leftB(37,1) + on_cas).addClass('d');

                $('#supplierlists_'+tpl).empty().append(slis.join(''));
                if(glen>1){
                    //ohs.find('.buts_win_more').show();
                    ohs.find('.valigntop').attr('valign','top');//修下供应商列表单行和多行的行高对 齐
                }else{
                    ohs.find('.buts_win_more').hide();
                    ohs.find('.valigntop').attr('valign','middle');
                }
                if(is_resbut){
                    ohs.find('.buts_win_more').click();
                    $('#supplierlists_'+tpl).find(':checkbox').prop('checked',true);
                }
                ohs.find(':input.d').prop('readonly',true);

                // 记录上次打开的节点.
                up_open_inquire_itemid=itemid;
            }// 重置结束

            $("[name='order_price']",'#'+tpl).val('');
            var eo_num=$.trim(eo.data('num'));
            var eo_unit=$.trim(eo.data('unit'));
            var eo_price=$.trim(eo.data('price'));

            // 数量处理
            if(eo_num){
                $("[name='order_quantity']",'#'+tpl).val(eo_num);
            }

            // 单位处理
            if(eo_unit){
                $("[name='order_quantity_unit']",'#'+tpl).val(eo_unit);
            }

            // 价格处理
            if(eo_price){
                $("[name='order_price']",'#'+tpl).val(eo_price);
                $('.price_win_add_order_form').show();
            }else{
                $('.price_win_add_order_form').hide();
                if(typeof(eo.attr("data-price"))==="undefined")
                {
                    var reference_price=login_reference_prices ? login_reference_price[rid] : login_reference_price;
                    if($.isArray(reference_price) && reference_price.length){
                        try{
                            var reference_price_select=$('#reference_price_select_'+rid).val().toInt();
                        }catch(e){
                            var reference_price_select=0;
                        }
                        var _order_price=reference_price[arjg][reference_price_select];
                        var _eo_unit=_order_price.split("/")[1];
                        _eo_unit=_eo_unit.replace(_eo_unit.replace(/[μg|mg|g|kg|ton|μl|ml|l|u|ku|iu]/ig,''),'');
                        $("[name='order_price']",'#'+tpl).val(_order_price);
                        $("[name='order_quantity_unit']",'#'+tpl).val(_eo_unit.toLowerCase());
                        $('.price_win_add_order_form').show();
                    }else{
                        $('.price_win_add_order_form').hide();
                    }
                }
            }

            // 批量询单处理
            if(PAGE_ON_APP=='batchsearch'){
                var tr=$('#table_tr_'+rid);
                var item_set_num=tr.find('.item_set_num').val();
                var item_set_num_unit=tr.find('.item_set_num_unit').val();
                var item_set_purity=tr.find('.item_set_purity').val();
                var item_set_price=$.trim(tr.find('.item_set_price').val());
                $("[name='order_quantity']",'#'+tpl).val(item_set_num);
                $("[name='order_quantity_unit']",'#'+tpl).val(item_set_num_unit);
                $("[name='order_purity']",'#'+tpl).val((item_set_purity=='other'?'':item_set_purity));
                if(item_set_price){
                    $("[name='order_price']",'#'+tpl).val(item_set_price);
                    $('.price_win_add_order_form').show();
                }
            }

            $('#submit_'+tpl).prop('disabled', false).removeClass('d');

            // 处理窗口打开时的焦点
            ohs.find(':text').each(function(){
                var tos=$(this);
                if(!tos.prop('readonly')){
                    tos.focus();
                    return false;
                }
            });
        },
        // 关闭窗口时
        function(){
            var goods_id=$.trim($(':checkbox[name="order_gids"]:first').val()).split(',')[0];
            $.post('./index.php?app=search&act=add_recently',{goods_id:goods_id},function(rs){
                // 不做任何处理
            });
        }

        // message.win END
        );
    };


    // 询单完成时
    function inquiry_done(rs, isSendGa){
        if(isSendGa)
        {
            // 发送GA统计
            var ga_tpe=win_add_order_form_done_title_is_resbut?'quick_reference_price_ok':'order_buying_ok';
            var ga_url='/?app=order&act='+ga_tpe+'&tps=iframe&buy_email='+login_user_email;
            $('#google_ga_iframe').attr('src',ga_url);

            // 关闭窗口
            try{
            dialog.get(tpl+'_win').remove();
            }catch(e){}
        }

        // 设置询单按钮为disabled状态
        if(up_open_inquire_itemid>0){
            $('#one_inquiry_but_'+up_open_inquire_itemid).addClass((login_reference_prices?'d':'buts-xd-d')).attr('title',one_inquiry_but_title).prop('disabled',true);
        }

        // 打开询单成功窗口
        var ok_tpl='win_add_order_form_done';
        if(rs.msg==='EMAIL_VERIFY'){
            ok_tpl='win_add_order_form_done2';
        }

        message.win(ok_tpl, function(){
            var win=this;

            // 绑定关闭按钮事件
            $('#close_'+ok_tpl).on('click',function(){
                dialog.get(ok_tpl+'_win').remove();    //绑定关闭窗口时要用remove();
            });

            try{
            // 处理"询盘状态"的链接
            $('#url_'+ok_tpl).attr('href',function(i,v){
                return v.replace('##I##',rs.retval[0]).replace('##T##',1);
            });

            // 处理"查看我的询盘"链接
            $('#burl_'+ok_tpl).attr('data-burl',function(i,v){
                return v+'1';
            });
            }catch(e){
            }
            win.title(win_add_order_form_done_title_is_resbut?win_add_order_form_done_title:win_add_order_form_title);
        },function(){
            window.location.reload();
        });
    }


    // 询单表单提交
    function inquiry_form_submit(){
        $("s.tps",'#'+tpl).hide();
        var order_from_obj=$("[name='order_from']",'#'+tpl);
        var order_from=$.trim(order_from_obj.val());                    // s|发件人
        var order_company_obj=$("[name='order_company']",'#'+tpl);
        var order_company=$.trim(order_company_obj.val());              // s|公司名称
        var order_quantity_obj=$("[name='order_quantity']",'#'+tpl);
        var order_quantity=$.trim(order_quantity_obj.val()).toInt();	// i|数量
        var order_purity_obj=$("[name='order_purity']",'#'+tpl);
        var order_purity=$.trim(order_purity_obj.val()).toInt();        // i|纯度
        var tips=$.trim($('#tips_'+tpl).val()).split("|$|");            // 获取提示信息

        // 当前用户邮件
        if(!login_user_email)
        {
            if(order_from=='')
            {
                order_from_obj.next('.tps').text(tips[1]).show();
                order_from_obj.focus();
                return false;
            }
            if(!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(order_from))
            {
                order_from_obj.next('.tps').text(tips[2]).show();
                order_from_obj.focus();
                return false;
            }
        }

        // 当前用户公司名
        if(!login_company_name && order_company=='')
        {
                order_company_obj.next('.tps').text(tips[3]).show();
                order_company_obj.focus();
                return false;
        }

        // 询单数量
        if(order_quantity<1)
        {
                order_quantity_obj.nextAll('.tps').text(tips[4]).show();
                order_quantity_obj.focus();
                return false;
        }

        // 纯度
        if(order_purity<1 || order_purity>100)
        {
                order_purity_obj.nextAll('.tps').text(tips[6]).show();
                order_purity_obj.focus();
                return false;
        }

        var link_man_obj=$("[name='link_man']",'#'+tpl);
        var link_man=$.trim(link_man_obj.val());                                                                // 联系人
        var link_tel_obj=$("[name='link_tel']",'#'+tpl);
        var link_tel=$.trim(link_tel_obj.val());                                                                // 联系电话
        var order_product=$.trim($("[name='order_product']",'#win_add_order_form').val());	                    // s|产品名称
        var order_quantity_unit=$.trim($("[name='order_quantity_unit']",'#win_add_order_form').val());          // s|单 位
        var order_purity=$.trim($("[name='order_purity']",'#win_add_order_form').val());                        // s|纯度
        var order_price=$.trim($("[name='order_price']",'#win_add_order_form').val());                          // s|参考价格
        var order_outers=$.trim($("[name='order_outers']",'#win_add_order_form').val());                        // s|备注
        var order_valid_day=$.trim($("[name='order_valid_day']:checked",'#win_add_order_form').val()).toInt();  // i|有效期
        var order_authorize=$("[name='order_authorize']:checked",'#win_add_order_form').length;                 // i|是否发推荐
        var order_gids=[];
        $(":checkbox[name='order_gids']",'#win_add_order_form').each(function(i,o){
            if($(this).is(':checked')){
                order_gids.push(this.value);
            }
        });

        var db={
            order_from:order_from,
            order_company:order_company,
            order_product:order_product,
            order_quantity:order_quantity,
            order_quantity_unit:order_quantity_unit,
            order_purity:order_purity,
            order_price:order_price,
            order_outers:order_outers,
            order_valid_day:order_valid_day,
            order_authorize:order_authorize,
            order_gids:order_gids,
            link_man:link_man,
            link_tel:link_tel
        };

    //	Aobj(db);return false;
        $('#submit_'+tpl).prop('disabled', true).addClass('d');
        $.post('/?app=order&act=proposelist',db,function(rs){
        // $.post('/?app=ajaxhtml&act=get_token',db,function(rs){
            // rs={"done":false,"msg":"no_login","retval":["\u60a8\u76841\u4e2a\u8be2\u76d8\u63d0\u4ea4\u5931\u8d25\uff1a\u8be5\u4ea7\u54c1\u5f53\u65e5\u5df2\u8be2\u76d8\u8d85\u8fc76\u4e2a\u4f9b\u5e94\u5546\u6216\u91cd\u590d\u8be2\u76d8"]};
            // 提交失败
            if(!rs.done){
                // 关闭窗口
                try{
                dialog.get(tpl+'_win').remove();
                }catch(e){}

                // 没登录时
                if(rs.msg==='no_login'){
                    loginwin.open({data:{
                        // 完成
                        cfun:function(rs){
                            login_user_email=rs.email;
                            login_company_name=rs.company;
                            order_from_obj.val(login_user_email);
                            order_company_obj.val(login_company_name);
                            inquiry_form_submit();
                            dialog.get('users_login_form_win').remove();
                            dialog.get('win_add_order_form_win').remove();
                        },
                        // 关闭
                        wfun:function(){
                            $('#submit_users_login_form').prop('disabled', false).removeClass('d');
                        },
                        // 初始化
                        init:function(){
                            $("[name='user_name']",'#users_login_form').val(order_from);
                        }
                    }});
                    return;
                // 超过每天6个时
                }else if(rs.msg==='more_than_six'){
                    var on_tpl='win_add_order_form_done1';
                    message.win(on_tpl,function(){
                        var win=this;

                        // 绑定关闭按钮事件
                        $('#close_'+on_tpl).on('click',function(){
                            dialog.get(on_tpl+'_win').remove();    //绑定关闭窗口时要用remove();
                        });

                        $('#msg_win_add_order_form_done1').html(rs.retval[0]);
                        win.title(win_add_order_form_done_title_is_resbut?win_add_order_form_done_title:win_add_order_form_title);
                    },function(){
                        window.location.reload();
                    });
                    return;
                // 公司名重复
                }else if(rs.msg==='company_repeat'){
                    var on_tpl='win_add_order_form_err';
                    message.win(on_tpl,function(){
                        var win=this;

                         // 绑定关闭按钮事件
                        $('#close_'+on_tpl).on('click',function(){
                            dialog.get(on_tpl+'_win').remove();    //绑定关闭窗口时要用remove();
                        });

                        $('#msg_win_add_order_form_err').html(rs.retval[0]);
                        win.title(win_add_order_form_done_title_is_resbut?win_add_order_form_done_title:win_add_order_form_title);
                    },function(){
                        window.location.reload();
                    });
                    return;
                // 部份产品当日已询单超过6个或询单失败时,
                // 失败为什么会返回成功页呢?
                // 因为这里的失败对于用户来说,当前的询盘是成功的,所以返回成功提示.让用户可以跳转到后台管理.
                }else if(rs.msg==='FAILED'){
                    inquiry_done(rs, 0);
                }
            }
            else // 提交成功时
            {
                inquiry_done(rs, 1);
            }
        },'json');
        return false;
    }

    return {
        open:inquiry_form_win
    }
});
