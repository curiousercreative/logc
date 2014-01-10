$(document).ready(function () {
// Vars
  video = $('video').get(0);
  keys = [97, 115, 100, 106, 107, 108, 32];
  
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
    $('.note, button', note).on('focus', function () {
      unbindKeys();
    }).on('blur', function () {
      bindKeys();
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
    if (video.playing) video.pause();
    else video.play();
  }
  
  bindKeys = function () {
    $(window).keypress(function (e) {
      if (keys.indexOf(e.which) != -1) {
        e.preventDefault();
        switch (e.which) {
          case 97: //a
            newNote('log');
            break;
          case 115: //s
            newNote('transcription');
            break;
          case 100: //d
            //new comment();
            break;
          case 106: //j
            rr();
            break;
          case 32:
            pp();
            break;
          case 107: //k
            pp();
            break;
          case 108: //l
            ff();
            break;
        }
      }
    }); 
  }
  
  unbindKeys = function () {
    $(window).off('keypress');
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