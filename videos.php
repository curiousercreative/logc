<html>
    <head>
        <title>LogC - Community video logging</title>
        <style>
            h1 {
                font-size: 1.25em;
                margin: 1em 0 0.25em;
            }
            
            p {
                margin: 0.25em 0;
            }
        </style>
    </head>
    <body>
        <div style="margin: 0px auto; max-width: 600px;">
        <?php
            $query = mysql_query('SELECT * FROM stories ORDER BY ordering');
            while ($story = mysql_fetch_object($query)) {
              if ($story->id % 100000000 != 0) {
                print '<span>'.$story->title.'</span>'; 
              }
              else {
                $i = $story->id/100000000;
                print '<h1>'.$i.'. '.$story->title.'</h1><p>'.$story->story_text.'</p>';
              }
            }
            
            $query = mysql_query('SELECT * FROM videos ORDER BY id');
            while ($video = mysql_fetch_object($query)) {
              print '<p><a href="/'.$video->id.'">'.$video->id.' - '.$video->title.'</a></p>';
            }
        ?>
        </div>
    </body>
</html>