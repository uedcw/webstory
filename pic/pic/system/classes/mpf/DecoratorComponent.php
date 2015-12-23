<?php
mpf_require_class("MPF_Component");

abstract class MPF_DecoratorComponent extends MPF_Component {
    public function execute() {
        $view = $this->get_decorator();
        MPF::get_instance()->debug("decorator: $view");
        $file =  "component/".$view.".phtml";
        global $G_LOAD_PATH;
        foreach ($G_LOAD_PATH as $path) {
            if (file_exists($path.$file)) {
                $this->render($path.$file, TRUE);
                break;
            }
        }
    }

    public function get_decorator() {
        return "Decorator";
    }

    public function real_component() {
        $view = $this->get_view();
        if ($view) {
            $file =  "component/".mpf_classname_to_path(get_class($this)).$view.'.phtml';
            global $G_LOAD_PATH;
            foreach ($G_LOAD_PATH as $path) {
                if (file_exists($path.$file)) {
                    $this->render($path.$file);
                    break;
                }
            }
        }
    }
}
