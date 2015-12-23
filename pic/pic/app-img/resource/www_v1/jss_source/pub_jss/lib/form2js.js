define(['jquery'],function($){
/*
 * 获得表单的JS代码.用于快速开发
 * 表单中的input控件如里要检测(获取),须添加 summary="s|test字段" 属性,值类型与注释用|分开,值类型为s=string,i=int,默认s
 * 只要表单进行此类设置后.那在页面中执行:
 * form2js('formName');
 * 正常情况下会alert一组js代码, 用于做表单检查

 * HTML demo
 #text
 <input type="text" name="t1" summary="s|t1字段" />               //无ID
 <input type="text" id="t2" name="t2" summary="s|t2字段" />       //有ID

 #radio
 <input type="radio" name="t3" summary="i|t3字段" />              //一组radio只需要设置一个summary即可
 <input type="radio" name="t3" />

 #checkbox
<input type="checkbox" id="t4_1" name="t4[]" summary="i|t4字段" />      //一组checkbox只需要设置一个summary即可
<input type="checkbox" id="t4_2" name="t4[]" />
 */

    return function (form_name){//
        var out=[];
        $(':input[summary]','#'+form_name).each(function(i,o){
            var eo=$(o);
            var set=eo.attr('summary');
            var sets=set.split('|');
            var ona=eo.attr('name');
            var oid=eo.attr('id');

            if(sets.length==1){
                sets=['s',sets[0]];
            }

            if(eo.is(':radio'))
            {
                var tmp='var '+ona+'=$.trim($("[name=\''+ona+'\']:checked",\'#'+form_name+'\').val())'+(sets[0]!=='s'?'.toInt()':'')+';	// '+set;
            }
            else if(eo.is(':checkbox'))
            {
                var tmp='var '+ona.replace(/\[\]$/,'')+'=$("[name=\''+ona+'\']:checked",\'#'+form_name+'\').length;	// '+set;
            }
            else
            {
                if(!oid){
                    var tmp='var '+ona+'=$.trim($("[name=\''+ona+'\']",\'#'+form_name+'\').val())'+(sets[0]!=='s'?'.toInt()':'')+';	// '+set;
                }else{
                    var tmp='var '+ona+'=$.trim($("#'+oid+'").val())'+(sets[0]!=='s'?'.toInt()':'')+';	// '+set;
                }
            }
            out.push(tmp);
        });
        alert(out.join('\n'))
    }
});
