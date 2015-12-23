/*!
    tabs
    km3945  2014/11/18
 */
;(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function($){
/*
基本DOM结构
<dl id="itabs_box" data-active="c">
    <dt id="itabs_box_dt">
		<a href="javascript:void(0);" hidefocus="hidefocus" class="tab ss" id="tab_ss">tab1</a>
		<a href="javascript:void(0);" hidefocus="hidefocus" class="tab bs" id="tab_bs">tab2</a>
		<a href="javascript:void(0);" hidefocus="hidefocus" class="tab gs" id="tab_gs">tab3</a>
    </dt>
    <dd id="tab_ss_box"></dd>
    <dd id="tab_bs_box"></dd>
    <dd id="tab_gs_box"></dd>
</dl>
dl须有data-active属性,当前选中高亮的class名,该class也可以实例化时设置,如:$('#itabs_box').tabs(fun,{active:'c'})
dl须有id,用于绑定tabs插件
dt的id与dl的id关联(dl.id_dt)
dt下的a须有class="tab"
dt下的a的id与dd的id关联(a.id_box)

$('#itabs_box').tabs(function(sid, tabobj){
    alert(sid)
    return true; //返回真才进行切换,或是用tabobj.show(sid);来完成切换
});
*/

    function Tabs(eo, callback, options){
        this.eo=eo;
        this.id=eo.id;
        this.$eo=$(eo);
        this.$dt=$('#'+this.id+'_dt');
        this._cb=callback;
        this.options=$.extend({
            tabcss:'.tab',
            active:''
        }, options);
        this.ac=this.options.active;
        if(!this.ac){
            this.ac=this.$eo.data('active');
        }
        this.$dt.on('click',this.options.tabcss, $.proxy(this._click, this));
    }

    Tabs.prototype._click=function(event){
        var eo=event.target;
        var $eo=$(eo);
        if($eo.hasClass(this.ac))return;
        this.$dt.find(this.options.tabcss).removeClass(this.ac);
        $eo.addClass(this.ac);
        var sid=eo.id;
        var res=this._cb(sid, this);
        if(res){
            this.show(sid);
        }
    };
    Tabs.prototype.show=function(sid){ //特殊场景会用到,如切换后要实例化的内容需要先展示容器时
        this.$eo.find('>dd').hide();
        $('#'+sid+'_box').show();
    };

    $.fn.tabs = function(callback, options){
        return this.each(function(){
            new Tabs(this, callback, options);
        });
    };
}));


