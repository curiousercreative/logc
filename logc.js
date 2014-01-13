$(document).ready(function () {
// Vars
  video = $('video').get(0);
  keys = [65, 83, 68, 74, 75, 76, 32, 37, 39];
  editingField = false;
  defaultPlaybackRate = 1.0;
  
// Classes
  Log = function () {
    this.tempStorage = {
      'create' : new Array(),
      'update' : new Array(),
      'delete' : new Array()
    }
    
    this.logs = new Array(); // An array of all Log notes indexed by created timestamp
    this.transcriptions = new Array(); // An array of all transcriptions indexed by created timestamp
  
  // Create a row in the log table
    this.createRow = function (type, timestamp) {
      var note = $('<tr><td class="timecode"></td><td class="note" contenteditable="true"></td><td class="type"></td><td class="comments">0</td><td class="likes">0</td><td class="created"></td><td class="modified"></td><td><button>Like</button><button>Comment</button></td><td class="status">Local Only</td></tr>');
      
    // Add class to the row
      $(note).addClass(type).find('.type').html(type);
      
    // Add a timecode
      $('.timecode', note).attr('data-value', video.currentTime).html(log.formatTimecode(video.currentTime));    
  
    // Add a timestamp
      $('.created, .modified', note).html(timestamp);
      
    // Add to the log_table
      $('#log_table tbody').prepend(note);
      
    // Add event listener
      $('.note', note).on('focus', function () {
        editingField = true;
      }).on('blur', function () {
        editingField = false;
      });
    
    // Set focus to the note
      $('.note', note).focus();
      
      return $(note);
    }
    
    this.updateLocalStorage = function (action) {
      localStorage[action] = JSON.stringify(this.tempStorage[action]);
    }
    
    this.Transcription = function (parentLog) {
    // props
      this.log = parentLog;
      this.id = Math.round(new Date().getTime() / 1000);
      
    // methods
      this.save = function (action) {
      // Add me to the correct storage array for DB updating
        this.log.tempStorage[action].push({
          'type': 'transcriptions',
          'id': this.id,
          'fields': {
            'timecode': $('.timecode', this.jObj).attr('data-value'),
            'note': $('.note', this.jObj).text(),
            'created': this.id,
            'modified': this.id,
            'userId': 0
          }
        })
        
      // Add me to a general array of my type
        this.log.transcriptions.push(this);
        
      // Ask the log to update localStorage
        this.log.updateLocalStorage(action);
      }
    
    // Create the row in the log table in browser
      this.jObj = this.log.createRow('transcription', this.id);
      
    // Save this transcription to the created array & transcription array
      this.save('create');
    }
    
    this.LogNote = function (parentLog) {
      // props
      this.log = parentLog;
      this.id = Math.round(new Date().getTime() / 1000);
      
    // methods
      this.save = function (action) {
      // Add me to the correct storage array for DB updating
        this.log.tempStorage[action].push({
          'type': 'log_notes',
          'id': this.id,
          'fields': {
            'timecode': $('.timecode', this.jObj).attr('data-value'),
            'note': $('.note', this.jObj).text(),
            'created': this.id,
            'modified': this.id,
            'userId': 0
          }
        })
        
      // Add me to a general array of my type
        this.log.logs.push(this);
        
      // Ask the log to update localStorage
        this.log.updateLocalStorage(action);
      }
    
    // Create the row in the log table in browser
      this.jObj = this.log.createRow('log', this.id);
      
    // Save this transcription to the created array & transcription array
      this.save('create');
    }
    
    this.Like = function () {
      
    }
    
    this.Comment = function () {
      
    }
    
  // Helper methods
    this.formatTimecode = function (secs) {
      time = '';
    
    // Hours
      var hours = parseInt(secs/3600);
      hours = hours > 9 ? hours : "0"+hours;
      secs -= hours*360;
      
    // Minutes
      var minutes = parseInt(secs/60);
      minutes = minutes > 9 ? minutes : "0"+minutes;
      secs -= minutes*60;
      
    // Seconds
      var seconds = parseInt(secs);
      seconds = seconds > 9 ? seconds : "0"+seconds;
      secs -= seconds;
      
    // Frames
      var frames = Math.round(24*secs);
      frames = frames > 9 ? frames : "0"+frames;
      
      return hours+":"+minutes+":"+seconds+":"+frames;
    }
  }
  
  // player 
  ff = function (time) {
    if (!time) time = 5;
    video.currentTime = video.currentTime + time;
  }
  
  rr = function (time) {
    if (!time) time = 5;
    video.currentTime = video.currentTime - time;
  }
  
  pp = function () {
    if (video.playing) {
      video.pause();
      resetPlaybackRate();
    }
    else video.play();
  }
  
  faster = function () {
    setPlaybackRate(video.playbackRate + 0.1);
  }
  
  slower = function () {
    setPlaybackRate(video.playbackRate - 0.1);
  }
  
  resetPlaybackRate = function () {
    setPlaybackRate(defaultPlaybackRate);
  }
  
  setPlaybackRate = function (val) {
    val = parseInt(val * 10) / 10;
    $('#playback_rate').html(val);
    video.playbackRate = val;
  }
  
  bindKeys = function () {
    $(window).keydown(function (e) {
      if (keys.indexOf(e.which) != -1) {
        if (!editingField || e.metaKey) {
          e.preventDefault();
          switch (e.which) {
            case 65: //a
              new log.LogNote(log);
              break;
            case 83: //s
              new log.Transcription(log);
              break;
            case 68: //d
              //new comment();
              break;
            case 74: //j
              slower();
              break;
            case 75: //k
              pp();
              break;
            case 32: //space
              pp();
              break;
            case 76: //l
              faster();
              break;
            case 37: //<-
              if (e.shiftKey) rr(30);
              else rr();
              break;
            case 39: //->
              if (e.shiftKey) ff(30);
              else ff();
              break;
          }  
        }
      }
    }); 
  }
  
  unbindKeys = function () {
    $(window).off('keydown');
  }
  
// Event listeners
  $(video).on('play', function () {
    video.playing = true;
  });
  
  $(video).on('pause', function () {
    video.playing = false;
  });
  
  $('#playback_rate').on('blur', function () {
    var val = parseFloat($(this).html());
    val = val > 0 && val < 8 ? val : 1.0;
    
    defaultPlaybackRate = val;
    setPlaybackRate(val);
  });
  
// Do stuff
  log = new Log();
  bindKeys();
});