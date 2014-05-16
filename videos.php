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
            
            .heading {
                font-size: 1.25em;
                font-weight: bold;
                margin: 0.75em 0;
            }
        </style>
    </head>
    <body>
        <div style="margin: 0px auto; max-width: 600px;">
        <?php
            $query = $GLOBALS['db']->query('SELECT * FROM stories ORDER BY ordering');
            while ($story = $query->fetch_object()) {
              if ($story->ordering === 0 || $story->ordering % 100000000 != 0) {
                print '<div class="heading">'.$story->title.'</div>'; 
              }
              else {
                $i = $story->ordering/100000000;
                print '<h1>'.$i.'. '.$story->title.'</h1><p>'.$story->story_text.'</p>';
              }
            }
            
            $query = $GLOBALS['db']->query('SELECT * FROM videos ORDER BY id');
            while ($video = $query->fetch_object()) {
              print '<p><a href="/'.$video->id.'">'.$video->id.' - '.$video->title.'</a></p>';
            }
        ?>
        </div>
    </body>
</html>