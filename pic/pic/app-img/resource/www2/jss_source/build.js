({
    appDir: './',
    baseUrl: './',
    dir: '../jss',
    fileExclusionRegExp: /^(r|build|configs)\.js$/,
    removeCombined: true,
    preserveLicenseComments: false,
//    optimize:'none',
    modules: [
        {name: 'page/index'}
    ],
    paths:{
        'jquery':           'empty:',                   // 不参与合并
        'chemwriter':       'empty:',                   // 结构图画板(chemwriter 2.15.3) 不参与合并
        'json':             'empty:',                   // 不参与合并

        'nicescroll':       'lib/jquery.nicescroll',    // 滚动条插件
        'cookie':           'lib/jquery.cookie',        // cookie插件
        'oninputchange':    'lib/jquery.oninputchange', // oninput插件(监听输入框值变化)
        'placeholder':      'lib/jquery.placeholder',   // placeholder插件(让低版本浏览器支持placeholder属性)
        'pagination':       'lib/jquery.pagination',    // pagination分页插件
        'tabs':             'lib/jquery.tabs',          // tabs插件
        'smartfloat':       'lib/jquery.smartfloat',    // float插件
        'validate':         'lib/jquery.validate',      // validate验证插件
        'ajaxformpost':     'lib/jquery.ajaxformpost',  // ajaxFormPost提交插件
        'dialog':           'lib/dialog',               // dialog 6.4
        'dialog-config':    'lib/dialog-config',        // dialog配置文件
        'popup':            'lib/popup',                // HTML5的popup实现(dialog必须)
        'store':            'lib/store',                // 浏览器本地存储
        'url':              'lib/url',                  // 获得URL中的参数值
        'focus':            'lib/focus',                // 延时focus
        'number':           'lib/number',               // 精确数值计算
        'message':          'lib/message',              // 系统消息提示组件
        'form2js':          'lib/form2js',              // 获得表单的JS代码,用于快速开发
        'ajaxtpl':          'lib/ajaxtpl',              // AJAX加载HTML模板文件
        'imgs':             'lib/imgs',                 // 图片处理(zoom,ready)
        'suningimg':        'lib/suningimg',            // 图片焦点图
        'drag':             'lib/drag',                 // drag拖拽
        'selectbox':        'lib/selectbox',            // selectbox
        'webuploader':      'lib/webuploader',          // webuploader
        'rankingimgs':      'lib/ranking-img-scroll',   // 底部的ranking 图片 滚动
        'marquee':          'empty:',              // 无缝滚动

        'cklogin':          'mod/cklogin',              // AJAX检查用户登录
        'chemw':            'mod/chemw',                // 封装并扩展后的结构图画板(chemwriter)
        'fungform':         'mod/fungform',             // 首页官能团
        'batchform':        'mod/batchform',            // 首页批量搜索
        'searchauto':       'mod/searchauto',           // 搜索框自动完成
        'backtop':          'mod/backtop',              // 返回顶部
        'guidelayer':       'mod/guidelayer',           // CAS页引导层
        'filterbar':        'mod/filterbar',            // CAS筛选工具条
        'inquirywin':       'mod/inquirywin',           // 询单(弹)层
        'loginwin':         'mod/loginwin',             // 登录(弹)层
        'attentionwin':     'mod/attentionwin',         // 关注(弹)层
        'favstore':         'mod/favstore',             // 关注店铺
        'inquiryckmail':    'mod/inquiryckmail'         // 询单用户邮箱验证处理
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
        if('lib/require'===moduleName)  //把配置文件和全局加载到require.js尾部
        {
            add=readFile('./configs.js');
            console.log(moduleName + ' ADD configs.js END');
        }
        return contents+add;
    },
    onModuleBundleComplete:function(data){
        var p='../jss/';
        var readStream = fs.createReadStream('./lib/chemwriter.js');
        var writeStream = fs.createWriteStream(p+'lib/chemwriter.js');
        readStream.pipe(writeStream);
        readStream.on('end', function(){
            console.log('COPY chemwriter.js END');
        });
    }
})