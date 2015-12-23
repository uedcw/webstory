<?php

apf_require_class('APF_Solr_Factory');
apf_require_class('APF_Solr_Accessor');

abstract class APF_Solr_Object {

    public function __construct() {
        foreach ($this->get_fields() as $k => $v) {
            unset($this->$k);
        }
    }

    /**
     * @return APF_Solr_Accessor
     */
    public static function get_accessor() {
        return new APF_Solr_Accessor(get_called_class());
    }

    protected function get_fields() {
        $mapping = static::get_mapping();
        return $mapping['fields'];
    }

    protected function get_key() {
        $mapping = static::get_mapping();
        return $mapping['key'];
    }

    protected function get_commit() {
        $mapping = static::get_mapping();
        return $mapping['commit'];
    }

    public function save($commit=null) {
        $fields = $this->get_fields();
        $sa = $this->get_accessor();
        foreach ($fields as $objField => $docField) {
            if (isset($this->$objField))
                $sa->add_doc_field($docField, $this->$objField);
        }

        if (isset($commit)) {
            $sa->save($commit);
        } else {
            $sa->save($this->get_commit());
        }

        unset($sa);

        return true;
    }

    public function delete($commit=null) {
        $key = $this->get_key();
        $sa = $this->get_accessor();
        $sa->delete_id = $this->$key;

        if (isset($commit)) {
            $sa->delete($commit);
        } else {
            $sa->delete($this->get_commit());
        }
        unset($sa);

        return true;
    }
}