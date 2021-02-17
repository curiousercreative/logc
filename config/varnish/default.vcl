vcl 4.0;

acl purge_hosts {
  "localhost";
  "web";
  # "cms";
  "192.168.0.0/16";
}

backend default {
  .host = "web";
  .port = "3000";
}
# backend cms {
#   .host = "cms";
#   .port = "1337";
# }

sub vcl_recv {
  # if (req.http.host == "cms.logc.curiousercreative.com") {
  #   set req.backend_hint = foo;
  # } elsif (req.http.host ~ "bar.com") {
  #   set req.backend_hint = bar;
  # }

  # Implementing websocket support (https://www.varnish-cache.org/docs/4.0/users-guide/vcl-example-websockets.html)
  if (req.http.Upgrade ~ "(?i)websocket") {
    return (pipe);
  }

  # if (req.url ~ "^/websocket" || req.url == "/") {
  #   return (pass);
  # }

  # forward client ip with backend reqeust
  if (req.restarts == 0) {
    if (req.http.X-Forwarded-For) {
      set req.http.X-Forwarded-For = req.http.X-Forwarded-For + ", " + client.ip;
    } else {
      set req.http.X-Forwarded-For = client.ip;
    }
  }



  # handle purges
  if (req.method == "PURGE") {
    call purge_recv;
  }
}

sub vcl_pipe {
  if (req.http.upgrade) {
    set bereq.http.upgrade = req.http.upgrade;
    set bereq.http.connection = req.http.connection;
  }

  return (pipe);
}

sub vcl_backend_response {
  # we need this set in order to ban based on this field
  set beresp.http.x-url = bereq.url;
}

sub vcl_deliver {
  unset resp.http.x-url;
  if (obj.hits > 0) { # Add debug header to see if it's a HIT/MISS and the number of hits, disable when not needed
    set resp.http.X-Cache = "HIT";
  } else {
    set resp.http.X-Cache = "MISS";
  }

  set resp.http.X-Cache-Hits = obj.hits;
}

sub vcl_purge {
  # acknowledge purge processing
  if (req.http.x-ban-url-pattern) {
    return(synth(418, "Purged: " + req.url + ". Banned: " + req.http.x-ban-url-pattern));
  } else {
    return(synth(418, "Purged: " + req.url + "."));
  }
}

sub vcl_synth {
  # Create our synthetic response
  synthetic(resp.reason);

  # purges
  if (resp.status == 418) {
    # Set success response after we've generated response body, otherwise body will
    # be overwritten to "OK"
    set resp.status = 200;
  }

  return(deliver);
}

sub purge_recv {
  if (!client.ip ~ purge_hosts) {
    return(synth(405, "Not allowed."));
  }

  if (req.http.x-ban-url-pattern) {
    # We've received a pattern for banning
    ban("obj.http.x-url ~ " + req.http.x-ban-url-pattern);
    if (!req.http.x-purge-me) {
      return(synth(418, "Ban added " + req.http.x-ban-url-pattern));
    }
  }
  if (req.http.x-purge-me) {
    return(purge);
  }
}
