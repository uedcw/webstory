<?php
apf_require_component('APF_Resource_JavascriptsAndStyles');

class APF_Resource_ScriptBlocksComponent extends APF_Resource_JavascriptsAndStylesComponent {
    public function get_view() {
        return @$this->get_param('head') ? 'ScriptBlocksHead' : 'ScriptBlocks';
    }
}