(function(e){typeof define=="function"&&define.amd?define(["jquery"],e):typeof exports=="object"?e(require("jquery")):e(jQuery)})(function(e){function n(t,n,r){this.element=t,this.$element=e(t),this.value=t.value,this._callback=n,this.options=e.extend({time:150},r),e(t).on("focus",e.proxy(this._listen,this)),e(t).on("blur",e.proxy(this._unlisten,this))}var t=!document.all;n.prototype={_listen:function(){return t?this.$element.on("input",e.proxy(this._run,this)):this._interval=window.setInterval(e.proxy(this._check,this),this.options.time),!0},_unlisten:function(){return t?this.$element.off("input",this._run):window.clearInterval(this._interval),!0},_run:function(){this.value=this.element.value,this._callback(this.value,this.element)},_check:function(){this.element.value!=this.value&&this._run()}},e.fn.onInputChange=function(e,t){return this.each(function(){new n(this,e,t)})}});