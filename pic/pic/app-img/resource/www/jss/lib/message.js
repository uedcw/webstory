define(["jquery","ajaxtpl","dialog"],function(e,t,n){function o(e,t){e=e||"success";var n=i?' style="'+i+'"':"",r=s?" "+s:"";return'<table class="sys_mess"><tr><th valign="center"><div class="ico ico_'+e+'"></div></th><td valign="center"><div class="msg'+s+'"'+n+">"+t+"</div></td></tr></table>"}function u(t,i,s){var u=e.extend({title:r.title,content:""},s);return u.content||(u.content=o(t,i)),n(u)}function a(t){return e.isFunction(t)}function f(t){var n={autofocusDefBut:"cancel",cancelValue:r.cancel,cancel:function(){return!0}};return typeof t=="undefined"?n:a(t)?(n.cancel=t,n):("styles"in t&&(i=t.styles,delete t.styles),"addcss"in t&&(s=t.addcss,delete t.addcss),e.isEmptyObject(t)?n:e.extend(n,t))}function l(e,t){var n=f(t),r=u("success",e,n);return r.showModal()}function c(e,t){var n=f(t),r=u("error",e,n);return r.showModal()}function h(e,t){var n=f(t),r=u("warning",e,n);return r.showModal()}function p(r,i,s,o){i=i||e.noop(),s=s||e.noop(),o=o||"index",t(r,function(e,t,r){n({id:t+"_win",content:e,title:"loading",onshow:i,onremove:s}).showModal()},o)}if(window["DB"].leng=="zh")var r={title:"消 息",ok:"确 定",cancel:"取 消"};else var r={title:"Message",ok:"OK",cancel:"Cancel"};var i="",s="";return{success:l,ok:l,error:c,warning:h,win:p,dialog:n}});