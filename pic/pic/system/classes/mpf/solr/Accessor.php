<?php

mpf_require_class('MPF_Solr_Factory');

class MPF_Solr_Accessor {

    public function __construct($class) {
        $this->class = $class;
        $this->mapping = $class::get_mapping();
    }

    private $mapping;

    public function add_doc_field($field, $value) {
        $this->doc_fields[$field] = $value;
        return $this;
    }

    private $doc_fields;

    public function add_field($field) {
        if (!is_array($this->fields) || !in_array($field, $this->fields)) {
            $this->fields[] = $field;
        }
        return $this;
    }

    private $fields;

    public function set_query($query) {
        $this->query = $query;
        return $this;
    }

    private $query;

    public function add_filter($field, $value) {
        $this->filters[$field] = addslashes($value);
        return $this;
    }

    private $filters;

    public function add_filter_range($field, $from, $to) {
        $from = empty($from) ? "*" : $from;
        $to = empty($to) ? "*" : $to;
        $this->filters[$field] = "[$from TO $to]";
        return $this;
    }

    public function add_facet($facet, $sort='', $limit=20) {
        $this->facets[$facet]['filed'] = $facet;
        if ($sort) {
            $this->facets[$facet]['sort'] = $sort;
        }
        $this->facets[$facet]['limit'] = $limit;
        return $this;
    }

    private $facets;

    public function add_facet_query($field) {
        if (!in_array($field, $this->facet_query_array)) {
            $this->facet_query_array[] = $field;
        }
        return $this;
    }

    private $facet_query_array = array();
    private $facet_min_count = 1;

    public function set_facet_min_count($min_count) {
        $this->facet_min_count = intval($min_count);
        return $this;
    }

    public function add_sort($field, $type='desc') {
        if ($type == 'desc') {
            $this->sorts[$field] = SolrQuery::ORDER_DESC;
        } else {
            $this->sorts[$field] = SolrQuery::ORDER_ASC;
        }
        return $this;
    }

    public function set_sort($field, $type='desc') {
        if ($type == 'desc') {
            $this->sorts = array($field => SolrQuery::ORDER_DESC);
        } else {
            $this->sorts = array($field => SolrQuery::ORDER_ASC);
        }
        return $this;
    }

    private $sorts;

    public function set_start($start) {
        $this->start = $start;
        return $this;
    }

    private $start;

    public function set_rows($rows) {
        $this->rows = $rows;
        return $this;
    }
    
    private $query_field;
    public function add_query_field($strFields, $fltBoost){
        $this->query_field[$strFields] = $fltBoost;
    }

    private $rows;

    public function find() {
        $response = $this->find_response();
        $this->num_found = $response['response']['numFound'];
        $docs = $response['response']['docs'];
        $this->models = array();
        if ($docs) {
            foreach ($docs as $doc) {
                $this->models[] = $this->array_to_model($doc);
            }
        }

        if (isset($response['facet_counts']['facet_fields'])) {
            $this->facet_fields = $response['facet_counts']['facet_fields'];
        }

        return $this->models;
    }

    private $models;
    private $num_found;
    private $facet_fields;

    public function find_keys() {
        $response = $this->find_response();
        $this->num_found = $response['response']['numFound'];
        $docs = $response['response']['docs'];

        $key_name = $this->mapping['key'];

        $this->keys = array();
        if ($docs) {
            foreach ($docs as $doc) {
                $this->keys[] = $doc[$key_name];
            }
        }

        if (isset($response['facet_counts']['facet_fields'])) {
            $this->facet_fields = $response['facet_counts']['facet_fields'];
        }

        if (isset($response['facet_counts']['facet_queries'])) {
            $this->facet_queries = $response['facet_counts']['facet_queries'];
        }

        return $this->keys;
    }

    private $keys;

    public function get_models() {
        return $this->models;
    }

    public function get_nums() {
        return $this->num_found;
    }

    private $facet_queries;

    public function get_facet_queries() {
        return $this->facet_queries;
    }

    public function get_facet_fields() {
        return $this->facet_fields;
    }
    
    public function get_query_field(){
        return $this->query_field;
    }

