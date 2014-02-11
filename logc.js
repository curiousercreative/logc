$(document).ready(function () {
// Vars
  video = $('video').get(0);
  keys = [65, 83, 84, 68, 74, 75, 76, 32, 37, 39]; // keys we are binding event listeners to
  editingField = false;
  actions = ['create', 'update', 'remove'];
  
// Classes
  Log = function () {
  // Properties
    this.tempStorage = {
      'create' : new Array(),
      'update' : new Array(),
      'remove' : new Array()
    }
    this.rows = new Array(); // An array of all rows
    
  // Classes
    this.Row = function (type, id, fields, inLocalStorage, inDB) {
    // props
      this.type = type;
      this.id = id ? id : new Date().getTime();
      this.inLocalStorage = inLocalStorage ? true : false;
      this.inDB = inDB ? true : false;
      this.comments = new Array(); // An array of all comments
    
    // Classes
      this.Like = function (row, id, inLocalStorage, inDB) {
      // Props
        this.id = id ? id : new Date().getTime();
        this.jObj = $('.like', row.jObj);
        this.row = row;
        this.type = 'like';
        this.inLocalStorage = inLocalStorage ? true : false;
        this.inDB = inDB ? true : false;
      
      // Methods
        this.prepFields = function () {
          return {
            rowId: this.row.id,
            created: Math.round(new Date().getTime()/1000)
          }
        }
        this.destroy = function () {
        // Do I need to be removed from the DB?
          if (this.inDB) log.addToLocal('remove', log.prepLogObj(this.type, this.id));
          else log.removeFromLocal(this.id, this.type, true, ['create']);
        
        // Update like count
          $('.likes', this.row.jObj).html(parseInt($('.likes', this.row.jObj).text()) - 1);
          
        // Update button text
          $('button.like', this.row.jObj).removeClass('liked').text('Like');
        
        // delete yourself
          delete this.row.like;
        }
      
    //== Constructor do        
      // Save to array for updating DB
      // update markup
        if (!this.inDB) {
          log.addToLocal('create', log.prepLogObj(this.type, this.id, this.prepFields()), this.inLocalStorage);
          this.inLocalStorage = true;
          
        // Update like count
          $('.likes', this.row.jObj).html(parseInt($('.likes', this.row.jObj).text()) + 1);
          
        // Update button text
          $('button.like', this.row.jObj).attr('id', 'like'+this.id).addClass('liked').text('Liked');
        }
      }
      
      this.Comment = function (parentRow, id, inLocalStorage, inDB) {
      // Props
        this.id = id ? id : new Date().getTime();
        this.parentRow = parentRow;
        this.inLocalStorage = inLocalStorage ? true : false;
        this.type = 'comment';
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
            log.removeFromLocal(this.id, this.type, true, ['create']);
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
      this.prepFields = function (action) {
        if (action == 'update') {
          return {
            timecode: $('.timecode', this.jObj).attr('data-value'),
            note: $('.note', this.jObj).text(),
            modified: $('.modified', this.jObj).text()
          }
        }
        else {
          return {
            timecode: $('.timecode', this.jObj).attr('data-value'),
            note: $('.note', this.jObj).text(),
            created: $('.created', this.jObj).text(),
            modified: $('.modified', this.jObj).text()
          }
        }
      }
     
      // Creates a row in the browser log table
      this.createTableRow = function (fields) {
      // If this is a first time create, not loaded from storage
        if (!fields) {
          var fields = {
            timecode: video.currentTime,
            created: Math.round(this.id/1000),
            modified: Math.round(this.id/1000)
          }
        }
        
        // this is a table within a table for commenting purposes
        //var row = $('<tr><td colspan="9"><table><tbody><tr><td class="timecode"></td><td class="note" contenteditable="true"></td><td class="type"></td><td class="comments">0</td><td class="likes">0</td><td class="created"></td><td class="modified"></td><td class="actions"><button class="like">Like</button><button class="comment">Comment</button></td><td class="status">Local</td></tr></tbody></table></td></tr>');
        
        this.jObj = $('<tr><td class="timecode"></td><td class="note" contenteditable="true"></td><td class="type"></td><td class="comments">0</td><td class="likes">0</td><td class="created"></td><td class="modified"></td><td class="actions"><button class="like">Like</button><button class="delete">delete</button><!-- <button class="comment">Comment</button> --></td><td class="status">Local</td></tr>');
        
      // Add class && id to the row
        $(this.jObj).attr('id', this.type+this.id).addClass(this.type).find('.type').html(this.type);
        
      // Add a timecode
        $('.timecode', this.jObj).attr('data-value', fields.timecode).html(log.formatTimecode(fields.timecode));    
    
      // Add timestamps
        $('.created', this.jObj).html(fields.created);      
        $('.modified', this.jObj).html(fields.modified);
        
      // Add to the log_table
        $('#log_table tbody').prepend(this.jObj);

      // Add listeners
        this.addListeners();
        
      // Set focus to the note
        if (fields.note) $('.note', this.jObj).text(fields.note);
        else if (!this.inLocalStorage) $('.note', this.jObj).focus();
      }
      
      // Update a row from localStorage data
      this.updateFromLocalStorage = function (fields) {
      // Update browser
        for (var x in fields) {
          if (x == 'timecode') {
            $('.timecode', this.jObj).attr('data-value', fields[x]).text(log.formatTimecode(fields[x]));
          }
          else $('.'+x, this.jObj).text(fields[x]);
        }
      
      // Update the status
        $('.status', this.jObj).text('Local');
      }
      
      this.destroy = function () {
      // Remove this row
        // Add the query to localStorage
        if (this.inDB) log.addToLocal('remove', log.prepLogObj(this.type, this.id), false);
        else log.removeFromLocal(this.id, this.type, true);
        
      // Remove the markup
        this.jObj.remove();
        
      // Remove associated like (from local really)
        if (this.like) this.like.destroy();
        
      // Remove reference to this object
        for (var x in log.rows) {
          if (log.rows[x].id == this.id) log.rows.splice(x, 1);
          break;
        }
      }
      
    // Listeners
      this.addListeners = function () {
        this.addFocusBlurListener();
        this.addLikeListeners();
        this.addDeleteListeners();
        this.addCommentListeners();
        this.addDeleteListeners();
        this.addTimecodeListener();
        this.addTypeListener();
      }
      
      this.addFocusBlurListener = function () {
        $('.note', this.jObj).on('focus', function () {
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
      
      this.addLikeListeners = function () {
      // Click
        $('button.like', this.jObj).on('click', function (e) {
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
        
        $('button.like', this.jObj).hover(function () {
          if ($(this).hasClass('liked')) {
            $(this).text('Unlike');
          }
        }, function () {
          if ($(this).hasClass('liked')) {
            $(this).text('Liked');
          }
        });
      }
      
      this.addDeleteListeners = function () {
      // Click
        $('button.delete', this.jObj).on('click', function (e) {
        // what's my parent's obj?
          var parentRow = log.getRowById($(this).parents('tr').attr('id'));
          
          parentRow.destroy();
        });
      }
      
      this.addCommentListeners = function () {
        
      }
      
      this.addTimecodeListener = function () {
      // Jump to the timecode if it's clicked
        $('.timecode', this.jObj).on('click', function () {
          video.currentTime = $(this).attr('data-value');
        });
      
      // Let the timecode be edited if it is double-clicked on
        $('.timecode', this.jObj).dblclick(function () {
        // flag for editing field
          editingField = true;
          
        // Make the field editable, store the current value
          $(this).attr({
            'contenteditable': 'true',
            'data-old-html': $(this).html()
        // Focus
          }).focus();
        });
        
      // If enter is hit, blur
        $('.timecode', this.jObj).on('keydown', function (e) {
          switch (e.which) {
            case 13:
              e.preventDefault();
              $(this).blur();
              break;
            case 27:
              e.preventDefault();
              $(this).html($(this).attr('data-old-html')).blur();
              break;
          }
        });
        
      // Update the data-value when blur
        $('.timecode', this.jObj).on('blur', function () {
        // disable contenteditable
          $(this).removeAttr('contenteditable');
          
        // Check to see if the html changed
          if ($(this).html() !== $(this).attr('data-old-html')) {
          // decode the timecode and compare
            var sec = log.decodeTimecode($(this).html());
            
          // timecode was improperly formatted, discard changes
            if (!sec) $(this).html(log.formatTimecode($(this).attr('data-value')));
            else {
            // Copy the seconds to data-value and fire onUpdate
              $(this).attr('data-value', sec);
              
              log.getRowById($(this).closest('tr').attr('id')).onUpdate();
            }
          }
  
          editingField = false;
        });
      }
      
      this.addTypeListener = function () {
      // Let the timecode be edited if it is double-clicked on
        $('.type', this.jObj).dblclick(function () {
          $(this).attr({
            'contenteditable': 'true',
            'data-old-value': $(this).html()
          }).focus();
          
          editingField = true;
        });
        
      // If enter is hit, blur
        $('.type', this.jObj).on('keydown', function (e) {
          switch (e.which) {
            case 13: // enter 
              e.preventDefault();
              $(this).blur();
              break;
            case 27: // esc
              e.preventDefault();
              $(this).html($(this).attr('data-old-value')).blur(); // discard changes
              break;
          }
        });
        
      // Update the data-value when blur
        $('.type', this.jObj).on('blur', function () {
        // disable contenteditable
          $(this).removeAttr('contenteditable');
          
          switch ($(this).html()) {
            case $(this).attr('data-old-value'): // nothing changed
              break;
            case 'log':
              var row = log.getRowById($(this).closest('tr').attr('id'));
              
            // change the type
              row.type = 'log';
              
            // update the markup
              row.jObj.attr('id', row.jObj.attr('id').replace('transcription', 'log')).removeClass('transcription').addClass('log');
              
            // fire update
              row.onUpdate();
              
              break;
            case 'transcription':
              var row = log.getRowById($(this).closest('tr').attr('id'));
              
            // change the type
              row.type = 'transcription';
              
            // update the markup
              row.jObj.attr('id', row.jObj.attr('id').replace('log', 'transcription')).removeClass('log').addClass('transcription');
              
            // fire update
              row.onUpdate();
              
              break;
          }
            
          editingField = false;
        });
      }
      
      this.onUpdate = function () {
      // Update the table modified
        this.jObj.find('.modified').text(log.getTimestamp());
            
        var action = this.inDB ? 'update' : 'create';
        
      // Update the stored values
        this.inLocalStorage = false;
        
      // Update the status
        $('.status', this.jObj).text('Local');
            
      // addToLocal the update
        log.addToLocal(action, log.prepLogObj(this.type, this.id, this.prepFields(action)), this.inLocalStorage);
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
      if (this.inDB) {
      // set jObj
        this.jObj = $('#'+this.type + this.id);
      
      // Add listeners
        this.addListeners();
      }
      // Loaded from localStorage
      else if (this.inLocalStorage) this.createTableRow(fields);
      // Creating for the first time per user request
      else this.createTableRow();
      
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
    this.loadFromLocal = function () {
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
            case 'transcription':
              for (var y in this.rows) {
                if (this.rows[y].id == updates[x].id) {
                  this.rows[y].updateFromLocalStorage(updates[x].fields);
                }
              }
              break;
            // TODO: what to do for likes and comments
          }
        }
      }
    
    // Load the deletes
       if (localStorage.remove) {
        var removes = JSON.parse(localStorage.remove);
        for (var x in removes) {
          switch(removes[x].type) {
            case 'log':
            case 'transcription':
              for (var y in this.rows) {
                if (this.rows[y].id == removes[x].id) {
                  this.rows[y].destroy();
                  break;
                }
              }
              break;
            case 'likes':
            case 'comments':
            // TODO: loading deletes for likes and comments
          }
        }
      }
    }
    // Loads served markup into objects
    this.loadFromRemote = function () {
    // Load all of the rows
      $('#log_table tbody tr').each(function () {
      // Create row object
        var row = new log.Row($('.type', this).text(), parseInt($(this).attr('id').replace(/[^\d]+/g, '')), null, false, true);
        
      // Check for a like
        if ($('.like', row.jObj).hasClass('liked')) row.like = new row.Like(row, $('.like', row.jObj).attr('id').replace(/[^\d]+/g, ''), false, true);
      });
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
  // Remove query from temp & local storage
    this.removeFromLocal = function (id, type, updateLocal, actions) {      
      if (!actions) var actions = window.actions;
      
      for (var x in actions) {
        for (var y in this.tempStorage[actions[x]]) {
          if (
            this.tempStorage[actions[x]][y].id == id
            && this.tempStorage[actions[x]][y].type == type
          ) {
            this.tempStorage[actions[x]].splice(y, 1);
            if (updateLocal) this.updateLocalStorage([actions[x]]);
            return true;
          }
        }
      }
      
      return false;
    }
    
    // Saves localStorage to server DB
    this.saveDB = function () {
      var isEmpty = true;
      for (var x in this.tempStorage) {
        if (!$.isEmptyObject(this.tempStorage[x])) {
          isEmpty = false;
          break;
        }
      }
      
      if (isEmpty) {
        console.log('no local changes to be saved');
        return;
      }
      
      $.ajax({
        url: 'update.php',
        method: 'POST',
        data: this.tempStorage,
        success: function (response, status) {
          console.log(response);
          response = JSON.parse(response);
          if (response.error) alert(response.msg);
          else {
            var obj;
            for (var x in response.queries) {
              if (response.queries[x].success) {
                switch (response.queries[x].action) {
                    case 'remove':
                      log.dbDeleteCallback(response.queries[x].oldId, response.queries[x].type);
                      break;
                    case 'update':
                    case 'create':
                    // get the correct obj and fire callback
                      obj = !response.queries[x].rowId ? log.getObj(response.queries[x].type, response.queries[x].oldId) : log.getObj(response.queries[x].type, response.queries[x].oldId, response.queries[x].rowId);
                      if (obj) log.dbCreateCallback(obj, response.queries[x].id);
                      else console.log('could not find obj with id:'+response.queries[x].oldId);
                      break;
                  }
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
    this.dbCreateCallback = function (obj, id) {
    // set inDB flag
      obj.inDB = true;
      
    // remove from local
      if (log.removeFromLocal(obj.id, obj.type, false, ['create', 'update'])) obj.inLocalStorage = false;
      
      // Update the ID
        obj.jObj.attr('id', obj.type+id);
        obj.id = id;
        
      // Set the status
        $('.status', obj.jObj).text('Remote');
      
      return true;
    }
    this.dbDeleteCallback = function (oldId, type) {      
      this.removeFromLocal(oldId, type, false, ['remove']);
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
    this.decodeTimecode = function (tc) {
      var re = /^[0-9]{2}:[0-9]{2}:[0-9]{2}:[0-9]{2}$/;
      if (!re.test(tc)) return false;
      else {
        var seconds = 0;
        tc = tc.split(':');
      
      //multiply the hours by 3600 to get seconds
        seconds += parseInt(tc[0])*3600;
        
      //multiply the minutes by 60 to get seconds
        seconds += parseInt(tc[1])*60;
        
      //these are seconds
        seconds += parseInt(tc[2]);
        
      //multiply the frames by 1/24 to get seconds
        seconds += parseInt(tc[3])/24;
        
        return seconds;
      }
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
        return row[type];
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
      this.setPlaybackRate((video.playbackRate*10 + 1)/10);
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
      // Special hotkey combos that are always accessible
        if (e.shiftKey && e.metaKey) {
          switch (e.which) {
            case 83: //s save to remote db
              e.preventDefault();
              log.saveDB();
              return;
          }
        }
      
      // hotkeys that are only accessible when field isn't being edited or when hotkey combo is used
        if ( !editingField || (e.metaKey && e.shiftKey) ) {
          switch (e.which) {
            case 65: //a
              new log.Row('log');
              e.preventDefault();
              return;
            case 84: //t
              new log.Row('transcription');
              e.preventDefault();
              return;
            //case 68: //d
              //new comment();
              //e.preventDefault();
              //return;
            case 74: //j
              player.slower();
              e.preventDefault();
              return;
            case 75: //k
              player.pp();
              e.preventDefault();
              return;
            case 32: //space
              player.pp();
              e.preventDefault();
              return;
            case 76: //l
              player.faster();
              e.preventDefault();
              return;
            case 37: //<-
              if (!editingField && e.shiftKey && !e.metaKey) player.rr(30);
              else player.rr();
              e.preventDefault();
              return;
            case 39: //->
              if (!editingField && e.shiftKey && !e.metaKey) player.ff(30);
              else player.ff();
              e.preventDefault();
              return;
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
  log.loadFromRemote();
  log.loadFromLocal();
  
  player = new Player();
  
  bindKeys();
  
  $('.footable').footable();
});