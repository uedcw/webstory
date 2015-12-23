<?php
mpf_require_component('MPF_Resource_JavascriptsAndStyles');

class MPF_Resource_StyleBlocksComponent extends MPF_Resource_JavascriptsAndStylesComponent {
    public function get_view() {
        return "StyleBlocks";
    }

    public function enabled_inline_styles () {
        return MPF::get_instance()->get_config('enabled_inline_styles','resource')
        && MPF::get_instance()->get_use_inline_styles(); // enabled and used
    }

    public function get_inline_styles () {
        $url = $this->get_boundable_styles_url();
        $key = "css-".md5($url);
        mpf_require_class('MPF_Cache_Factory');
        $mem = MPF_Cache_Factory::get_instance()->get_memcache();
        $css = $mem->get($key);
        if ($css) {
            return $css;
        }
        mpf_require_class('MPF_Http_Client_Factory');
        $c = MPF_Http_Client_Factory::get_instance()->get_curl();
        $c->set_url($url);
        $c->execute();
        $css = $c->get_response_text();
        $mem->set($key,$css,0,0);
        return $css;
    }
}