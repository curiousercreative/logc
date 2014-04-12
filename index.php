<?php
  session_start();
  
  include_once('update.php');
  connect();
  mysql_select_db('logc');
  
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
    $query = mysql_query('SELECT * FROM videos ORDER BY id');
    while ($video = mysql_fetch_object($query)) {
      print '<p><a href="/'.$video->id.'">'.$video->title.'</a></p>';
    }
    exit;
  }  
// Video page
  else if (isset($_SESSION['userId'])) {
    $userId = $_SESSION['userId'];
    $videoId = $_REQUEST['videoId'];  
  }
// Log in page
  else {
    echo '<h1>Please enter a handle or email address for us to identify your work by</h1>
    <form action="/">
    <input name="handle" type="text" />
    <input type="hidden" name="videoId" value="'.$_REQUEST['videoId'].'" />
    <input type="submit" value="submit" />
    </form>
    <br />
    <h1>Or you may enter as a guest and view only</h1>
    <form action="/">
      <input name="handle" value="guest" type="hidden" />
      <input type="hidden" name="videoId" value="'.$_REQUEST['videoId'].'" />
      <input type="submit" value="enter as guest" />
    ';
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
?>
<html>
  <head>
    <title>LogC - Community video logging</title>
    <script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="footable/footable.js"></script>
    <script src="logc.js"></script>
    
    <link href="footable/footable.css" rel="stylesheet" />
    <link href="logc.css" rel="stylesheet" />
    <script>
      userId = '<?php print $userId; ?>';
      videoId = '<?php print $videoId; ?>';
    </script>
  </head>
  <body>
    <div class="col_container">
      <div class="half col" id="video_container">
        <video id="video" controls>
          <source src="<?php printVideoSrc($videoId); ?>.mp4" type="video/mp4" />
          <source src="<?php printVideoSrc($videoId); ?>.ogg" type="video/ogg" />
        </video>
        <div id="playback_rate" contenteditable="true" tabIndex="-1">1.0</div>
      </div> <!-- end #video_container -->
    
      <div class="half col" id="legend">
        <h1>Legend</h1>
        *Hold ctrl or cmd while editing a log or transcription note to access these hotkeys
        *Playback speeds will reset to a default playback speed on pause. You can manually
        set this default in the top right of the video
        <dl>
          <dt>j</dt>
            <dd>decrease playback speed 10%</dd>
          <dt>k</dt>
            <dd>Play/pause</dd>
          <dt>l</dt>
            <dd>increase playback speed 10%</dd>
          <dt>space</dt>
            <dd>Play/pause</dd>
          <dt>&larr;</dt>
            <dd>skip back 5 seconds (hold shift for 30)</dd>
          <dt>&rarr;</dt>
            <dd>skip ahead 5 seconds (hold shift for 30)</dd>
          <dt>a</dt>
            <dd>add log note</dd>
          <dt>t</dt>
            <dd>add transcription</dd>
          <dt>s</dt>
            <dd>save local changes to remote database (hold command/ctrl + shift)</dd>
        </dl>
      </div> <!-- end #legend -->
    </div> <!-- end .col_container -->
    
    <table id="log_table" class="footable">
      <thead>
        <tr>
          <th class="timecode">Timecode</th>
          <th class="note">Note</th>
          <th class="type">Type</th>
          <th class="comments">Comments</th>
          <th class="likes">Likes</th>
          <th class="created">Created</th>
          <th class="modified">Modified</th>
          <th class="actions">Actions</th>
          <th class="status">Status</th>
        </tr>
      </thead>
      <tbody>
        <?php printRows($videoId, $userId);?>
      </tbody>
    </table> <!-- end #log_table -->
  </body>
</html>
