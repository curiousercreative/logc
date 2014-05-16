<?php
  session_start();
  
  include_once('update.php');
  $GLOBALS['db'] = connect();
  $db = &$GLOBALS['db'];
  
// Decide what to show
// Logging in/creating an account request
  if (isset($_REQUEST['handle']) && !empty($_REQUEST['handle'])) {
    $handle = $GLOBALS['db']->real_escape_string($_REQUEST['handle']);
    
  // See if the handle already exists
    $query = $GLOBALS['db']->query('SELECT * FROM users WHERE handle="'.$handle.'"');
    if ($query->num_rows > 0) {
      $user = $query->fetch_object();
      $userId = $user->id;
      $_SESSION['userId'] = $userId;
      $_SESSION['superuser'] = $user->superuser == 1 ? true : false;
    }
  // Doesn't exist, create a new one
    else {
      $query = $GLOBALS['db']->query('INSERT INTO users SET handle="'.$handle.'"');
      if ($query) {
        $userId = $GLOBALS['db']->insert_id();
        $_SESSION['userId'] = $userId;
        $_SESSION['superuser'] = false;
      }
      else {
        echo 'Could not create new user: '.$GLOBALS['db']->error();
        exit;
      }
    }
    
    header('Location: /'.$_REQUEST['videoId']);
    exit;
  }
// Story 
// Index of all videos
  else if (!isset($_REQUEST['videoId']) || empty($_REQUEST['videoId'])) {
    include(dirname(__FILE__) . '/videos.php');
    exit;
  }  
// Video page
  else if (isset($_SESSION['userId'])) {
    $userId = $_SESSION['userId'];
    $videoId = $_REQUEST['videoId'];
  }
// Log in page
  else {
    include(dirname(__FILE__) . '/login.php');
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
    $query = $GLOBALS['db']->query('SELECT * FROM rows WHERE videoId='.$GLOBALS['db']->real_escape_string($videoId).' ORDER BY timecode');
    while ($log = $query->fetch_object()) {
      $commentQuery = $GLOBALS['db']->query('SELECT * FROM comments WHERE rowId='.$log->id);
      $commentCount = $commentQuery->num_rows;
      
      $likeQuery = $GLOBALS['db']->query('SELECT * FROM likes WHERE rowId='.$log->id);
      $likeCount = $likeQuery->num_rows;
      $likeButton = '<button class="like">Like</button>';
      while ($like = $likeQuery->fetch_object()) {
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
    $query = $GLOBALS['db']->query('SELECT src FROM videos WHERE id='.$GLOBALS['db']->real_escape_string($videoId));
    print str_replace('.mp4', '', $query->fetch_object()->src);
  }

  include(dirname(__FILE__) . '/video.php');
?>