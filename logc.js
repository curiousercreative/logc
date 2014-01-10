$(document).ready(function () {
// Vars
  video = $('video').get(0);
  keys = [65, 83, 68, 74, 75, 76, 32, 37, 39];
  editingField = false;
  defaultPlaybackRate = 1.0;
  
// functions
  newNote = function (type) {
    var note = $('<tr><td class="timecode"></td><td class="note" contenteditable="true"></td><td class="type"></td><td class="comments">0</td><td class="likes">0</td><td class="time_added"></td><td><button>Like</button><button>Comment</button></td></tr>');
    
  // Add class to the row
    $(note).addClass(type).find('.type').html(type);
    
  // Add a timecode
    $('.timecode', note).html(video.currentTime);
    
  // Add a timestamp
    $('.time_added', note).html(Math.round(new Date().getTime() / 1000));
    
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
  }
  
  newComment = function () {
  
  }
  
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
    video.playbackRate = defaultPlaybackRate;
  }
  
  setPlaybackRate = function (val) {
    video.playbackRate = val;
  }
  
  bindKeys = function () {
    $(window).keydown(function (e) {
      if (keys.indexOf(e.which) != -1) {
        if (!editingField || e.metaKey) {
          e.preventDefault();
          switch (e.which) {
            case 65: //a
              newNote('log');
              break;
            case 83: //s
              newNote('transcription');
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
  
  $('')
  
// Do stuff
  bindKeys();
});