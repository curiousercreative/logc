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
         $results = array();
    
    // iterate through queries, adding each to our response
        foreach ($updates AS $update) {
        // Build our fields array
            $fields = $update['fields'];
            switch ($update['type']) {
                case 'log':
                case 'transcription':
                    $fields['type'] = $update['type'];
                    $fields['modifiedLastBy'] = $update['userId'];
                    $table = 'rows';
                    break;
            }
        
        // Build our query    
            $set = '';
            foreach($fields AS $key => $val) {
                $set .= " ".mysql_real_escape_string($key)."='".mysql_real_escape_string($val)."',";
            }
            $set = trim($set, ',');
            
            $query = 'UPDATE `'.$table.'` SET'.$set.' WHERE id='.$update['id'].' LIMIT 1';
            
        // execute the query
            if (mysql_query($query)) {
                $responseFields = array('id'=>$update['id'], 'oldId'=>$update['id'], 'type'=>$update['type'], 'action'=>'update');
                    
                array_push($results, new ResponseQuery($responseFields));
            }
            else array_push($results, new ResponseQuery(array('success'=>false)));
        }
        
        return $results;
    }
    
    function create($creates) {
        $results = array();
    
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
                    $table = 'rows';
                    break;
                case 'like':
                case 'comment':
                    $fields['userId'] = $create['userId'];
                    $table = $create['type'].'s';
            }
            $fields['videoId'] = $create['videoId'];
        
        // Build our query    
            $values = array_map('mysql_real_escape_string', array_values($fields));
            $keys = array_keys($fields);
            $query = 'INSERT INTO `'.$table.'` (`'.implode('`,`', $keys).'`) VALUES (\''.implode('\',\'', $values).'\')';
        
        // execute the query
            if (mysql_query($query)) {
                $id = mysql_insert_id();
                $responseFields = array('oldId'=>$create['id'], 'id'=>$id, 'type'=>$create['type'], 'action'=>'create');
                switch($create['type']) {
                    case 'like':
                    case 'comment':
                        $responseFields['rowId'] = $fields['rowId'];
                }
                    
                array_push($results, new ResponseQuery($responseFields));
            }
            else array_push($results, new ResponseQuery(array('success'=>false)));
        }
        
        return $results;
    }
    
    function remove($removes) {     
        $results = array();
    
    // iterate through queries, adding each to our response
        foreach ($removes AS $remove) {
        // Build our query
            $table = $remove['type'] == 'transcription' || $remove['type'] == 'log' ? 'rows' : $remove['type'].'s';
            $query = 'DELETE FROM `'.$table.'` WHERE id='.$remove['id'];
        
        // execute the query
            if (mysql_query($query)) {
                $responseFields = array('oldId'=>$remove['id'], 'type'=>$remove['type'], 'action'=>'remove');
                switch($remove['type']) {
                    case 'like':
                    case 'comment':
                        $responseFields['rowId'] = $fields['rowId'];
                        $responseFields['rowType'] = $fields['rowType'];
                }
                array_push($results, new ResponseQuery($responseFields));
            }
            else array_push($results, new ResponseQuery(array('success'=>false)));
        }
        
        return $results;
    }
    
// Log updates
    if (
        (isset($_REQUEST['remove']) && !empty($_REQUEST['remove']))
        || (isset($_REQUEST['update']) && !empty($_REQUEST['update']))
        || (isset($_REQUEST['create']) && !empty($_REQUEST['create']))
    ) {
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
        
        
        if (isset($_REQUEST['create']) && !empty($_REQUEST['create'])) $response->queries = array_merge($response->queries, create($_REQUEST['create']));
        if (isset($_REQUEST['update']) && !empty($_REQUEST['update'])) $response->queries = array_merge($response->queries, update($_REQUEST['update']));
        if (isset($_REQUEST['remove']) && !empty($_REQUEST['remove'])) $response->queries = array_merge($response->queries, remove($_REQUEST['remove']));
        
        
        echo json_encode($response);
    }
// weird bulk video importing thing from hitrecord
    else if (isset($_REQUEST['videos']) && !empty($_REQUEST['videos'])) {
        $videos = json_decode($_REQUEST['videos']);
        $videos = array_reverse($videos);
        
        connect();
        mysql_select_db('logc');
        foreach($videos AS $video) {
            mysql_query('INSERT INTO `videos` (`src`, `title`) VALUES (\''.$video->src.'\', \''.$video->title.'\')');
        }
    }
    
?>