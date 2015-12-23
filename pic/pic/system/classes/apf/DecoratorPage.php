<?php
apf_require_class("APF_Page");
/**
 * APF页面装饰器，其实是页面的骨架，起占位作用。
 * 所有的组件和实际页面内容都依附于装饰器。
 * 所谓的“装饰器”其实就是页面模板。
 * 在页面模板中：
 * real_page方法显示页面主体；
 * component方法显示特定组件；
 *
 * added by htlv
 */
abstract class APF_DecoratorPage extends APF_Page {
    /**
     * 重载了组件的execute方法
     * 载入装饰器
     * @see APF_Page::execute()
     */
    public function execute() {
        $view = $this->get_decorator();
        APF::get_instance()->debug("decorator: $view");
        $file =  "page/".$view.".phtml";
        global $G_LOAD_PATH;
        foreach ($G_LOAD_PATH as $path) {
            if (file_exists($path.$file)) {
                $this->render($path.$file, TRUE);
                break;
            }
        }
    }
    /**
     * 获取装饰器名称
     * @return string 装饰器路径
     */
    public function get_decorator() {
        return "Decorator";
    }
    /**
     * 本方法在页面模板中调用，负责渲染页面的主题内容。
     * 跟get_view方法并无区别
     */
    public function real_page() {
        $view = $this->get_view();
        if ($view) {
            $file =  "page/" . apf_classname_to_path(get_class($this))
                . $view . ".phtml";
            global $G_LOAD_PATH;
            foreach ($G_LOAD_PATH as $path) {
                if (file_exists($path.$file)) {
                    // 最终页面模板中已经设置了字符集等信息
                    // 无需再设置
                    $this->render($path.$file, FALSE);
                    break;
                }
            }
        }
    }
    protected function is_iphone() {
        $agent = strtolower($_SERVER['HTTP_USER_AGENT']);
        $is_iphone = (strpos($agent, 'iphone')) ? true : false;
        return $is_iphone;
    }
}
