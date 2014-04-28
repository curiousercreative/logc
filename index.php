<?php
  session_start();
  
  include_once('update.php');
  connect();
  mysql_select_db('dev_logc');
  
// Decide what to show
// Logging in/creating an account request
  if (isset($_REQUEST['handle']) && !empty($_REQUEST['handle'])) {
    $handle = mysql_real_escape_string($_REQUEST['handle']);
    
  // See if the handle already exists
    $query = mysql_query('SELECT * FROM users WHERE handle="'.$handle.'"');
    if (mysql_numrows($query) > 0) {
      $user = mysql_fetch_object($query);
      $userId = $user->id;
      $_SESSION['userId'] = $userId;
      $_SESSION['superuser'] = $user->superuser == 1 ? true : false;
    }
  // Doesn't exist, create a new one
    else {
      $query = mysql_query('INSERT INTO users SET handle="'.$handle.'"');
      if ($query) {
        $userId = mysql_insert_id();
        $_SESSION['userId'] = $userId;
        $_SESSION['superuser'] = false;
      }
      else {
        echo 'Could not create new user: '.mysql_error();
        exit;
      }
    }
    
    header('Location: /'.$_REQUEST['videoId']);
    exit;
  }
// Index of all videos
  else if (!isset($_REQUEST['videoId']) || empty($_REQUEST['videoId'])) {
    include(dirname(__FILE__) . 'videos.php');
    exit;
  }  
// Video page
  else if (isset($_SESSION['userId'])) {
    $userId = $_SESSION['userId'];
    $videoId = $_REQUEST['videoId'];
  }
// Log in page
  else {
    include(dirname(__FILE__) . 'login.php');
    exit;
  }
  
  function formatTimecode($secs) {
  // hours
    $hours = intval($secs/3600);
    $hours = $hours > 9 ? $hours : "0".$hours;
    $secs -= $hours*3600;
    
  // $minutes
    $minutes = intval($secs/60);
    $minutes = $minutes > 9 ? $minutes : "0".$minutes;
    $secs -= $minutes*60;
    
  // $seconds
    $seconds = intval($secs);
    $seconds = $seconds > 9 ? $seconds : "0".$seconds;
    $secs -= $seconds;
    
  // $frames
    $frames = round(24*$secs);
    $frames = $frames > 9 ? $frames : "0".$frames;
    
    return $hours.":".$minutes.":".$seconds.":".$frames;
  }
  
  function printRows($videoId, $userId) {
    $query = mysql_query('SELECT * FROM rows WHERE videoId='.mysql_real_escape_string($videoId).' ORDER BY timecode');
    while ($log = mysql_fetch_object($query)) {
      $commentQuery = mysql_query('SELECT * FROM comments WHERE rowId='.$log->id);
      $commentCount = mysql_num_rows($commentQuery);
      
      $likeQuery = mysql_query('SELECT * FROM likes WHERE rowId='.$log->id);
      $likeCount = mysql_num_rows($likeQuery);
      $likeButton = '<button class="like">Like</button>';
      while ($like = mysql_fetch_object($likeQuery)) {
        if ($like->userId == $userId) {
          $likeButton = '<button class="like liked" id="like'.$like->id.'">Liked</button>';
          break;
        }
      }

      echo '<tr id="'.$log->type.$log->id.'" class="'.$log->type.'">
      <td class="timecode" data-value="'.$log->timecode.'">'.formatTimecode($log->timecode).'</td>
      <td class="note" contenteditable="true">'.$log->note.'</td>
      <td class="type">'.$log->type.'</td>
      <td class="comments">'.$commentCount.'</td>
      <td class="likes">'.$likeCount.'</td>
      <td class="created">'.$log->created.'</td>
      <td class="modified">'.$log->modified.'</td>
      <td class="actions">'.$likeButton.'<button class="delete">delete</button><!-- <button class="comment">Comment</button> --></td>
      <td class="status">Remote</td>
    </tr>';
    }
  }
  function printVideoSrc($videoId) {
    $query = mysql_query('SELECT src FROM videos WHERE id='.mysql_real_escape_string($videoId));
    print str_replace('.mp4', '', mysql_fetch_object($query)->src);
  }

  include(dirname(__FILE__) . 'video.php');
?>