    private function find_response() {
        if (!isset($this->query)) {
            throw new SolrException('SolrAccessor Exception: query undefined', '7700');
        }

        $query = new SolrQuery();
        $query->setQuery($this->query);

        $query->addField($this->mapping['key']);
        if (is_array($this->fields))
            foreach ($this->fields as $field) {
                $query->addField($field);
            }

        if (is_array($this->filters))
            foreach ($this->filters as $field => $value) {
                $query->addFilterQuery("$field:$value");
            }

        if (is_array($this->sorts))
            foreach ($this->sorts as $field => $type) {
                $query->addSortField($field, $type);
            }

        if (is_array($this->query_field) && !empty($this->query_field)){
            $arrQueryFields = array();
            foreach ($this->query_field as $field => $boost) {
                $arrQueryFields[] = $field.'^'.$boost;
            }
            $query->setParam('qf', implode(' ', $arrQueryFields));
            $query->setParam('qt', 'dismax');
        }
            
        if (isset($this->start)) {
            $query->setStart($this->start);
        }

        if (isset($this->rows)) {
            $query->setRows($this->rows);
        }

        if (is_array($this->facets)) {
            $query->setFacet(true);
            $query->setFacetMinCount($this->facet_min_count);
            foreach ($this->facets as $facet) {
                $query->addFacetField($facet['filed']);
                if (isset($facet['limit'])) {
                    $limit = intval($facet['limit']);
                    $query->setFacetLimit($limit);
                }
                if (isset($facet['sort'])) {
                    $sort = ($facet['sort'] == 'index') ? $query::FACET_SORT_INDEX : $query::FACET_SORT_COUNT;
                    $query->setFacetSort($sort, $facet['filed']);
                }
            }
        }

        if (!empty($this->facet_query_array) && is_array($this->facet_query_array)) {
            $query->setFacet(true);
            $query->setFacetMinCount($this->facet_min_count);
            foreach ($this->facet_query_array as $valFacetQuery) {
                $query->addFacetQuery($valFacetQuery);
            }
        }

        $client = MPF_Solr_Factory::get_instance()->get_client($this->mapping['instance']);
        $response = $client->query($query);
        $debug = explode("\n", $client->getDebug());    //TODO use getRawRequest instead of debug
        $raw_request = @$debug[13];
        if (substr($raw_request, 0, 2) != 'q=') {
            $raw_request = @$debug[12];
        }
        MPF::get_instance()->debug(__CLASS__ . '::' . __FUNCTION__ . ':' . @$response->getRequestUrl() . '&' . $raw_request);
        return $response->getResponse();
    }

    private function array_to_model($arr) {
        $class = new $this->class;

        foreach ($arr as $property => $value) {
            if (property_exists($class, $property)) {
                $class->$property = $value;
            }
        }

        return $class;
    }

    public function commit() {
        $client = MPF_Solr_Factory::get_instance()->get_client($this->mapping['instance']);
        $response = $client->commit();
        return $response;
    }

    public function delete($commit=false) {
        $client = MPF_Solr_Factory::get_instance()->get_client($this->mapping['instance']);
        try {
            $response = $client->deleteById($this->delete_id);
        } catch (Exception $e) {
            return false;
        }

        if (!$response instanceof SolrUpdateResponse || $response->getHttpStatus() != 200) {
            //TODO debug info
            return false;
        }

        if ($commit == true) {
            $response = $client->commit();
        }
        return true;
    }

    public $delete_id;

    public function save($commit=false) {
        $doc = new SolrInputDocument();

        foreach ($this->doc_fields as $field => $value) {
            if(!is_array($value)){
                $doc->addField($field, $value);
            }
            //for multi value
            else{
                foreach($value as $v){
                    $doc->addField($field, $v, 1);
                }
            }
        }

        $client = MPF_Solr_Factory::get_instance()->get_client($this->mapping['instance']);
        try {
            $response = $client->addDocument($doc);
        } catch (Exception $e) {
            return false;
        }

        if (!$response instanceof SolrUpdateResponse || $response->getHttpStatus() != 200) {
            //TODO debug info
            return false;
        }

        if ($commit == true) {
            $response = $client->commit();
        }

        return true;
    }

    public $commit;

}