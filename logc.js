$(document).ready(function () {
// Vars
  video = $('video').get(0);
  keys = [65, 83, 68, 74, 75, 76, 32, 37, 39];
  editingField = false;
  userId = 0;
  videoId = 0;
  
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
    
  // Classes
    this.Row = function (type, id, fields, inLocalStorage, inDB) {
    // props
      this.type = type;
      this.id = id ? id : log.getTimestamp();
      this.inLocalStorage = inLocalStorage ? true : false;
      this.inDB = inDB ? true : false;
      this.comments = new Array(); // An array of all comments
    
    // Classes
      this.Like = function (parentRow, inLocalStorage, inDB) {
      // Props
        this.id = log.getTimestamp();
        this.parentRow = parentRow;
        this.inLocalStorage = inLocalStorage ? true : false;
        this.inDB = inDB ? true : false;
      
      // Methods
        this.prepFields = function () {
          return {
            'rowType': this.parentRow.type,
            'rowId': this.parentRow.id
          }
        }
        this.destroy = function () {
        // Do I need to be removed from the DB?
          if (this.inDB) {
            log.saveLocal('remove', this);
          }
          else if (this.inLocalStorage) {
            log.removeFromLocalStorage(this.id, create);
          }
        
        // Update like count
          $('.likes', this.parentRow.jObj).html(parseInt($('.likes', this.parentRow.jObj).text()) - 1);
          
        // Update button text
          $('button.like', this.parentRow.jObj).removeClass('liked').text('Like');
        
        // delete yourself
          delete this.parentRow.like;
        }
      
    //== Constructor do
        // Update like count
          $('.likes', this.parentRow.jObj).html(parseInt($('.likes', this.parentRow.jObj).text()) + 1);
          
        // Update button text
          $('button.like', this.parentRow.jObj).addClass('liked').text('Unlike');
        
      // Save to array for updating DB
        if (!this.inDB) {
          log.saveLocal('create', log.prepLogObj('like', this.id, this.prepFields()), this.inLocalStorage);
        }
      }
      
      this.Comment = function () {
        
      }    
    
    
    // methods
      // prepares an object for storing locally and saving to DB
      this.prepFields = function () {
        return {
          'timecode': $('.timecode', this.jObj).attr('data-value'),
          'note': $('.note', this.jObj).text(),
          'created': $('.created', this.jObj).text(),
          'modified': $('.modified', this.jObj).text()
        }
      }
     
      // Creates a row in the browser log table
      this.createTableRow = function (fields) {
      // If this is a first time create, not loaded from storage
        if (!fields) {
          var fields = {
            timecode: video.currentTime,
            created: this.id,
            modified: this.id
          }
        }
        
        var row = $('<tr><td class="timecode"></td><td class="note" contenteditable="true"></td><td class="type"></td><td class="comments">0</td><td class="likes">0</td><td class="created"></td><td class="modified"></td><td><button class="like">Like</button><button class="comment">Comment</button></td><td class="status">Local Only</td></tr>');
        
      // Add class && id to the row
        $(row).attr('id', this.type+this.id).addClass(this.type).find('.type').html(this.type);
        
      // Add a timecode
        $('.timecode', row).attr('data-value', fields.timecode).html(log.formatTimecode(fields.timecode));    
    
      // Add timestamps
        $('.created', row).html(fields.created);      
        $('.modified', row).html(fields.modified);
        
      // Add to the log_table
        $('#log_table tbody').prepend(row);
        
      // Add focus & blur listener for the note
        this.addFocusBlurListener($('.note', row));
        
      // Add click and hover listener for like button
        this.addLikeListeners($(row));
      
      // Add click and hover listener for comment button
        this.addCommentListeners($(row));
        
      // Set focus to the note
        if (fields.note) $('.note', row).text(fields.note);
        else $('.note', row).focus();
        
        return $(row);
      }
      
      // Update a row from localStorage data
      this.updateFromLocalStorage = function (fields) {
      // Update browser
        for (var x in fields) {
          $('.'+x, this.jObj).text(fields[x]);
        }
        
      // Update storages
        for (var x in log.tempStorage.create) {
        // Check to see if it's waiting to be created in the DB and add the updates to it
          if (log.tempStorage.create[x].id == this.id) {
          // Overwrite with update fields
            for (var y in fields) {
              log.tempStorage.create[x].fields[y] = fields[y];
            }
          
          // Save the temp updates to localStorage
            log.updateLocalStorage('create');
            
          // Remove this item from the updates array
            for (var z in this.log.tempStorage.update) {
              if (log.tempStorage.update[z].id == this.id) {
                log.tempStorage.update.splice(z, 1);
              }
            }
          
          // Save the temp updates to localStorage
            log.updateLocalStorage('update');
          }
        }
      }
      
    // Listeners
      this.addFocusBlurListener = function (jObj) {
        jObj.on('focus', function () {
          editingField = true;
          $(this).data('old_value', $(this).text());
        }).on('blur', function () {
          editingField = false;
        // Check to see if the value changed
          if ($(this).data('old_value') !== $(this).text()) {
            log.getRowById($(this).parents('tr').attr('id')).onUpdate({'note': $(this).text()});
          }
        });
      }
      
      this.addLikeListeners = function (jObj) {
      // Click
        $('button.like', jObj).on('click', function (e) {
        // what's my parent's obj?
          var parentRow = log.getRowById($(this).parents('tr').attr('id'));
          
        // Has this user already liked this row?
          if (!parentRow.like) {
          // Hasn't liked it, create a new like
            parentRow.like = new parentRow.Like(parentRow);
          }
          else {
          // they already liked it and now we're unliking it
            parentRow.like.destroy();
          }
        });
        
        $('button.like', jObj).hover(function () {
          if ($(this).hasClass('liked')) {
            $(this).text('Unlike');
          }
        }, function () {
          if ($(this).hasClass('liked')) {
            $(this).text('Liked');
          }
        });
      }
      
      this.addCommentListeners = function (jObj) {
        
      }
      
      this.onUpdate = function (fields) {
        fields.modified = log.getTimestamp();
        
      // Update the stored values
        this.inDB = false;
        this.inLocalStorage = false;
            
      // saveLocal the update
        log.saveLocal('update', log.prepLogObj(this.type, this.id, fields), this.inLocalStorage);
        
      // Update the table modified
        $(this).parents('tr').find('.modified').text(fields.modified);
      }
     
    // Helper methods
      this.getObjById = function (objId) {
      // The rowId is a string as expected
        if (typeof(objId) == 'string') {
          var id = objId.replace(/[^\d]+/g, '');
          var type = objId.replace(/\d+/g, '');
          
          for (var x in this[type+'s']) {
            if (this[type+'s'][x].id == id) return this[type+'s'][x];
          }
        }
      // It's just the id, not good, but whatevs
        else if (typeof(objId) == 'number') {
          var types = ['likes', 'comments'];
          
          for (var x in types) {
            for (var y in this[types[x]]) {
              if (this[type[x]][y].id == objId) return this[type[x]][y];
            }
          }
        }
      }
  
  // == Contructor do
      // Loaded from the DB, exists in markup already
      if (this.inDB) this.jObj = $('#'+this.type + this.id);
      // Loaded from localStorage
      else if (this.inLocalStorage) this.jObj = this.createTableRow(fields);
      // Creating for the first time per user request
      else this.jObj = this.createTableRow();
      
    // Save to our array of all of this type
      log[this.type+"s"].push(this);
      
    // Save to array for updating DB
      if (!this.inDB) {
        log.saveLocal('create', log.prepLogObj(this.type, this.id, this.prepFields()), this.inLocalStorage);
      }
    }
    
  // == Storage methods
    // Saves tempStorage (memory) into browser's persisent localStorage 
    this.updateLocalStorage = function (action) {
    // If there are items to send to the server, JSON stringify it
      if (this.tempStorage[action].length !== 0) {
        localStorage[action] = JSON.stringify(this.tempStorage[action]);
      }
      else delete localStorage[action];
    }
    // Loads localStorage log objects into the temp storage and browser
    this.loadLocalStorage = function () {
    // Load the creates
      if (localStorage.create) {
        var creates = JSON.parse(localStorage.create);
        for (var x in creates) {
          switch(creates[x].type) {
            case 'log':
              new this.Row('log', creates[x].id, creates[x].fields, true);
              break;
            case 'transcription':
              new this.Row('transcription', creates[x].id, creates[x].fields, true);
              break;
            case 'like':
            // Find row parent
              var parentRow = log.getRowById(creates[x].fields.rowId, creates[x].fields.rowType);
              new parentRow.Like(parentRow, creates[x].id, creates[x].fields, true);
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
            case 'log':
              for (var y in this.logs) {
                if (this.logs[y].id == updates[x].id) {
                  this.logs[y].updateFromLocalStorage(updates[x].fields);
                }
              }
              break;
            case 'transcription':
              for (var y in this.transcriptions) {
                if (this.transcriptions[y].id == updates[x].id) {
                  this.transcriptions[y].updateFromLocalStorage(updates[x].fields);
                }
              }
              break;
            case 'like':
              for (var y in this.likes) {
                if (this.likes[y].id == updates[x].id) {
                  this.likes[y].updateFromLocalStorage(updates[x].fields);
                }
              }
              break;
            case 'comment':
              for (var y in this.comments) {
                if (this.comments[y].id == updates[x].id) {
                  this.comments[y].updateFromLocalStorage(updates[x].fields);
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
    // saveLocal to tempStorage and localStorage
    this.saveLocal = function (action, logObj, inLocalStorage) {
    // Add to temp storage
      if (action == 'remove') {
      // Add to temp storage
        log.tempStorage[action].push({
          'type': logObj.type,
          'id': logObj.id
        });
      }
      else {
      // Add me to the correct storage array for DB updating
        if (!this.inDB) {
          this.tempStorage[action].push(logObj);
        }
      }
    
    // Update localStorage
      if (!inLocalStorage) this.updateLocalStorage(action);
    }
    // Saves localStorage to server DB
    this.saveDB = function () {
      $.ajax({
        url: 'update.php',
        data: this.tempStorage,
        success: function (response, status) {
          console.log(response);
        }
      })
    }
    // prepares an object for storing locally and saving to DB
    this.prepLogObj = function (type, id, fields) {
      var logObj = {
        'type': type,
        'id': id,
        'userId': userId,
        'videoId': videoId
      }
      if (fields) logObj.fields = fields;
      
      return logObj;
    }
  
  // Helper methods
    this.formatTimecode = function (secs) {
      time = '';
    
    // Hours
      var hours = parseInt(secs/3600);
      hours = hours > 9 ? hours : "0"+hours;
      secs -= hours*3600;
      
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
    this.getRowById = function (rowId, rowType) {
    // The rowId is a string as expected
      if (typeof(rowId) == 'string') {
        if (rowType) {
          var id = rowId;
          var type = rowType;
        }
        else {
          var id = rowId.replace(/[^\d]+/g, '');
          var type = rowId.replace(/\d+/g, '');  
        }
        
        for (var x in this[type+'s']) {
          if (this[type+'s'][x].id == id) return this[type+'s'][x];
        }
      }
    // It's just the id, not good, but whatevs
      else if (typeof(rowId) == 'number') {
        var types = ['logs', 'transcriptions'];
        
        for (var x in types) {
          for (var y in this[types[x]]) {
            if (this[type[x]][y].id == rowId) return this[type[x]][y];
          }
        }
      }
      
      return false;
    }
    this.removeFromLocalStorage = function(id, actions) {
      if (typeof(actions) == 'string') actions = new Array(actions);
      
      for (x in actions) {
        for (y in this.tempStorage[x]) {
          if (this.tempStorage[x][y].id == id) {
          // Remove from the tempStorage
            this.tempStorage[x].splice(y, 1);
            
          // Update the localStorage
            this.updateLocalStorage(x);
            
            return true;
          }
        }
      }
      
      return false;
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
              new log.Row('log');
              break;
            case 83: //s
              new log.Row('transcription');
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