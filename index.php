<?php
  include_once('update.php');
  connect();
  mysql_select_db('logc');
  
  //$userId = $_SESSION['userId'];
  $userId = 0;
  
  if (isset($_REQUEST['videoId']) && !empty($_REQUEST['videoId'])) {
    $videoId = $_REQUEST['videoId'];  
  }
  else {
    include_once('update.php');
    $query = mysql_query('SELECT * FROM videos ORDER BY id');
    while ($video = mysql_fetch_object($query)) {
      print '<p><a href="/'.$video->id.'">'.$video->title.'</a></p>';
    }
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
      $commentQuery = mysql_query('SELECT parentId FROM comments WHERE parentId='.$log->id);
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
    print mysql_fetch_object($query)->src;
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
      userId = '0';
      videoId = '<?php print $videoId; ?>';
    </script>
  </head>
  <body>
    <div class="col_container">
      <div class="half col" id="video_container">
        <video id="video" controls>
          <source src="<?php printVideoSrc($videoId); ?>" type="video/mp4">
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
          <dt>s</dt>
            <dd>add transcription</dd>
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
