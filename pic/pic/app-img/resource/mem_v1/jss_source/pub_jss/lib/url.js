define(function(){
/*
 * 获得URL中的参数值
 * @param k		需要获得数据的参数名
 * @param def	默认值
 * @param str	URL字符串,如果不值则默认从location.search中获得
 * @return mixed
 */
    return function(k, def, str){
        str=str||document.location.search;
        return str.urlArg(k,def);
    }
});
