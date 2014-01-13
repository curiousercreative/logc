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
    
    this.logs = new Array(); // An array of all Log notes
    this.transcriptions = new Array(); // An array of all transcriptions
    this.likes = new Array(); // An array of all likes
    this.comments = new Array(); // An array of all transcriptions
    
  // Classes
    this.Row = function (type, parentLog, id, fields, inLocalStorage, inDB) {
    // props
      this.type = type;
      this.log = parentLog;
      this.id = id ? id : this.log.getTimestamp();
      this.inLocalStorage = inLocalStorage ? true : false;
      this.DB = inDB ? true : false;
      
    // storage methods
      this.autosave = function (action, fields) {
      // Add me to the correct storage array for DB updating
        if (!this.inDB) {
          this.log.tempStorage[action].push({
            'type': this.type,
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
        this.log[type+"s"].push(this);
        
      // Ask the log to update localStorage
        if (!this.inLocalStorage) this.log.updateLocalStorage(action);
      }
    
    // Create the row in the log table in browser
      // Loaded from the DB, exists in markup already
      if (this.inDB) this.jObj = $('#'+this.type + this.id);
      // Loaded from localStorage
      else if (this.inLocalStorage) this.jObj = this.log.createRow(this.type, this.id, fields);
      // Creating for the first time per user request
      else this.jObj = this.log.createRow(this.type, this.id);
      
    // Save this transcription to the created array & transcription array
      this.autosave('create');
    }
    
    this.Like = function () {
      
    }
    
    this.Comment = function () {
      
    }
  
  // Methods
    // Create a row in the log table
    this.createRow = function (type, id, fields) {
    // If this is a first time create, not loaded from storage
      if (!fields) {
        var fields = {
          timecode: video.currentTime,
          created: id,
          modified: id
        }
      }
      
      var row = $('<tr><td class="timecode"></td><td class="note" contenteditable="true"></td><td class="type"></td><td class="comments">0</td><td class="likes">0</td><td class="created"></td><td class="modified"></td><td><button>Like</button><button>Comment</button></td><td class="status">Local Only</td></tr>');
      
    // Add class && id to the row
      $(row).attr('id', type+id).addClass(type).find('.type').html(type);
      
    // Add a timecode
      $('.timecode', row).attr('data-value', fields.timecode).html(log.formatTimecode(fields.timecode));    
  
    // Add timestamps
      $('.created', row).html(fields.created);      
      $('.modified', row).html(fields.modified);
      
    // Add to the log_table
      $('#log_table tbody').prepend(row);
      
    // Add event listener
      $('.note', row).on('focus', function () {
        editingField = true;
        $(this).data('old_value', $(this).text());
      }).on('blur', function () {
        editingField = false;
        if ($(this).data('old_value') !== $(this).text()) {
          var id = parseInt($(this).parents('tr').attr('id'));
          var type = $(this).parents('tr').find('.type').html()+'s';
          var note = $(this).text();
          var modified = log.getTimestamp();
          
        // Update the stored values
          for (var x in log[type]) {
            if (log[type][x].id == id) {
            // remove the storage flags on this log object
              log[type][x].inDB = false;
              log[type][x].inLocalStorage = false;
              
            // autosave the update
              log[type][x].autosave('update', {'note':note, 'modified': modified});
            }
          }
          
        // Update the table modified
          $(this).parents('tr').find('.modified').text(modified);
        }
      });
    
    // Set focus to the note
      if (fields.note) $('.note', row).text(fields.note);
      else $('.note', row).focus();
      
      return $(row);
    }
    // Saves tempStorage (memory) into browser's persisent localStorage 
    this.updateLocalStorage = function (action) {
      localStorage[action] = JSON.stringify(this.tempStorage[action]);
    }
    // Loads localStorage log objects
    this.loadLocalStorage = function () {
    // Load the creates
      if (localStorage.create) {
        var creates = JSON.parse(localStorage.create);
        for (var x in creates) {
          switch(creates[x].type) {
            case 'log':
              new this.Row('log', this, creates[x].id, creates[x].fields, true);
              break;
            case 'transcription':
              new this.Row('transcription', this, creates[x].id, creates[x].fields, true);
              break;
            case 'like':
              new this.Like(this, creates[x].id, creates[x].fields, true);
              break;
            case 'comment':
              new this.Comment(this, creates[x].id, creates[x].fields, true);
              break;
          }
        }
      }
      
    // Load the updates
      if (localStorage.update) {
        var updates = JSON.parse(localStorage.update);
        for (var x in updates) {
          switch(updates[x].type) {
            case 'log_notes':
              for (var y in this.logs) {
                if (this.logs[y].id == updates[x].id) {
                  this.logs[y].updateFromStorage(updates[x].fields);
                }
              }
              break;
            case 'transcriptions':
              for (var y in this.transcriptions) {
                if (this.transcriptions[y].id == updates[x].id) {
                  this.transcriptions[y].updateFromStorage(updates[x].fields);
                }
              }
              break;
            case 'likes':
              for (var y in this.likes) {
                if (this.likes[y].id == updates[x].id) {
                  this.likes[y].updateFromStorage(updates[x].fields);
                }
              }
              break;
            case 'comments':
              for (var y in this.comments) {
                if (this.comments[y].id == updates[x].id) {
                  this.comments[y].updateFromStorage(updates[x].fields);
                }
              }
              break;
          }
        }
      }
    
    // Load the deletes
       if (localStorage.remove) {
        var removes = JSON.parse(localStorage.remove);
        for (var x in removes) {
          switch(removes[x].type) {
            case 'log_notes':
              for (var y in this.logs) {
                if (this.logs[y].id == removes[x].id) {
                  this.logs[y].remove(removes[x].fields);
                }
              }
              break;
            case 'transcriptions':
              for (var y in this.transcriptions) {
                if (this.transcriptions[y].id == removes[x].id) {
                  this.transcriptions[y].remove(removes[x].fields);
                }
              }
              break;
            case 'likes':
              for (var y in this.likes) {
                if (this.likes[y].id == removes[x].id) {
                  this.likes[y].remove(removes[x].fields);
                }
              }
              break;
            case 'comments':
              for (var y in this.comments) {
                if (this.comments[y].id == removes[x].id) {
                  this.comments[y].remove(removes[x].fields);
                }
              }
              break;
          }
        }
      }
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
    this.getTimestamp = function () {
      return Math.round(new Date().getTime() / 1000); 
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
              new log.Row('log', log);
              break;
            case 83: //s
              new log.Row('transcription', log);
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
  log.loadLocalStorage();
  
  player = new Player();
  
  bindKeys();
});