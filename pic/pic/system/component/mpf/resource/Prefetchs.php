<?php
mpf_require_class("MPF_Component");
mpf_require_controller("MPF_Resource_Resources");

class MPF_Resource_PrefetchsComponent extends MPF_Component {
    public function get_view() {
        return "Prefetchs";
    }

    public function get_prefetch_javascripts() {
        return MPF::get_instance()->get_prefetch_javascripts();
    }

    public function get_prefetch_styles() {
        return MPF::get_instance()->get_prefetch_styles();
    }

    public function get_prefetch_styles_uri($class_name) {
        return MPF_Resource_ResourcesController::build_boundable_uri($class_name, "css");
    }

    public function get_prefetch_javascript_uri($class_name) {
        return MPF_Resource_ResourcesController::build_boundable_uri($class_name, "js");
    }


    /**
     * @param string $resource
     * @return string url
     */
    public function get_style_url($resource) {
        $str = explode('/',$resource);
        $class_name = $str[count($str)-1];
        $uri = $this->get_prefetch_styles_uri($class_name);
        return $this->cdn_boundable_prefix() . $uri;
    }

    /**
     * @param string $resource
     * @return string url
     */
    public function get_javascript_url($resource) {
        $str = explode('/',$resource);
        $class_name = $str[count($str)-1];
        $uri = $this->get_prefetch_javascript_uri($class_name);
        return $this->cdn_boundable_prefix() . $uri;
    }


    public function cdn_boundable_prefix() {
        if (!$this->cdn_boundable_prefix) {
            $schema = "http://"; // TODO: check for https
            $host = MPF::get_instance()->get_config("cdn_boundable_host", "resource");
            $path = MPF::get_instance()->get_config("cdn_boundable_path", "resource");
            $this->cdn_boundable_prefix = "$schema$host$path";
        }
        return $this->cdn_boundable_prefix;
    }

    private $cdn_boundable_prefix;


}