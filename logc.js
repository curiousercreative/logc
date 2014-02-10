$(document).ready(function () {
// Vars
  video = $('video').get(0);
  keys = [65, 83, 68, 74, 75, 76, 32, 37, 39]; // keys we are binding event listeners to
  editingField = false;
  userId = 0;
  videoId = 0;
  actions = ['create', 'update', 'delete'];
  
// Classes
  Log = function () {
  // Properties
    this.tempStorage = {
      'create' : new Array(),
      'update' : new Array(),
      'delete' : new Array()
    }
    this.rows = new Array(); // An array of all rows
    
  // Classes
    this.Row = function (type, id, fields, inLocalStorage, inDB) {
    // props
      this.type = type;
      this.id = id ? id : log.getTimestamp();
      this.inLocalStorage = inLocalStorage ? true : false;
      this.inDB = inDB ? true : false;
      this.comments = new Array(); // An array of all comments
    
    // Classes
      this.Like = function (parentRow, id, inLocalStorage, inDB) {
      // Props
        this.id = id ? id : log.getTimestamp();
        this.parentRow = parentRow;
        this.inLocalStorage = inLocalStorage ? true : false;
        this.inDB = inDB ? true : false;
      
      // Methods
        this.prepFields = function () {
          return {
            'rowId': this.parentRow.id
          }
        }
        this.destroy = function () {
        // Do I need to be removed from the DB?
          if (this.inDB) {
            log.addToLocal('remove', this);
          }
          else if (this.inLocalStorage) {
            log.removeFromLocal(this.id, ['create']);
            log.updateLocalStorage(['create']);
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
          log.addToLocal('create', log.prepLogObj('like', this.id, this.prepFields()), this.inLocalStorage);
          this.inLocalStorage = true;
        }
      }
      
      this.Comment = function (parentRow, id, inLocalStorage, inDB) {
      // Props
        this.id = id ? id : log.getTimestamp();
        this.parentRow = parentRow;
        this.inLocalStorage = inLocalStorage ? true : false;
        this.inDB = inDB ? true : false;
        this.jObj = $('#comment'+id, parentRow.jObj);
      
      // Methods
        this.prepFields = function () {
          return {
            'rowId': this.parentRow.id,
            'note': this.jObj.text()
          }
        }
        this.destroy = function () {
        // Do I need to be removed from the DB?
          if (this.inDB) {
            log.addToLocal('remove', this);
          }
          else if (this.inLocalStorage) {
            log.removeFromLocal(this.id, ['create']);
            log.updateLocalStorage(['create']);
          }
          else {
            log.removeFromLocal(this.id, ['update']);
            log.updateLocalStorage(['update']);
          }
        
        // Update like count
          $('.comments', this.parentRow.jObj).html(parseInt($('.comments', this.parentRow.jObj).text()) - 1);
        
        // delete yourself
          for (var x in this.parentRow.comments) {
            if (this.parentRow.comments[x] == this) delete this.parentRow.comments[x];
          }
          delete this;
        }
      
    //== Constructor do        
      // Update like count
          $('.comments', this.parentRow.jObj).html(parseInt($('.comments', this.parentRow.jObj).text()) + 1);
      
      // Save to array for updating DB
        if (!this.inDB) {
          log.addToLocal('create', log.prepLogObj('comment', this.id, this.prepFields()), this.inLocalStorage);
          this.inLocalStorage = true;
        }
        
      // Listen for blurs
        this.jObj.on('blur', function () {
        // Check to see if anything was changed
          if (this.jObj.data('content') !== this.jObj.text()) {
          // Update the data attribute
            this.jObj.data('content', this.jObj.text());
            
          // Update the local storage
          //TODO
          }
        });
      }    
    
    
    // methods
      // prepares an object for storing locally and saving to DB
      this.prepFields = function () {
        return {
          timecode: $('.timecode', this.jObj).attr('data-value'),
          note: $('.note', this.jObj).text(),
          created: $('.created', this.jObj).text(),
          modified: $('.modified', this.jObj).text()
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
        
        // this is a table within a table for commenting purposes
        //var row = $('<tr><td colspan="9"><table><tbody><tr><td class="timecode"></td><td class="note" contenteditable="true"></td><td class="type"></td><td class="comments">0</td><td class="likes">0</td><td class="created"></td><td class="modified"></td><td class="actions"><button class="like">Like</button><button class="comment">Comment</button></td><td class="status">Local Only</td></tr></tbody></table></td></tr>');
        
        var row = $('<tr><td class="timecode"></td><td class="note" contenteditable="true"></td><td class="type"></td><td class="comments">0</td><td class="likes">0</td><td class="created"></td><td class="modified"></td><td class="actions"><button class="like">Like</button><!-- <button class="comment">Comment</button> --></td><td class="status">Local Only</td></tr>');
        
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
            log.updateLocalStorage(['create']);
            
          // Remove this item from the updates array
            for (var z in log.tempStorage.update) {
              if (log.tempStorage.update[z].id == this.id) {
                log.tempStorage.update.splice(z, 1);
              }
            }
          
          // Save the temp updates to localStorage
            log.updateLocalStorage(['update']);
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
            log.getRowById($(this).parents('tr').attr('id')).onUpdate();
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
      
      this.onUpdate = function () {
      // Update the table modified
        $(this.jObj).find('.modified').text(log.getTimestamp());
        
      // Update the stored values
        this.inLocalStorage = false;
            
        var action = this.inDB ? 'update' : 'create';
            
      // addToLocal the update
        log.addToLocal(action, log.prepLogObj(this.type, this.id, this.prepFields()), this.inLocalStorage);
      }
     
    // Helper methods
      this.getCommentById = function (cId) {
        var type = 'comment';
        
      // The commentId came with the type prepended to it
        if (typeof(cId) == 'string') {
          var id = cId.replace(/[^\d]+/g, '');
        }
        
        for (var x in this[type+'s']) {
          if (this[type+'s'][x].id == id) return this[type+'s'][x];
        }
        
        return false;
      }
  
  // == Contructor do
      // Loaded from the DB, exists in markup already
      if (this.inDB) this.jObj = $('#'+this.type + this.id);
      // Loaded from localStorage
      else if (this.inLocalStorage) this.jObj = this.createTableRow(fields);
      // Creating for the first time per user request
      else this.jObj = this.createTableRow();
      
    // Save to our array of all of this type
      log.rows.push(this);
      
    // Save to array for updating DB
      if (!this.inDB) {
        log.addToLocal('create', log.prepLogObj(this.type, this.id, this.prepFields()), this.inLocalStorage);
      }
    }
    
  // == Storage methods
    // Saves tempStorage (memory) into browser's persisent localStorage 
    this.updateLocalStorage = function (actions) {
      if (!actions) var actions = window.actions;
      
      for (var x in actions) {
        // If there are items to send to the server, JSON stringify it
        if (this.tempStorage[actions[x]].length !== 0) {
          localStorage[actions[x]] = JSON.stringify(this.tempStorage[actions[x]]);
        }
        else delete localStorage[actions[x]];
      }
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
              var parentRow = log.getRowById(creates[x].fields.rowId);
              
              parentRow.like = new parentRow.Like(parentRow, creates[x].id, true);
              break;
            case 'comment':
            // Find row parent first
              var parentRow = log.getRowById(creates[x].fields.rowId);
              
              parentRow.comments.push(new parentRow.Comment(parentRow, creates[x].id, true));
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
    // addToLocal to tempStorage and localStorage
    this.addToLocal = function (action, logObj, inLocalStorage) {
    // Find other instances of this id in query
      for (var x in log.tempStorage) {
        for (var y in log.tempStorage[x]) {
          if (log.tempStorage[x][y].id == logObj.id) {
            log.tempStorage[x].splice(y, 1);
            break;
          }
        }
      }
    
    // Add me to the correct storage array for DB updating
      this.tempStorage[action].push(logObj);
    
    // Update localStorage
      if (!inLocalStorage) this.updateLocalStorage([action]);
    }
  // Remove query for temp storage
    this.removeFromLocal = function (id, actions) {      
      if (!actions) var actions = window.actions;
      
      for (var x in actions) {
        for (var y in this.tempStorage[actions[x]]) {
          if (this.tempStorage[actions[x]][y].id == id) {
            this.tempStorage[actions[x]].splice(y, 1);
            return true;
          }
        }
      }
      
      return false;
    }
    
    // Saves localStorage to server DB
    this.saveDB = function () {
      $.ajax({
        url: 'update.php',
        data: this.tempStorage,
        success: function (response, status) {
          response = JSON.parse(response);
          if (response.error) alert(response.msg);
          else {
            var query;
            for (var x in response.queries) {
              if (response.queries[x].success) {
              // get the correct obj and fire callback
                query = !response.queries[x].rowId ? log.getObj(response.queries[x].type, response.queries[x].oldId) : log.getObj(response.queries[x].type, response.queries[x].oldId, response.queries[x].rowId, response.queries[x].rowType);
                log.dbCallback(query, response.queries[x].id);
              }
              else alert('external db was not able to save this row');
            }
            log.updateLocalStorage();
            // TODO: remove the please wait
          }
          //console.log(response);
        }
      });
      // TODO: add a please wait
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
    this.dbCallback = function (obj, id) {
    // set inDB flag
      obj.inDB = true;
      
    // remove from local
      if (log.removeFromLocal(obj.id)) obj.inLocalStorage = false;
      
    // Update the ID
      obj.jObj.attr('id', obj.type+id);
      obj.id = id;
    }
    
  // Helper methods
    this.formatTimecode = function (secs) {    
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
    this.getRowById = function (rowId) {
      var id = typeof(rowId) == 'string' ? rowId.replace(/[^\d]+/g, '') : rowId;
        
    // Look for it
      for (var x in this.rows) {
        if (this.rows[x].id == id) return this.rows[x];
      }
  
      return false;
    }
    this.getObj = function (type, id, rowId) {
    // for like and comments
      if (rowId) {
        var row = this.getRowById(rowId);
        for (var x in row[type+'s']) {
          if (row[type+'s'][x].id == id) return row[type+'s'][x];
        }
      }
    // for transcriptions and logs
      else {
        for (var x in this.rows) {
          if (this.rows[x].id == id) return this.rows[x];
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