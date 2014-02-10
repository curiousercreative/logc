<?php
    class Response {
        public $queries = array();
        public $error = false;
        public $message = '';
    }
    
    class ResponseQuery {
        public $success = true;
        public $id;
        public $oldId;
        public $type;
        
        public function __construct($props) {
            foreach ($props AS $key => $value) {
                $this->$key = $value;
            }
        }
    }
    
    
    function connect() {
        include_once('preferences.php');
        return mysql_connect($preferences->db->host, $preferences->db->user, $preferences->db->pass);
    }
    function update($updates) {
        foreach ($updates AS $update) {
            mysql_query('UPDATE '.$update['type'].'s WHERE ');
        }
    }
    
    function create($creates) {
    // Response class that gets encoded and sent back
        $response = new Response();
        
    // Connect to db
        if (!connect()) {
            $response->error = true;
            $response->message = 'could not connect to db';
            echo json_encode($response);
            exit;
        }
    // Select db
        else if (!mysql_select_db('logc')) {
            $response->error = true;
            $response->message = 'could not select db';
            echo json_encode($response);
            exit;
        }
         
    // iterate through queries, adding each to our response
        foreach ($creates AS $create) {
        // Build our fields array
            $fields = $create['fields'];
            switch ($create['type']) {
                case 'log':
                case 'transcription':
                    $fields['modifiedLastBy'] = $create['userId'];
                    $fields['createdBy'] = $create['userId'];
                    $fields['type'] = $create['type'];
                    break;
                case 'like':
                case 'comment':
                    $fields['userId'] = $create['userId'];
            }
            $fields['videoId'] = $create['videoId'];
        
        // Build our query    
            $values = array_map('mysql_real_escape_string', array_values($fields));
            $keys = array_keys($fields);
            $table = 'rows';
            $query = 'INSERT INTO `'.$table.'` (`'.implode('`,`', $keys).'`) VALUES (\''.implode('\',\'', $values).'\')';
        
        // execute the query
            if (mysql_query('INSERT INTO `'.$table.'` (`'.implode('`,`', $keys).'`) VALUES (\''.implode('\',\'', $values).'\')')) {
                $id = mysql_insert_id();
                $responseFields = array('oldId'=>$fields['created'], 'id'=>$id, 'type'=>$create['type']);
                switch($create['type']) {
                    case 'like':
                    case 'comment':
                        $responseFields['rowId'] = $fields['rowId'];
                        $responseFields['rowType'] = $fields['rowType'];
                }
                    
                array_push($response->queries, new ResponseQuery($responseFields));
            }
            else array_push($response->queries, new ResponseQuery(array('success'=>false)));
        }
        
    // Send the response back
        echo json_encode($response);
    }
    
    function remove($removes) {
        
    }
    
    if (isset($_REQUEST['create']) && !empty($_REQUEST['create'])) create($_REQUEST['create']);
    if (isset($_REQUEST['update']) && !empty($_REQUEST['update'])) update($_REQUEST['update']);
    if (isset($_REQUEST['remove']) && !empty($_REQUEST['remove'])) remove($_REQUEST['remove']);
    
?>