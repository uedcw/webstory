<?php
class APF_Exception_SqlException extends Exception
{

    public $sql_error_code;

    public function __construct($message, $sql_error_code)
    {
        $this->sql_error_code = $sql_error_code;
        parent::__construct($message);
    }
}
