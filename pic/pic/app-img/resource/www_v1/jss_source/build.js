({
    appDir: './',
    baseUrl: './',
    dir: '../jss',
    fileExclusionRegExp: /^(r|build|configs)\.js|.svn$/,
    removeCombined: true,
    preserveLicenseComments: false,
//    optimize:'none',
    modules: [
        {name: 'page/index'},
        {name: 'page/moldata_label'},
        {name: 'page/moldata_catalog'},
        {name: 'page/moldata_detail'},
        {name: 'page/moldata'},
        {name: 'page/supplier_list'},
        {name: 'page/keyword_list'},
        {name: 'page/moldata_list'},
        {name: 'page/synthetic_detail'},
        {name: 'page/jr_events'},
        {name: 'page/login'},
        {name: 'page/keyword'},
        {name: 'page/reg'},
        {name: 'page/no_moldata'},
        {name: 'page/password-recovery'},
        {name: 'page/a_wintplshow.html'},
    ],
    paths:{
        'jquery':           'empty:',                   // 不参与合并
        'chemwriter':       'empty:',                   // 结构图画板(chemwriter 2.15.3) 不参与合并
        'json':             'empty:',                   // 不参与合并

        'nicescroll':       'pub_jss/lib/jquery.nicescroll',    // 滚动条插件
        'cookie':           'pub_jss/lib/jquery.cookie',        // cookie插件
        'oninputchange':    'pub_jss/lib/jquery.oninputchange', // oninput插件(监听输入框值变化)
        'placeholder':      'pub_jss/lib/jquery.placeholder',   // placeholder插件(让低版本浏览器支持placeholder属性)
        'pagination':       'pub_jss/lib/jquery.pagination',    // pagination分页插件
        'tabs':             'pub_jss/lib/jquery.tabs',          // tabs插件
        'smartfloat':       'pub_jss/lib/jquery.smartfloat',    // float插件
        'validate':         'pub_jss/lib/jquery.validate',      // validate验证插件
        'ajaxformpost':     'pub_jss/lib/jquery.ajaxformpost',  // ajaxFormPost提交插件
        'dialog':           'pub_jss/lib/dialog',               // dialog 6.4
        'dialog-config':    'pub_jss/lib/dialog-config',        // dialog配置文件
        'popup':            'pub_jss/lib/popup',                // HTML5的popup实现(dialog必须)
        'store':            'pub_jss/lib/store',                // 浏览器本地存储
        'url':              'pub_jss/lib/url',                  // 获得URL中的参数值
        'focus':            'pub_jss/lib/focus',                // 延时focus
        'number':           'pub_jss/lib/number',               // 精确数值计算
        'message':          'pub_jss/lib/message',              // 系统消息提示组件
        'message_new':      'pub_jss/lib/message_new',          // 系统消息提示组件
        'form2js':          'pub_jss/lib/form2js',              // 获得表单的JS代码,用于快速开发
        'ajaxtpl':          'pub_jss/lib/ajaxtpl',              // AJAX加载HTML模板文件
        'ajaxtpl_new':      'pub_jss/lib/ajaxtpl_new',              // AJAX加载HTML模板文件
        'imgs':             'pub_jss/lib/imgs',                 // 图片处理(zoom,ready)
        'suningimg':        'pub_jss/lib/suningimg',            // 图片焦点图
        'drag':             'pub_jss/lib/drag',                 // drag拖拽
        'selectbox':        'pub_jss/lib/selectbox',            // selectbox
        'webuploader':      'pub_jss/lib/webuploader',          // webuploader
        'rankingimgs':      'pub_jss/lib/ranking-img-scroll',   // 底部的ranking 图片 滚动
        'marquee':          'empty:',                           // 无缝滚动
        'moment':           'pub_jss/lib/moment',               // 时间差格式化插件

        'cklogin':          'pub_jss/mod/cklogin',              // AJAX检查用户登录
        'chemw':            'pub_jss/mod/chemw',                // 封装并扩展后的结构图画板(chemwriter)
        'fungform':         'pub_jss/mod/fungform',             // 首页官能团
        'batchform':        'pub_jss/mod/batchform',            // 首页批量搜索
        'searchauto':       'pub_jss/mod/searauto',           // 搜索框自动完成
        'backtop':          'pub_jss/mod/backtop',              // 返回顶部
        'guidelayer':       'pub_jss/mod/guidelayer',           // CAS页引导层
        'filterbar':        'pub_jss/mod/filterbar',            // CAS筛选工具条
        'inquirywin':       'pub_jss/mod/inquirywin',           // 询单(弹)层
        'loginwin':         'pub_jss/mod/loginwin',             // 登录(弹)层
        'loginwin_v1':      'pub_jss/mod/loginwin_v1',          // 登录(弹)层
        'attentionwin':     'pub_jss/mod/attentionwin',         // 关注(弹)层
        'favstore':         'pub_jss/mod/favstore',             // 关注店铺
        'inquiryckmail':    'pub_jss/mod/inquiryckmail',         // 询单用户邮箱验证处理
        'pubjs':            'pub_jss/mod/pubjs',                // 页面公共JS
        'top10':            'pub_jss/mod/top10'      
    },
    shim: {
        'nicescroll':{
            deps: ['jquery'],
            exports: 'jQuery.fn.nicescroll'
        },
        'cookie':{
            deps: ['jquery'],
            exports: 'jQuery.fn.cookie'
        },
        'oninputchange':{
            deps: ['jquery'],
            exports: 'jQuery.fn.onInputChange'
        },
        'placeholder':{
            deps: ['jquery'],
            exports: 'jQuery.fn.placeholder'
        },
        'pagination':{
            deps: ['jquery'],
            exports: 'jQuery.fn.pagination'
        },
        'tabs':{
            deps: ['jquery'],
            exports: 'jQuery.fn.tabs'
        },
        'smartfloat':{
            deps: ['jquery'],
            exports: 'jQuery.fn.smartfloat'
        },
        'validate':{
            deps: ['jquery'],
            exports: 'jQuery.fn.validate'
        },
        'ajaxformpost':{
            deps: ['jquery'],
            exports: 'jQuery.fn.ajaxFormPost'
        },
        'dialog':{
            deps: ['jquery','popup','dialog-config'],
            exports: 'dialog'
        },
        'popup':{
            deps: ['jquery']
        },
        'drag':{
            deps: ['jquery']
        },
        'selectbox':{
            deps: ['jquery','popup']
        },
        'chemwriter':{
            exports: 'chemwriter'
        },
        'slide':{
            deps: ['jquery'],
            exports: 'myFocus'
        },
        'chemw':{
            deps: ['store','chemwriter'],
            exports: 'chemw'
        }
    },
    onBuildWrite:function(moduleName, path, contents){
        var add='';
        //console.log(moduleName + ' --------------------');
        if('require'===moduleName)  //把配置文件和全局加载到require.js尾部
        {
            add=readFile('./configs.js');
            console.log(moduleName + ' ADD configs.js END');
        }
        return contents+add;
    },
    onModuleBundleComplete:function(data){
        var p='../jss/';
        var readStream = fs.createReadStream('./pub_jss/lib/chemwriter.js');
        var writeStream = fs.createWriteStream(p+'pub_jss/lib/chemwriter.js');
        readStream.pipe(writeStream);
        readStream.on('end', function(){
            console.log('COPY chemwriter.js END');
        });
    }
})