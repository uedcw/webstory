<?php

//TODO it's should be a factory pattern, just like AMQP_ObjFactory::get_building()

mpf_require_class('MPF_AMQP_Factory');

abstract class MPF_AMQP_Object {

    public $is_loaded = false;
    public $commit;

    public function save() {
        if ($this->is_loaded == false) return false;

        try {
            $msg = $this->build_message();
            $con = MPF_AMQP_Factory::get_instance()->get_connection();
            $ex = new AMQPExchange($con, self::get_exchange());
            $ret = $ex->publish($msg, self::get_routing());
        } catch (Exception $e) {
            MPF::get_instance()->get_debugger()->debug('MMPQ: Can not be published - ' .$e->getMessage());
        }

        return true;
    }

    public function delete() {
        if ($this->is_loaded == false) return false;

        try {
            $msg = $this->build_delete();
            $con = MPF_AMQP_Factory::get_instance()->get_connection();
            $ex = new AMQPExchange($con, self::get_exchange());
            $ex->publish($msg, self::get_routing());
        } catch (Exception $e) {
            MPF::get_instance()->get_debugger()->debug('AMPQ: Can not be published - ' .$e->getMessage());
        }

        return true;
    }

    protected static function get_fields() {
        $mapping = static::get_mapping();
        return $mapping['fields'];
    }

    protected static function get_exchange() {
        $mapping = static::get_mapping();
        return $mapping['exchange'];
    }

    protected static function get_routing() {
        $mapping = static::get_mapping();
        return $mapping['routing'];
    }

    protected static function get_uniq() {
        $mapping = static::get_mapping();
        return $mapping['uniq'];
    }

    protected function build_message() {
        $fields = self::get_fields();

        $data = array();
        foreach ($fields as $property => $keyname) {
            $data[$keyname] = $this->$property;
        }

        $message = array(
            'action' => 'save',
            'data' => $data
        );

        if ($this->commit == true) {
            $message['commit'] = 'true';
        }

        return json_encode($message);
    }

    protected function build_delete() {
        $uniq = static::get_uniq();

        $data = array(
            $uniq => $this->$uniq
        );

        $message = array(
            'action' => 'delete',
            'data' => $data
        );

        if ($this->commit == true) {
            $message['commit'] = 'true';
        }

        return json_encode($message);
    }

    public function drop_data($id) {
        $uniq = self::get_uniq();
        $this->$uniq = $id;
        $this->is_loaded = true;
        return $this;
    }
}
