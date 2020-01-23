// audio controller

// TODO:
// audio shortcuts infobox
// toggle shortcuts



$(document).ready(function() {

  // load audio and display transcript on load
  displayTranscript();
  getAudioUrl();

  var myAudio = document.getElementById("audio");
  var isPlaying = false;
  var playbackRate = 1.0;


  $('#content').on ("click", ".word-container", function () {
    // TODO give it a class of active and remove class from previously active word
    console.log(this);
    
    // reset the audio time
    var newTime = $(this).data('time');
    console.log("word start time: " + newTime);  
    myAudio.currentTime = newTime;
    // myAudio.play();

    // select and highlight the clicked word (ready to be edited)
    var range, selection;
    if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(this);
      selection.removeAllRanges();
      selection.addRange(range);
    } else if (document.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(this);
      range.select();
    }
    
    // color previous words black and future words grey
    // turn the current word black
    $(this).css({'color':'black'})
    // turn previous words black and post words grey
    // note this is inefficient and doesn't colour the punctuation
    $("span").filter(function() {
      return $(this).attr("data-time") < newTime;
    }).css({'color':'black'});
    $("span").filter(function() {
      return $(this).attr("data-time") > newTime;
    }).css({'color':'grey'});
  });




  // select the word from the playback

  // 1. get the audio position
  // Assign an ontimeupdate event to the video element, and execute a function if the current playback position has changed

  var speakerStartTime = 0;

  // myAudio.ontimeupdate = function() {myFunction()};

  var myVar;

  myAudio.onplay = function() {
    myVar = setInterval(myFunction, 50)
    
  }; 

function myFunction() {
  currentTime = myAudio.currentTime;
  document.getElementById("demo").innerHTML = currentTime;
  // 2. find the first word said before the time
  for (var i = 0; i < transcriptObject.length; i++) { 
    // is the current time bigger than the start time of the next word? 
    // get the speaker times

    // if (!transcriptObject[i].start_time) {
    //   console.log("poop!")
    // }
    wordTime = transcriptObject[i].start_time;
    nextWordTime = transcriptObject[i+1].start_time
    if (currentTime < nextWordTime) {
      
      // lookup and highlight the word based on its word time and it's data attribute 
      if (wordTime) {
        $("#content span[data-time='" + wordTime + "']").css("color", "black");
      }  
      break;
    } else if ((!nextWordTime) && (currentTime < transcriptObject[i+2].start_time)) {
      // lookup and highlight the word based on its word time and it's data attribute 
        $("#content span[data-time='" + wordTime + "']").css("color", "black");
        $("#content span[data-time='" + wordTime + "']").next("span").css("color", "black");
      break;
    }
    // if (currentTime > )
  }
}
  
  
  

  // toggle play and pause
  function togglePlay() {
    if (isPlaying) {
      myAudio.pause();
    } else {
      myAudio.play();
    };
  };

  myAudio.onplaying = function() {
    isPlaying = true;
  };
  myAudio.onpause = function() {
    clearInterval(myVar);
    isPlaying = false;
  };

  //to play on the key A do this(using Jquery):
  document.addEventListener('keydown', function(e) {
    // play and pause audio
    if (e.ctrlKey && e.keyCode == 32 && !(e.shiftKey)) {
      togglePlay()
    };
    // stop audio (ctrl + space)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 32) {
      myAudio.load();
      isPlaying = false;
    };
    // speed up audio (ctrl + shift + >)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 190) {
      if (playbackRate < 3.0) {
        playbackRate = playbackRate + 0.25;
      };
      myAudio.playbackRate = playbackRate;
    };
    // slow down audio (ctrl + shift + <)
    if (e.ctrlKey && e.shiftKey && e.keyCode == 188) {
      if (playbackRate > 0.25) {
        playbackRate = playbackRate - 0.25;
      };
      myAudio.playbackRate = playbackRate;
    };
    // skip forward 5 seconds (ctrl + >)
    if (e.ctrlKey && e.keyCode == 190 && !(e.shiftKey)) {
      myAudio.currentTime += 5.0;
    };
    // skip back 5 seconds (ctrl + <)
    if (e.ctrlKey && e.keyCode == 188 && !(e.shiftKey)) {
      myAudio.currentTime -= 5.0;
    };
  });

});
