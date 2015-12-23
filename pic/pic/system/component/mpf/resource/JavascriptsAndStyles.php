<?php
mpf_require_class("MPF_Component");
mpf_require_controller("MPF_Resource_Resources");

class MPF_Resource_JavascriptsAndStylesComponent extends MPF_Component {
    
    public function get_view() {
        return "JavascriptsAndStyles";
    }

    public function get_javascripts($head=false) {
        return MPF::get_instance()->get_javascripts($head);
    }

    public function get_styles() {
        return MPF::get_instance()->get_styles();
    }

    public function get_boundable_javascripts() {
        return MPF::get_instance()->get_boundable_javascripts();
    }

    public function get_boundable_styles() {
        return MPF::get_instance()->get_boundable_styles();
    }

    /**
     * @param string $resource
     * @return string url
     */
    public function get_style_url($resource) {
        $uri = $this->get_style_uri($resource);
        if (preg_match('/:\/\//', $uri)) {
            return $uri;
        }
        $prefix = $this->cdn_prefix();
        return "$prefix$uri";
    }

    /**
     * @param string $resource
     * @return string url
     */
    public function get_javascript_url($resource) {
        $uri = $this->get_javascript_uri($resource);
        if (preg_match('/:\/\//', $uri)) {
            return $uri;
        }
        $prefix = $this->cdn_prefix();
        return "$prefix$uri";
    }

    public function cdn_prefix() {
        if (!$this->cdn_prefix) {
            $schema = "http://"; // TODO: check for https
            $host = MPF::get_instance()->get_config("cdn_host", "resource");
            $path = MPF::get_instance()->get_config("cdn_path", "resource");
            $this->cdn_prefix = "$schema$host$path";
        }
        return $this->cdn_prefix;
    }

    private $cdn_prefix;

    public function get_style_uri($resource) {
        return MPF_Resource_ResourcesController::build_uri($resource);
    }

    public function get_javascript_uri($resource) {
        return MPF_Resource_ResourcesController::build_uri($resource);
    }

    /**
     * @param string $resource
     * @return string url
     */
    public function get_boundable_styles_url() {
 //       if (APF::get_instance()->get_config('css_use_same_host','resource')) {
        if (false) {
            $path = MPF::get_instance()->get_config("cdn_boundable_path", "resource");
            $host = $_SERVER['HTTP_HOST'];
            $prefix = "http://".$host.$path;
        } else {
            $prefix = $this->cdn_boundable_prefix();
        }
        $uri = $this->get_boundable_styles_uri();
        return "$prefix$uri";
    }

    /**
     * @param string $resource
     * @return string url
     */
    public function get_boundable_javascripts_url() {
        $prefix = $this->cdn_boundable_prefix();
        $uri = $this->get_boundable_javascripts_uri();
        return "$prefix$uri";
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

    public function is_boundable_resources_enabled() {
        return MPF::get_instance()->get_config('boundable_resources', "resource");
    }

    public function get_boundable_styles_uri() {
        return MPF_Resource_ResourcesController::build_boundable_uri($this->get_page_class(), "css");
    }

    public function get_boundable_javascripts_uri() {
        return MPF_Resource_ResourcesController::build_boundable_uri($this->get_page_class(), "js");
    }

    public function get_page_class() {
        $page = $this->get_page();
        $class = get_class($page);
        $class = substr($class, 0, -4);
        return $class;
    }
}