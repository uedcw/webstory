define([
    'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
    'jquery',       // jquery
    'message',
    'message_new',
    'selectbox',
    'store',
    'searchauto',   // 文本搜索自动完成
    'loginwin_v1',
    'pubjs',
    'top10'
], function(module, $,message,message_new,selectbox,store,searchauto,loginwin){
    var form_id=null;
    var eventobjs=null;

    //判断屏幕滚动
    var scrollFun=function(fixoffset,fixsubmit){
        var fix_y=fixoffset.offset().top.toInt()+80; //87 50 36
        var scx_y=$(window).scrollTop().toInt();
        var win_y=$(window).height().toInt();
        var cayy=fix_y - win_y;
        if(scx_y >= cayy){
            fixsubmit.css("position","relative");
            //fixsubmit.addClass("change");
        }else{
            fixsubmit.css("position","fixed");
            // fixsubmit.removeClass("change");
        }
    };
   /* $(".supply_list .table table th .l i.i0").hover(function() {
            $(this).siblings().children(".compey").show(); 
        },function(){
            $(this).siblings().children(".compey").hide(); 
   })
    $("table th .l .fofin a").hover(function() {
            $(this).siblings(".compey").show(); 
        },function(){
            $(this).siblings(".compey").hide(); 
   })*/
    //设置批量询盘数据
    var inquiry = {
        addInquiryForm  : null,
        inquiryData : {isShow : 1, data : {}},//data:{k12:{cheked:0, id:12, companyName:'sssss'},K13:{cheked:0, id:12, companyName:'sssss'}}

        init  : function(){
            var _this = this;
            //store.remove('inquiryData'); 移除数据
            var localInquiryData  = store.get('inquiryData');
            //非当前页面数据过滤
            var url = window.location.href;
            var pos = url.lastIndexOf('?');
            if (pos != -1) {
                url = url.substring(0, pos);
            }
            if (store.get('inquiryDataUrl') != url) {
                localInquiryData = undefined;
            }
            store.set('inquiryDataUrl', url);

            _this.addInquiryForm = $('#add_inquiry_form');
            if(typeof localInquiryData != 'undefined' && typeof localInquiryData['data'] != 'undefined'){
                this.inquiryData = localInquiryData;
            }

            _this.showInquiryData(function(){
                //关联事件
                _this.addInquiryForm.on('click', '.del_inquiry', function () {
                    var id = $(this).data('inquiry_id');
                    _this.delData(id);
                });

                _this.addInquiryForm.on('click', '.mark_inquiry', function () {
                    var data = {};
                    var obj = $(this).find(':checkbox');
                    data.id = obj.val();
                    if(obj.prop('checked')){
                        data.checked = 1;
                    } else {
                        data.checked = 0;
                    }
                    _this.setChecked(data);
                });
            });
            _this.updateChecked();
        },
        //设置数据到列表
        showInquiryData  : function(callBack) {
            var inquiryHtml = '';
            var n = 0;
            for (var key in this.inquiryData.data) {
                n++;
                var checked = this.inquiryData.data[key]['checked'] ? 'checked' : '';
                inquiryHtml += '<li id="per_inquiry_' + this.inquiryData.data[key]['id'] + '" >'
                    +'<label class="mark_inquiry" ><input type="hidden" id="add_inquiry_' +
                    this.inquiryData.data[key]['id'] + '" name="add_inquiry[]" value="' +
                    this.inquiryData.data[key]['id'] + '" ' + checked + ' /><span>' + this.inquiryData.data[key]['companyName']
                    + '</span></label><i class="del_inquiry" data-inquiry_id="' + this.inquiryData.data[key]['id']
                    + '" id="inquiry_' + this.inquiryData.data[key]['id'] + '">X</i></li>';

                var markObj = $('#add_inquiry_mark_' + this.inquiryData.data[key]['id']);
                markObj.prop('checked', true);
            }

            this.addInquiryForm.html(inquiryHtml);

            //是否显示
            this.showForm();

            if (this.inquiryData.isShow) {
                if (n == 0) {
                    $('#compare_done').css('display', 'none');
                } else {
                    $('#compare_done').css('display', 'block');
                }
            }
            $('#add_inquiry_num').html(n);
            if(typeof callBack == 'function'){
                callBack();
            }
        },
        //添加data
        setData : function(data){
            var n = 0;
            for(var i in this.inquiryData.data){
                n++;
            }
            var inquired = $("#multi_inquiry").data('inquired');
            if (n >= 6 - inquired) {
                this.updateChecked();
                message_new.win('public_form_win', function(){
                    this.title("消息提示");
                    if (inquired > 0) {
                         $('#public_form_win').find('p').html('您今天对当前化合物已询盘了'+inquired+'家供应商，您最多还可以向'+(6-inquired)+'家供应商询盘');
                    } else {
                        $('#public_form_win').find('p').html('对比栏已满，您可以删除不需要的商家再继续添加哦！');
                    }
                });
                //alert('最多加入6个批量询盘！');
                return;
            }

            var key = 'k'+data.id;
            if(typeof this.inquiryData.data[key] == 'undefined'){    //如果未添加过公司
                this.inquiryData.data[key] = data;
                data.checked = 1;
                this.showInquiryData();
                store.set('inquiryData', this.inquiryData);
            }
        },
        //删除data
        delData : function(id){
            var key = 'k'+id;
            if(typeof this.inquiryData.data[key] != 'undefined'){    //如果有添加过公司
                $('#' + this.inquiryData.data[key].rid).prop('checked', false);
                delete this.inquiryData.data[key];

                this.showInquiryData();
                store.set('inquiryData', this.inquiryData);
            }
        },
        //更新选中状态
        updateChecked : function(){
            $('.add_inquiry').find(':checkbox').prop('checked', false);
            for(var key in this.inquiryData.data){
                $('#' + this.inquiryData.data[key].rid).prop('checked', true);
            }
        },
        //清除data
        clearData : function(){
            for(var key in this.inquiryData.data){
                delete this.inquiryData.data[key];
            }
            //delete this.inquiryData.data;
            $('.add_inquiry').find(':checkbox').prop('checked', false);
            this.showInquiryData();
            store.set('inquiryData', this.inquiryData);
        },
        //设置显示方式
        setShow : function (status) {
            this.showForm(status);

            this.inquiryData.isShow = status;
            store.set('inquiryData', this.inquiryData);
        },
        //设置选中标记
        setChecked : function(data){
            var key = 'k'+data.id;
            if(typeof this.inquiryData.data[key] != 'undefined'){    //如果有添加过公司
                this.inquiryData.data[key]['checked'] = data.checked;

                store.set('inquiryData', this.inquiryData);
            }
        },
        //实现显示方式
        showForm : function(status){
            if(typeof status == 'undefined'){
                status = this.inquiryData.isShow;
            }
            if(status){
                $("#compare_done").css("display","block");
                $(".fix-compare-ico").css("display","none");
            } else {
                $("#compare_done").css("display","none");
                $(".fix-compare-ico").css("display","block");
            }
        },
        submit: function () {
            var objs = $("input[name='add_inquiry[]']");
            var str = '';
            var psid = '';
            var casno = $("#multi_inquiry").data('casno');

            for (var x=0;x<objs.length;x++) {
                if (objs[x].checked) {
                    if (!psid) {
                        psid = objs[x].value;
                        psid = psid.replace('-', '&sid=');
                    } else {
                        str += objs[x].value + ',';
                    }
                }
            }

            str = str.substr(0, str.length - 1);
            var url = '/index.php?app=input_inquiry&act=index&pid='+psid+'&casno='+casno+'&la=search&type=cas&multi=' + str;

            //清除数据
            inquiry.clearData();

            location.href = url;
        }
    }

    var dialog=message.dialog;
    //yi:suggest price
    function fun_suggest_price(o_data)
    {
        if(!o_data) return false;
        var tpl = o_data.tpl;
        message.win(tpl, function(){
            this.title("参考建议价");
            $("#suggest_form input[name='email']").val(o_data.login_user_email);
            $("#suggest_form input[name='name']").val(o_data.name);
            $("#suggest_form input[name='name_en']").val(o_data.name_en);
            $("#suggest_form input[name='cas_no']").val(o_data.cas_no);
            $("#suggest_form input[name='org_price']").val(o_data.org_price);
            $('#suggest_form .suggest_goods_name').text(o_data.pname+'参考价的建议');
            $("#suggest_form input[name='email']").focus(function(){$(this).removeClass('error').parent().children('.error').remove();});
            $("#suggest_form input[name='suggest_price']").focus(function(){$(this).removeClass('error').parent().children('.error').remove();});

            if(!$('#'+tpl).data('bind'))
            {
                $('#'+tpl).data('bind',1);
                $('#close_'+tpl).on('click',function(){
                    o_data.dialog.get(tpl+'_win').remove();
                });

                $("#suggest_form").on('submit', function(){
                    $("#suggest_form input[name='email']").removeClass('error').parent().children('.error').remove();
                    $("#suggest_form input[name='suggest_price']").removeClass('error').parent().children('.error').remove();

                    //check form data
                    var email = $("#suggest_form input[name='email']").val();
                    var suggest_price = $("#suggest_form input[name='suggest_price']").val()*1;

                    if(suggest_price<=0 || isNaN(suggest_price)){
                        $("#suggest_form input[name='suggest_price']").addClass('error').parent().append('<span class="error">建议价格不正确</span>');
                        return false;
                    }

                    if(email=='' || email == undefined){
                        $("#suggest_form input[name='email']").addClass('error').after('<span class="error">邮箱地址不能为空</span>');
                        return false;
                    }
                    //yi:check mail
                    var mail_reg = /^(.+[a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                    if(!mail_reg.test(email)){
                        $("#suggest_form input[name='email']").addClass('error').after('<span class="error">邮箱格式错误</span>');
                        return false;
                    }

                    var db={
                        user_id:$("#get_user_id").val(),
                        email:email,
                        suggest_price:suggest_price,
                        name:$("#suggest_form input[name='name']").val(),
                        name_en:$("#suggest_form input[name='name_en']").val(),
                        cas_no:$("#suggest_form input[name='cas_no']").val(),
                        org_price:$("#suggest_form input[name='org_price']").val(),
                        unit:$("#suggest_form select[name='unit']").val(),
                        currency:$("#suggest_form select[name='currency']").val(),
                        suggest:$("#suggest_form textarea[name='suggest']").val(),
                        reqtype:'ajax'
                    };
                    $.post('/index.php?app=suggest_price&act=ajax_suggest_price',db,function(rs){
                        var rs = eval('('+rs+')');
                        $('#close_'+tpl).click();
                        if(rs.done)
                        {
                            message.ok(rs.msg_str);
                        }
                        else
                        {
                            message.error(rs.msg_str);
                        }
                    });
                    return false;
                });
            }//bind end
        }, function(){
            if ($("#no-login").css('display') == 'block') {
                window.location.reload();
            }
        });//win end
    }

    $(document).ready(function(){

        searchauto.init();

        inquiry.init();

        //判断屏幕滚动
        var fixsubmit=$('.fix_compare');//滚动到一定告诉的时候该元素需要做什么
        var fixoffset=$('.tag');//需要滚动的位置
        scrollFun(fixoffset,fixsubmit);
        window.onscroll=function(){
            scrollFun(fixoffset,fixsubmit);
        };
        window.onresize=function(){
            scrollFun(fixoffset,fixsubmit);
        };
        //tab1切换
        $(".other_info ul li").mouseover(function() {
            $(this).addClass("cur").siblings().removeClass("cur");
            var indexs=$(this).data("id");
            $(".other_info .t"+indexs).show().siblings(".tab-con").hide();
        });

        //tab2切换
        $(".interes_tab li").mouseover(function() {
            $(this).addClass("curr").siblings().removeClass("curr");
            var indexs=$(this).data("id");
            $(".interest_list_long .tb"+indexs).show().siblings(".interest_page").hide();
        });




        //添加元素
        $(".add_inquiry :checkbox").on('click', function(event){
            //event.stopPropagation();
            var checkObj = $(this);
            var id = checkObj.val();
            if(checkObj[0].checked){   //是否添加
                var inquiryData = {};
                inquiryData.companyName = checkObj.parent().data('name');
                inquiryData.id = id;
                inquiryData.rid = checkObj.attr('id');

                inquiry.setData(inquiryData);

            } else {
                inquiry.delData(id);
            }
            // $(".list li label span").prepend("<li>上海麦恪林生化科技有限公司</li>");
        });

        $("#multi_inquiry").on('click', function(event){
            inquiry.submit();
        });

        $('#inquiry_clear').on('click', function(event){
            inquiry.clearData();
        });

        $('#inquiry_hide').on('click', function(event){
            inquiry.setShow(0);
        });

        $("#show_inquiry_in").click(function(){
            inquiry.setShow(1);
        });

        //下拉
        if (document.getElementById('category_1') != null) {
            selectbox(document.getElementById('category_1'));
            selectbox(document.getElementById('category_2'));
            selectbox(document.getElementById('category_3'));
            selectbox(document.getElementById('category_4'));
            selectbox(document.getElementById('category_5'));
            //selectbox(document.getElementById('category_made'));
        }


        $('.select').change(function(){
            var so=$(this);
           $("select").attr("disabled","disabled");
            var url=$.trim(so.find("option:selected").data("url"));
            window.location.href=url;

        });
        //展开更多收货地址
        $(".expand .more").click(function(){
            $(this).toggleClass("cur");
            $(this).parents("tr").siblings("tr").find(".other").slideToggle();
            $(this).parents("tr").siblings("tr").find(".first").toggleClass("cur");
        });
       //
           /*$("select").change(function(event) {
            /* Act on the event */
           /*$("select").attr("disabled","disabled");*/
            /*$("#pid").removeAttr("disabled"); 
        });*/

        $("#category_1").css("disabled","disabled");


        //弹框一
        var tpl=null;
        var dialog=message.dialog;
        /*
        $("#history_apply").on('click',function(){
            var eo=$(this);
            tpl=eo.data('tpl');
            message.win(tpl, function(){    //open前
                $doms=$('#'+tpl);
                var _this=this;
                //  $('#success_'+tpl).show();
                if(!$doms.data('bind')){//绑定事件
                    $doms.data('bind',1);

                    $('#close_win_about_price').on('click',function(){
                        dialog.get(tpl+'_win').remove();
                        // _this.remove();     //绑定关闭窗口时要用remove();
                    });

                }

                _this.title('参考建议价');
            },function(){   //close时

            });
        });

        //弹框二
        var tpl=null;
        $("#keyword_apply").on('click',function(){
            var eo=$(this);
            tpl=eo.data('tpl');
            message.win(tpl, function(){    //open前
                $doms=$('#'+tpl);
                var _this=this;
                //  $('#success_'+tpl).show();
                if(!$doms.data('bind')){//绑定事件
                    $doms.data('bind',1);

                    $('#close_'+tpl).on('click',function(){
                        dialog.get(tpl+'_win').remove();
                        // _this.remove();     //绑定关闭窗口时要用remove();
                    });

                }

                _this.title('参考建议价');
            },function(){   //close时

            });
        });*/

        //yi:建议价格绑定===============================================================================================================//
        var o_data, tpl, name, pname, name_en, cas_no, org_price, get_user_id = $("#get_user_id").val(), dialog=message.dialog;
        $(".suggest_price").on('click', function(){
            tpl 		= $(this).data("tpl");
            pname 		= $(this).data("pname");
            name 		= $(this).data("name");
            name_en		= $(this).data("name_en");
            cas_no		= $(this).data("cas_no");
            org_price	= $(this).data("org_price");
            o_data      ={
                tpl:tpl,
                pname:pname,
                name:name,
                name_en:name_en,
                cas_no:cas_no,
                user_id:get_user_id,
                login_user_email:login_user_email,
                org_price:org_price,
                dialog:dialog
            }

            //yi:登录
            if(undefined == get_user_id || '0'==get_user_id){
                loginwin.open({data:{
                    cfun:function(rs){
                        login_user_email=rs.email;
                        login_company_name=rs.company;
                        o_data.login_user_email = login_user_email;
                        o_data.user_id = rs.user_id;
                        $("#get_user_id").val(rs.user_id);
                        dialog.get('win_new_login_form_win').remove();

                        fun_suggest_price(o_data);

                        return ;
                    },
                    wfun:function(){
                        $('#submit_users_login_form').prop('disabled', false).removeClass('d');
                    },
                    init:function(){
                    }
                }});

                return ;
            }

            fun_suggest_price(o_data);
            return ;
        });

    });
});
