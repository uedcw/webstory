(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):typeof exports=="object"?e(require("jquery")):e(jQuery)})(function(e){jQuery.extend({ajaxFormNums:0,ajaxFormPost:function(t,n,r,i){i=i||"molbase.com";var s="TEMP_POST_"+e.ajaxFormNums,o=e('<div style=""></div>').attr("id",s+"_DIV").css({position:"absolute","z-index":10,top:"-200000px"}),u=e('<form id="'+s+'_FORM" name="'+s+'_FORM" method="post" action="'+t+'" target="'+s+'_IFRAME"></form>');try{window.ajaxFormPostSubmit[e.ajaxFormNums]=u[0]}catch(a){window.ajaxFormPostSubmit=[],window.ajaxFormPostSubmit[e.ajaxFormNums]=u[0]}var f="javascript:void(function(){document.open();document.domain='"+i+"';document.write('<!DOCTYPE html><html><head><script>parent.ajaxFormPostSubmit["+e.ajaxFormNums+"].submit();</script></head><body></body></html>');document.close();}())";o.html('<iframe id="'+s+'_IFRAME" name="'+s+'_IFRAME" height="1" width="1" src="'+f+'" frameborder="0" border="0" scrolling="no"></iframe>'),e.each(n,function(t,n){u.append(e("<textarea></textarea>").attr("name",t).css({width:"1px",height:"1px"}).val(n))}),u.append('<input type="submit" value="Submit" name="b1" style="width:1px;height:1px;" />'),o.append(u),e(document.body).append(o),e("#"+s+"_IFRAME").bind("load",function(){if(e.isFunction(r)){try{var t=JSON.parse(window.name)}catch(n){var t=window.name}r(t)}else alert("ajaxFormPost callBack no find");window.setTimeout(function(){e("#"+s+"_DIV").remove(),window.name=""},1)}),e.ajaxFormNums++}})});