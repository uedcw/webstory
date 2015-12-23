<?php
mpf_require_component('MPF_Resource_JavascriptsAndStyles');

class MPF_Resource_ScriptBlocksComponent extends MPF_Resource_JavascriptsAndStylesComponent {
    public function get_view() {
        return @$this->get_param('head') ? 'ScriptBlocksHead' : 'ScriptBlocks';
    }
}