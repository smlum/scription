function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;

  return hours + ':' + minutes + ':' + seconds;
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// var searchForm = document.getElementById('searchForm');

// if (searchForm) {
//   if (searchForm.addEventListener) {
//     //Modern browsers
//     searchForm.addEventListener(
//       'submit',
//       function(event) {
//         searchPhrase(document.getElementById('search').value);
//         event.preventDefault();
//       },
//       false,
//     );
//   } else if (searchForm.attachEvent) {
//     //Old IE
//     searchForm.attachEvent('onsubmit', function(event) {
//       searchPhrase(document.getElementById('search').value);
//       event.preventDefault();
//     });
//   }
// }

var words, wordsLen; //JSON
var htmlWords, htmlWordsLen; //HTML

htmlWords = document.querySelectorAll('[data-m]');
htmlWordsLen = htmlWords.length;

// Replace htmlWords and htmlWordsLen with words and wordsLen below if you want
// to take word data directly from JSON.
//
// When we export the player the transcript should probably be already inline
// as HTML so as to search engine indexable, which is why the default
// behaviour here is to use the HTML for the data as it will work in both cases.

// var searchPhrase = function(phrase) {
//   var phraseWords = phrase.split(' ');
//   var phraseWordsLen = phraseWords.length;
//   var matchedTimes = [];

//   // clear matched times

//   var searchMatched = document.querySelectorAll('.search-match');
//   var searchMatchedLen = searchMatched.length;

//   for (var l = 0; l < searchMatchedLen; l++) {
//     searchMatched[l].classList.remove('search-match');
//   }

//   //for (var i = 0; i < wordsLen; i++) {
//   for (var i = 0; i < htmlWordsLen; i++) {
//     var numWordsMatched = 0;
//     var potentiallyMatched = [];

//     for (var j = 0; j < phraseWordsLen; j++) {
//       var wordIndex = i + numWordsMatched;

//       //if (wordIndex >= wordsLen) {
//       if (wordIndex >= htmlWordsLen) {
//         break;
//       }

//       // regex removes punctuation - NB for htmlWords case we also remove the space

//       //if (phraseWords[j].toLowerCase() == Words[wordIndex].name.toLowerCase().replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,"")) {
//       if (
//         phraseWords[j].toLowerCase() ==
//         htmlWords[wordIndex].innerHTML
//           .toLowerCase()
//           .replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~() ]/g, '')
//       ) {
//         //potentiallyMatched.push(words[wordIndex].time);
//         potentiallyMatched.push(htmlWords[wordIndex].getAttribute('data-m'));
//         numWordsMatched++;
//       } else {
//         break;
//       }

//       // if the num of words matched equal the search phrase we have a winner!

//       if (numWordsMatched >= phraseWordsLen) {
//         matchedTimes = matchedTimes.concat(potentiallyMatched);
//       }
//     }
//   }

//   // display
//   var matchedTimesLen = matchedTimes.length;

//   // only match the first word with that time (assuming times are unique)
//   for (var k = 0; k < matchedTimesLen; k++) {
//     document
//       .querySelectorAll("[data-m='" + matchedTimes[k] + "']")[0]
//       .classList.add('search-match');
//   }
// };


  setTimeout(
    function() {
      hyper(true);
      console.log('transcript now interactive');
    },2000)



  function hyper(scrollOn) {
    
    if (scrollOn == false) {
      // hyperaudiolite.init('plop', 'jns');
      
      setTimeout(
        function() {
          console.log('mess');
          
        },1000)
      hyperaudiolite.init('d', 'd');
      
    } else {
      hyperaudiolite.init('hypertranscript', 'hyperplayer');      

      // playbackRate listener

      var v = document.getElementById('hyperplayer');

      if (v.src && /\.m3u8$/.test(v.src)) {
        if (Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(v.src);
          hls.attachMedia(v);
        } else {
          console.log('Unable to load HLS video stream');
        }
      }

      var p = document.getElementById('pbr');
      var cp = document.getElementById('currentPbr');
      var timecodeOffset = document.getElementById('timecodeOffset');

        // turn on if you make a playback input
      // p.addEventListener(
      //   'input',
      //   function() {
      //     cp.innerHTML = p.value;
      //     hyperplayer.playbackRate = p.value;
      //   },
      //   false,
      // );

      var updateTimecode = function() {
        var currentTimeMs = v.currentTime * 1000;
        var time = currentTimeMs + window.offsetMs;
        timecodeOffset.innerHTML = msToTime(time);
      };
      updateTimecode();
      v.addEventListener('timeupdate', updateTimecode);
    }
    
  };
  


