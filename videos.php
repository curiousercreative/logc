<html>
    <head><title>LogC - Community video logging</title></head>
    <body>
    <?php
        $query = mysql_query('SELECT * FROM videos ORDER BY id');
        while ($video = mysql_fetch_object($query)) {
          print '<p><a href="/'.$video->id.'">'.$video->title.'</a></p>';
        }
    ?>
    </body>
</html>