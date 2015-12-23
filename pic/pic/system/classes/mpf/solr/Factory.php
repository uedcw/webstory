<?php
class MPF_Solr_Factory {

    const CONF_F_SOLR = 'solr';

    private function __construct(){}

    /**
     * @return APF_Solr_Factory
     */
    public static function &get_instance() {
        if (!self::$instance) {
            self::$instance = new MPF_Solr_Factory();
        }
        return self::$instance;
    }
    private static $instance;

    public function get_client($name) {
        if (!isset($this->client_list[$name])) {
            $this->client_list[$name] = $this->load_client($name);
        }
        return $this->client_list[$name];
    }
    private $client_list;

    private function load_client($name) {
        $solrcloud = MPF::get_instance()->get_config('solrcloud', self::CONF_F_SOLR);
        if (!isset($solrcloud['hostname']) || !isset($solrcloud['port'])) {
            throw new SolrException('Sole Exception: solrcloud undefined', '7000');
        }

        $option = array(
            'hostname' => $solrcloud['hostname'],
            'port' => $solrcloud['port'],
            'path' => $name
        );

        return new SolrClient($option);
    }
}