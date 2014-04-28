<html>
    <head><title>LogC - Community video logging</title></head>
    <body>
    <?php
        $query = mysql_query('SELECT * FROM stories ORDER BY order');
        while ($story = mysql_fetch_object($query)) {
          print '<h1>'.$story->title.'</h1><p>'.$story->story_text.'</p>';
        }
        
        $query = mysql_query('SELECT * FROM videos ORDER BY id');
        while ($video = mysql_fetch_object($query)) {
          print '<p><a href="/'.$video->id.'">'.$video->title.'</a></p>';
        }
    ?>
    </body>
</html>