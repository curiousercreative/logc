<html>
  <head>
    <title>LogC - Community video logging</title>
    <script src="//code.jquery.com/jquery-1.10.2.min.js"></script>
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
        <div>*Hold ctrl/cmd + shift to access these hotkeys</div>
        <div>*Playback speeds reset to default playback speed on pause.
        You can set default playback speed in the top right of the video player.</div>
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
            <dd>skip back 30 seconds (without shift for 5)</dd>
          <dt>&rarr;</dt>
            <dd>skip ahead 30 seconds (without shift for 5)</dd>
          <dt>a</dt>
            <dd>add log note</dd>
          <dt>d</dt>
            <dd>add transcription</dd>
          <dt>s</dt>
            <dd>save local changes to remote database</dd>
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
