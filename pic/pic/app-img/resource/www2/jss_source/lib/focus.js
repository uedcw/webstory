define(function(){
/*
 * 延时 focus
 * @param sid           DOM id
 * @param time          time
 * @return void
 */
    return function(sid, time){
        time=time||50;
        window.setTimeout(function(){
            document.getElementById(sid).focus();
        }, time);
    }
});
