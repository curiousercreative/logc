$(document).ready(function () {
// Vars
  video = $('video').get(0);
  keys = [65, 83, 68, 74, 75, 76, 32, 37, 39];
  editingField = false;
  
// Classes
  Log = function () {
  // Properties
    this.tempStorage = {
      'create' : new Array(),
      'update' : new Array(),
      'delete' : new Array()
    }
    
    this.logs = new Array(); // An array of all Log notes indexed by created timestamp
    this.transcriptions = new Array(); // An array of all transcriptions indexed by created timestamp
  
  // Classes
    this.Transcription = function (parentLog, fields, inLocalStorage, inDB) {
    // props
      this.log = parentLog;
      this.id = fields ? fields.id : Math.round(new Date().getTime() / 1000);
      this.inLocalStorage = inLocalStorage ? true : false;
      this.DB = inDB ? true : false;
      
    // methods
      this.save = function (action) {
      // Add me to the correct storage array for DB updating
        if (!this.inDB) {
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
          });
        }
        
      // Add me to a general array of my type
        this.log.transcriptions.push(this);
        
      // Ask the log to update localStorage
        if (!this.inLocalStorage) this.log.updateLocalStorage(action);
      }
    
    // Create the row in the log table in browser
      // Loaded from the DB, exists in markup already
      if (this.inDB) this.jObj = $('#trans'+id);
      // Loaded from localStorage
      else if (this.inLocalStorage) this.jObj = this.log.createRow('transcription', this.id, fields);
      // Creating for the first time per user request
      else this.jObj = this.log.createRow('transcription', this.id);
      
    // Save this transcription to the created array & transcription array
      this.save('create');
    }
    
    this.LogNote = function (parentLog, fields, inLocalStorage, inDB) {
    // props
      this.log = parentLog;
      this.id = fields ? fields.id : Math.round(new Date().getTime() / 1000);
      this.inLocalStorage = inLocalStorage ? true : false;
      this.DB = inDB ? true : false;
      
    // methods
      this.save = function (action) {
      // Add me to the correct storage array for DB updating
        if (!this.inDB) {
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
          });
        }
        
      // Add me to a general array of my type
        this.log.logs.push(this);
        
      // Ask the log to update localStorage
        if (!this.inLocalStorage) this.log.updateLocalStorage(action);
      }
    
    // Create the row in the log table in browser
      // Loaded from the DB, exists in markup already
      if (this.inDB) this.jObj = $('#log'+id);
      // Loaded from localStorage
      else if (this.inLocalStorage) this.jObj = this.log.createRow('log', this.id, fields);
      // Creating for the first time per user request
      else this.jObj = this.log.createRow('log', this.id);
      
    // Save this transcription to the created array & transcription array
      this.save('create');
    }
    
    this.Like = function () {
      
    }
    
    this.Comment = function () {
      
    }
  
  // Methods
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
    // Saves tempStorage (memory) into browser's persisent localStorage 
    this.updateLocalStorage = function (action) {
      localStorage[action] = JSON.stringify(this.tempStorage[action]);
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
  
  Player = function () {
  // Props
    this.defaultPlaybackRate = 1.0;
    
  // Methods
    this.ff = function (time) {
      if (!time) time = 5;
      video.currentTime = video.currentTime + time;
    }
    
    this.rr = function (time) {
      if (!time) time = 5;
      video.currentTime = video.currentTime - time;
    }
    
    this.pp = function () {
      if (video.playing) {
        video.pause();
        this.resetPlaybackRate();
      }
      else video.play();
    }
    
    this.faster = function () {
      this.setPlaybackRate(video.playbackRate + 0.1);
    }
    
    this.slower = function () {
      this.setPlaybackRate(video.playbackRate - 0.1);
    }
    
    this.resetPlaybackRate = function () {
      this.setPlaybackRate(this.defaultPlaybackRate);
    }
    
    this.setPlaybackRate = function (val) {
      val = parseInt(val * 10) / 10;
      $('#playback_rate').html(val);
      video.playbackRate = val;
    }
  }
  
// Functions
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
              player.slower();
              break;
            case 75: //k
              player.pp();
              break;
            case 32: //space
              player.pp();
              break;
            case 76: //l
              player.faster();
              break;
            case 37: //<-
              if (e.shiftKey) player.rr(30);
              else player.rr();
              break;
            case 39: //->
              if (e.shiftKey) player.ff(30);
              else player.ff();
              break;
          }  
        }
      }
    }); 
  }
  
  unbindKeys = function () {
    $(window).off('keydown');
  }
  
  
// == Event listeners
  $(video).on('play', function () {
    video.playing = true;
  });
  
  $(video).on('pause', function () {
    video.playing = false;
  });
  
  $('#playback_rate').on('blur', function () {
    var val = parseFloat($(this).html());
    val = val > 0 && val < 8 ? val : 1.0;
    
    player.defaultPlaybackRate = val;
    player.setPlaybackRate(val);
  });
  
// == Do stuff
  log = new Log();
  player = new Player();
  
  bindKeys();
});