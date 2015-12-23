define([
'module',       // module(可从这对外发布接口,或从这获得模块配置信息config, 如:module.config().baseUrl)
'jquery',       // jquery
'message',
'searchauto',   // 文本搜索自动完成
'pubjs',
'top10'
], function(module, $,message, searchauto){

    $(document).ready(function(){
        searchauto.init();
    
  });
});