var MPF = {
    log: function(v) {
/*
<?php if (!defined("RELEASE_VERSION")) : ?>
        if (typeof console != 'undefined' && typeof console.log == 'function') {
            console.log(v);
        }
<?php endif; ?>
*/
    }
};

MPF.Namespace = {
    register: function(ns){
        var nsParts = ns.split(".");
        var root = window;
        for (var i = 0; i < nsParts.length; i++) {
            if (typeof root[nsParts[i]] == "undefined") {
                root[nsParts[i]] = new Object();
            }
            root = root[nsParts[i]];
        }
    }
}

MPF.Utils = {
    getWindowSize: function() {
        var myWidth = 0, myHeight = 0;
            if( typeof( window.innerWidth ) == 'number' ) {
            //Non-IE
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
            //IE 6+ in 'standards compliant mode'
            myWidth = document.documentElement.clientWidth;
            myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
            //IE 4 compatible
            myWidth = document.body.clientWidth;
            myHeight = document.body.clientHeight;
        }
        return {
            width: myWidth,
            height: myHeight
        };
    },

    getScroll: function() {
        var scrOfX = 0, scrOfY = 0;
        if( typeof( window.pageYOffset ) == 'number' ) {
            //Netscape compliant
            scrOfY = window.pageYOffset;
            scrOfX = window.pageXOffset;
        } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
            //DOM compliant
            scrOfY = document.body.scrollTop;
            scrOfX = document.body.scrollLeft;
        } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
            //IE6 standards compliant mode
            scrOfY = document.documentElement.scrollTop;
            scrOfX = document.documentElement.scrollLeft;
        }
        return {
            left: scrOfX,
            top: scrOfY
        };
    },

    // http://techpatterns.com/downloads/javascript_cookies.php
    setCookie: function(name, value, expires, path, domain, secure) {
        // set time, it's in milliseconds
        var today = new Date();
        today.setTime(today.getTime());
        /*
            if the expires variable is set, make the correct
            expires time, the current script below will set
            it for x number of days, to make it for hours,
            delete * 24, for minutes, delete * 60 * 24
        */
        if (expires) {
            expires = expires * 1000 * 60 * 60 * 24;
        }
        var expires_date = new Date(today.getTime() + (expires));

        document.cookie = name + "=" +escape(value) +
            ((expires) ? ";expires=" + expires_date.toGMTString() : "") +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "" ) +
            ((secure) ? ";secure" : "" );
    },

    // this fixes an issue with the old method, ambiguous values
    // with this test document.cookie.indexOf( name + "=" );
    getCookie: function(check_name) {
        // first we'll split this cookie up into name/value pairs
        // note: document.cookie only returns name=value, not the other components
        var a_all_cookies = document.cookie.split( ';' );
        var a_temp_cookie = '';
        var cookie_name = '';
        var cookie_value = '';
        var b_cookie_found = false; // set boolean t/f default f

        for (i = 0; i < a_all_cookies.length; i++) {
            // now we'll split apart each name=value pair
            a_temp_cookie = a_all_cookies[i].split( '=' );

            // and trim left/right whitespace while we're at it
            cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

            // if the extracted name matches passed check_name
            if (cookie_name == check_name) {
                b_cookie_found = true;
                // we need to handle case where cookie has no value but exists (no = sign, that is):
                if (a_temp_cookie.length > 1) {
                    cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                }
                // note that in cases where cookie is initialized but no value, null is returned
                return cookie_value;
                break;
            }
            a_temp_cookie = null;
            cookie_name = '';
        }
        if (!b_cookie_found) {
            return null;
        }
    },

    // this deletes the cookie when called
    deleteCookie: function(name, path, domain) {
        if (this.getCookie(name)) {
            document.cookie = name + "=" +
            ((path) ? ";path=" + path : "") +
            ((domain) ? ";domain=" + domain : "") + ";expires=Thu, 01-Jan-1970 00:00:01 GMT";
        }
    },

    setScrollTop: function (n){
        if (document.body) {
            document.body.scrollTop = n;
            if(document.body.scrollTop == 0){
                if (document.documentElement) document.documentElement.scrollTop = n;
            }
        }else if (document.documentElement) {
            document.documentElement.scrollTop = n;
        }
    },

    getScrollTop: function (){
        return document.body ? document.body.scrollTop || document.documentElement.scrollTop : document.documentElement.scrollTop;
    },

    /*
    *
    * APF.Utils.gotoScrollTop(e, s); 这个函数可传两个参数
    * e 是滚动条滚动到什么地方(end)的缩写，如果不传默认是 0
    * s 是滚动条滚动的速度 ，参数值是默认滚动速度的倍数，比如想要加快滚动速度为默认2倍，输入2 ，如果想放慢速度
    *   到默认速度的一半，输入 0.5 。 如果不传默认是 1，就是默认速度。
    */
    gotoScrollTop: function (e, s){
        var t = MPF.Utils.getScrollTop(), n = 0, c = 0;
        var s = s || 1;
        var e = e || 0;
        var i = t > e ? 1 : 0;
        (function() {
            t = MPF.Utils.getScrollTop();
            n = i ? t - e : e - t;
            c = i ? t - n / 15 * s : t + 1 + n / 15 * s ;
            MPF.Utils.setScrollTop( c );
            if (n <= 0 || t == MPF.Utils.getScrollTop()) return;
            setTimeout(arguments.callee, 10);
        })();
    }
};
