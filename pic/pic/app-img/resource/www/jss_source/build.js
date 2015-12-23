({
    appDir: './',
    baseUrl: './',
    dir: '../jss',
    fileExclusionRegExp: /^(r|build|configs)\.js$/,
    removeCombined: true,
    preserveLicenseComments: false,
//    optimize:'none',
    modules: [
        {name: 'page/public'},							//公用
        {name: 'page/index'},
        {name: 'page/product_detail'},
        {name: 'page/product_list'},
        {name: 'page/order'},
        {name: 'page/bank'},
        {name: 'page/store'},
        {name: 'page/find_goods'},
        {name: 'page/zx'},
        {name: 'page/supply_demand'},
        {name: 'page/supply_demand_post'},
        {name: 'page/gq_success'},
        {name: 'page/404error'}
    ],
    paths:{
        'jquery':           'empty:',                   // 不参与合并
        'json':             'empty:',                   // 不参与合并

        'placeholder':      'lib/jquery.placeholder',   // placeholder插件(让低版本浏览器支持placeholder属性)
        'scroll':       	'lib/jquery.scrolllist',    //文字单条滚动
        'slide' : 			'lib/jquery.slides',		//banner滚动
        'fadeslide' : 		'lib/jquery.fadeslide',		//banner渐隐切换（直销页面使用）
        'marquee' : 		'lib/jquery.marquee',		//文字无缝滚动

        'store':            'lib/store',                // 浏览器本地存储
        'number':           'lib/number',               // 精确数值计算
        'imgs':             'lib/imgs',                 // 图片处理(zoom,ready)
        'suningimg':        'lib/suningimg',            // 图片焦点图
        'drag':             'lib/drag',                 // drag拖拽
        'autocheck':        'lib/autocheck',           	//验证插件
        'malldialog':       'lib/malldialog',           //商城弹出框
        'style':       		'lib/style',           		//页面样式操作
        'loadBanner':       'lib/jquery.loadBanner',    //页面初始banner展现效果
        
        'malluser':         'mod/malluser',             //商城用户
        'mallpublic':       'mod/mallpublic',           //商城公共模块（事件，公用方法）
        'cart':          	'mod/cart',              	//购物车
        'doCart' : 			'mod/docart',             	//操作购物车
        'dialogaddcart' : 'mod/dialogaddcart'           //弹出框购物车
    },
    shim: {
    	'placeholder':{
            deps: ['jquery'],
            exports: 'jQuery.fn.placeholder'
        },
        'scroll':{
            deps: ['jquery'],
            exports: 'jQuery.fn.scrollList'
        },
        'slide':{
        	deps: ['jquery'],
        	exports: 'jQuery.fn.slides'
        },
        'fadeslide':{
        	deps: ['jquery'],
        	exports: 'jQuery.fn.slide'
        },
        'loadBanner':{
        	deps: ['jquery'],
        	exports: 'jQuery.fn.loadBanner'
        },
        'marquee':{
        	deps: ['jquery'],
        	exports: 'jQuery.fn.kxbdMarquee'
        },
        'cart':{
            deps: ['jquery'],
            exports: 'cart'
        },
        'autocheck':{
            deps: ['jquery']
        },
        'malldialog':{
            deps: ['jquery']
        },
        'dialogaddcart': {
        	deps: ['cart']
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
    
    }
})