<html>
    <head><title>LogC - Community video logging</title></head>
    <body>
        <h1>Please enter a handle or email address for us to identify your work by</h1>
        <form action="/">
        <input name="handle" type="text" />
        <input type="hidden" name="videoId" value="<?php print $_REQUEST['videoId']; ?>" />
        <input type="submit" value="submit" />
        </form>
        <br />
        <h1>Or you may enter as a guest and view only</h1>
        <form action="/">
          <input name="handle" value="guest" type="hidden" />
          <input type="hidden" name="videoId" value="<?php print $_REQUEST['videoId']; ?>" />
          <input type="submit" value="enter as guest" />
        </form>
    </body>
</html>