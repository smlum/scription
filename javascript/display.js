// This script converts the json transcript file to html so that hyperaudio-lite can interpret it

// function handleFileSelect(evt) {
//     var files = evt.target.files; // FileList object

//     // Loop through the FileList and render image files as thumbnails.
//     for (var i = 0, f; f = files[i]; i++) {

//     // Only process image files.
//     if (!f.type.match('image.*')) {
//         continue;
//     }

//     var reader = new FileReader();

//     // Closure to capture the file information.
//     reader.onload = (function(theFile) {
//         return function(e) {
//         // Render thumbnail.
//         var span = document.createElement('span');
//         span.innerHTML = ['<img class="thumb" src="', e.target.result,
//                             '" title="', escape(theFile.name), '"/>'].join('');
//         document.getElementById('list').insertBefore(span, null);
//         };
//     })(f);

//     // Read in the image file as a data URL.
//     reader.readAsDataURL(f);
//     }
// }

// document.getElementById('files').addEventListener('change', handleFileSelect, false);


// TODO: I need to change this to get the structure for hyper
// This is:
//   a set of paragraphs with data-tc property of the formatted time of the first word
//   after that, a span than has the speaker,
//   attached to each one, the words with data-m and data-d properties
//    data-m is the word start time (ms)
//    data-d is the word duration (ms)
//  punctuation should be included inside the span it came from (check the next character when looping through)

// format seconds to minutes
function fmtMSS(s) {
 return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + Math.round(s)
}

// clear transcript text
// TODO 1. add warning before clearing; 2. make it possible to undo
function clearTranscript() {
 $('#content').html('')
 $('.annotation-content').html('');
}

// create a new paragraph tag
function CreateNewPara(timeOfFirstWord, speaker, paraId) {
 var formattedTime = fmtMSS(timeOfFirstWord)
 var paraTime = "<p class='content' id='" + paraId + "' data-time='" + timeOfFirstWord + "' data-tc='" + formattedTime + "'>";
 // only give it span if it's a word?
 var paraSpeaker = "<span class='unread' data-m='" + timeOfFirstWord + "' data-d='0' class='speaker'>" + speaker + " </span>";
 var paraFormattedTime = "<span class ='timecode'>[" + formattedTime + "] </span>";
 var endPara = "</p>"
 var newPara = paraTime + paraSpeaker + paraFormattedTime + endPara;
 return newPara;
}

// load audio from file or url using the dropdown or text input
function getAudioUrl() {

 // from file in data folder
 // var audioUrl = "data/" + document.getElementById("audio-name").value;
 var audioUrl = document.getElementById("audioUrll").value;
 document.getElementById("hyperplayer").src = audioUrl;
}

// load audio from user selected file
// note that this made the computer crash with large file size. I think audio was loaded to memory. files were way too big with wav
// set limit

function handleFileSelect(evt) {
 var files = evt.target.files; // FileList object



 // Loop through the FileList and render image files as thumbnails.
 for (var i = 0, f; f = files[i]; i++) {

  // Only process audio files.
  if (!f.type.match('audio.*')) {
   alert('Must be an audio file');
   return;
  };

  // Warn user if file size is larger than 50mb
  fileSize = Math.round(files[0].size / 1000000)
  if (fileSize > 50.457280) {
   alert('This audio file is ' + fileSize + 'mb. There may be playback issues above 50mb. For ways to reduce file size see the docs: https://github.com/smlum/scription#uploading-large-audio-files-to-scription');
   // TODO use Bulma modal instead of alert
   // $('.modal-audio-size'){}
   // return;
  }

  var reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function (theFile) {
   return function (e) {
    // Render thumbnail.

    document.getElementById("hyperplayer").src = e.target.result;
    console.log("loading audio: " + theFile.name);
    document.getElementById("audio-name").innerHTML = theFile.name;

    // var span = document.createElement('span');
    // span.innerHTML = ['<img class="thumb" src="', e.target.result,
    //     '" title="', escape(theFile.name), '"/>'
    // ].join('');
    // document.getElementById('list').insertBefore(span, null);
   };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsDataURL(f);
 }
}

// check for user file entry
document.getElementById('user-audio-file').addEventListener('change', handleFileSelect, false);

// this is simpler version of file api audio
// $('#user-audio-file').on('change', function (e) {
//     console.log('trying');
//     var $audio = $('#hyperplayer');
//     var target = e.currentTarget;
//     var file = target.files[0];
//     var reader = new FileReader();

//     if (target.files && file) {
//         var reader = new FileReader();
//         reader.onload = function (e) {
//             $audio.attr('src', e.target.result);
//             document.getElementById("audio-name").innerHTML = theFile.name;
//         }
//         reader.readAsDataURL(file);
//     }
// });




// load json from user selected file
function handleJsonFileSelect(evt) {
 var files = evt.target.files; // FileList object

 // console.log(files);

 // Loop through the FileList and render image files as thumbnails.
 for (var i = 0, f; f = files[i]; i++) {

  // Only process audio files.
  // if (!f.type.match('json.*')) {
  //     console.log('json detected');
  //     continue;
  // }

  var reader = new FileReader();

  // console.log(f.name);
  // document.getElementById("json-name").innerHTML = f.name;
  // console.log(f.target.result);
  // displayTranscript();

  // Closure to capture the file information.
  reader.onload = (function (theFile) {
   return function (e) {
    // Render thumbnail.

    console.log("loading json: " + theFile.name);
    document.getElementById("json-name").innerHTML = theFile.name;
    // console.log(e);
    JsonObj = JSON.parse(e.target.result);
    // console.log(JsonObj);
    displayTranscript(JsonObj);

    // var span = document.createElement('span');
    // span.innerHTML = ['<img class="thumb" src="', e.target.result,
    //     '" title="', escape(theFile.name), '"/>'
    // ].join('');
    // document.getElementById('list').insertBefore(span, null);
   };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
 }
}

// Listen for user uploading a json
document.getElementById('user-json-file').addEventListener('change', handleJsonFileSelect, false);


// load project from user selected file
function handleProjectFileSelect(evt) {
 var files = evt.target.files; // FileList object

 console.log(files);

 // Loop through the FileList and render image files as thumbnails.
 for (var i = 0, f; f = files[i]; i++) {

  // Only process audio files.
  // if (!f.type.match('json.*')) {
  //     console.log('json detected');
  //     continue;
  // }

  var reader = new FileReader();

  // console.log(f.name);
  // document.getElementById("json-name").innerHTML = f.name;
  // console.log(f.target.result);
  // displayTranscript();

  // Closure to capture the file information.
  reader.onload = (function (theFile) {
   return function (e) {
    // Render thumbnail.

    console.log("loading project:" + theFile.name);
    document.getElementById("project-name").innerHTML = theFile.name;
    $("#content").html(e.target.result)

    // var span = document.createElement('span');
    // span.innerHTML = ['<img class="thumb" src="', e.target.result,
    //     '" title="', escape(theFile.name), '"/>'
    // ].join('');
    // document.getElementById('list').insertBefore(span, null);
   };
  })(f);

  // Read in the image file as a data URL.
  reader.readAsText(f);
 }
}

// load html from file

function LoadFromHtml() {
 var htmlPath = "saves/" + document.getElementById("html-load").value;
 $("#content").load(htmlPath);

 console.log(htmlPath);
}

document.getElementById('user-project-file').addEventListener('change', handleProjectFileSelect, false);


// activates interactive script after two seconds on page load. 
// TODO Load script asynchronously without a the need for a dumb timer
setTimeout(function () {
 hyper(true);
 // console.log('interactive script');
}, 2000);

// for the audio control (possibly to be deleted eventually)
var speakerTimes = [];
var transcriptObject = [];
var word_start_time;



// load json from url
function getJSONFromUrl() {

 var jsonUrl = document.getElementById("jsonUrll").value;
 console.log("loading json: " + jsonUrl);
 document.getElementById("json-name").innerHTML = jsonUrl;
 // console.log(e);
 // JsonObj = JSON.parse(jsonUrl);
 // console.log(JsonObj);
 // displayTranscript(jsonUrl)
 // $.getJSON(jsonUrl, function (data) {
 //     displayTranscript(data);
 //     console.log("???");
 // });
 // console.log("poop: " + userJson);
 $.getJSON(jsonUrl, function (data) {
  // displayTranscript(data);
  displayTranscript(data)
 });
}

// display transcript from json file
function displayTranscript(userJson) {
 // get json transcript from user input (default transcript.json)
 // var json = "json/" + document.getElementById("user-filename").value;
 // console.log("loading: " + json);


 // $.getJSON(json, function (data) {

 data = userJson

 // assign variables for use in for loop below

 // contains the html to append for each word
 var text = "";
 // counts upwards each time the speaker changes, it should be as long as the length of speaker_times
 var speaker_counter = 0;
 var new_speaker = "";
 // counts of how long each para is
 var paragraphWordCounter = 0;
 // counts the number of paragraphs
 var paragraphCounter = 0;
 var newPara = "";

 // set the number of words after which a new sentence is started
 // TODO allow user to set
 var max_para_length = 10;

 whisper = WhisperParser( )

 // use the json structure to detect the format being used
 // eg AWS vs DeepSpeech

 if( whisper.detect( data ) ) {

  whisper.config()
  whisper.generate( data )

 // parse the DeepSPeech formatted json
 } else if (data.words) {
  console.log('Mozilla formatted data detected');

  // turn off confidence toggle
  document.getElementById('confidence').setAttribute('disabled', 'disabled');


  // if (document.getElementById('deepspeech').checked) {
  var results = data.words

  jsonLength = results.length


  transcriptObject = results.words;
  var confidence = 1;

  // loop through json to appeand words and data
  // TODO need to adjust this to create a para first
  // then to append words to that paragraph
  // then when speaker changes to create a new para
  for (var i = 0; i < jsonLength; i++) {
   // get data from JSON string

   var wordLabel = results[i].word;
   var startTimeLabel = results[i]["start_time "];
   var durationLabel = results[i].duration;


   word = results[i].word;
   // word start time is in seconds

   // create an manual adjustment to data when there is a playback sync error
   // word highlighting too early means data time is too low, so make it higher
   // word highlighting too late means data time is too high, so make it lower
   var adjustment = 0;
   // var delay = $("#user-delay").val();
   // // adjustment = Number(delay);
   // console.log("adjustment: " + adjustment);

   word_start_time = startTimeLabel + adjustment;
   word_start_time_ms = word_start_time * 1000

   if (results[i + 1] && results[i + 1].start_time) {
    next_word_start_time = results[i + 1].start_time;
    // TODO truncaste this as it can go to lots of decimal places
    // duration_ms = Math.round(1000 * (next_word_start_time - word_start_time))

   } else if (results[i + 2] && results[i + 2].start_time) {
    next_word_start_time = results[i + 2].start_time;
    // TODO truncaste this as it can go to lots of decimal places
    // duration_ms = Math.round(1000 * (next_word_start_time - word_start_time))
   }

   duration_ms = 1000 * durationLabel;

   if (i == 0) {

    new_speaker = "New Para";

    // add new para
    // function takes: timeOfFirstWord, speaker, wordCount
    paraId = "para-" + paragraphCounter;
    newPara = CreateNewPara(word_start_time, new_speaker, paraId);
    $('#content').append(newPara);
    // document.getElementById('speaker').insertAdjacentHTML('beforebegin',
    // newPara);
   };


   // add data to each word: confidence, start time, duration, speaker
   spanStartTime = "<span data-m='" + word_start_time_ms + "' data-d='" + duration_ms + "' data-confidence='" + confidence + "'>";
   // create html to be added

   space = " ";

   text = space + spanStartTime + word + "</span>";

   // Uncomment out below to use tooltips
   // spanTooltip = "<span class='tooltiptext'>";
   // divTooltip = "<div class='tooltip'>";
   // text = space + divTooltip + spanStartTime + word + "</span>" + spanTooltip + confidence + "<br>" + word_start_time + "</span>" + "</div>";

   // append text to paragraph
   para = "#para-" + paragraphCounter;

   $(para).append(text);

   // if it gets to a full stop and the current paragraph is too long, start a new paragraph
   // TODO let user set the paragraph amount


   //for (var i = 0; i < speaker_times.length; i++) {
   //console.log(speaker_times[i]);
   //}
   paragraphWordCounter++

   if (paragraphWordCounter > max_para_length) {
    // set data for new speaker
    paragraphCounter++;
    paraId = "para-" + paragraphCounter;
    newPara = CreateNewPara(word_start_time, new_speaker, paraId);
    $('#content').append(newPara);
    // reset the paragraph word counter
    paragraphWordCounter = 0;
    // console.log(word);
    // console.log('para too long');

   };

  };




 } else if (data.results) {
  // AWS formatted json
  console.log('AWS formatted data detected');
  // turn on confidence display toggle
  document.getElementById('confidence').removeAttribute('disabled');


  // parse the AWS formatted json

  //
  var results = data.results;
  var transcript_raw = JSON.stringify(results.transcripts[0].transcript);

  // create empty array to hold speaker names and start times
  // TODO is this array actually used in anything?
  // REPLY: yes, it is used to look up who the speaker is depending on the time
  // Note: in the json a speaker can speak multiple times in a row
  // we simplify this

  if (results.speaker_labels) {
   console.log('multiple speakers');
   var whoIsSpeaker
   var speaker_times = [];
   var segments = results.speaker_labels.segments;
   for (var i = 1; i < segments.length; i++) {
    // check if the speaker has changed
    if (whoIsSpeaker != segments[i].speaker_label) {
     // if so add to the array
     whoIsSpeaker = segments[i].speaker_label
     speaker = [];
     speaker.push(segments[i].speaker_label);
     speaker.push(Number(segments[i].start_time));
     speaker_times.push(speaker);
    }

   };
  } else {
   console.log('one speaker');
   new_speaker = "speaker";
   var speaker_times = [[]];
   var speaker_counter = 0
   speaker_times[speaker_counter][0] = new_speaker
  };


  // saving global variables for use in audio-control.js (poss can delete)
  speakerTimes = speaker_times

  transcriptObject = results.items;

  jsonLength = results.items.length;



  // loop through json to appeand words and data
  // TODO need to adjust this to create a para first
  // then to append words to that paragraph
  // then when speaker changes to create a new para
  for (var i = 0; i < jsonLength; i++) {
   // get data from JSON string
   word = results.items[i].alternatives[0].content;
   confidence = results.items[i].alternatives[0].confidence;
   word_start_time = results.items[i].start_time;
   word_start_time_ms = Math.round(word_start_time * 1000);
   if (results.items[i + 1] && results.items[i + 1].start_time) {
    next_word_start_time = results.items[i + 1].start_time;
    // TODO truncaste this as it can go to lots of decimal places
    duration_ms = Math.round(1000 * (next_word_start_time - word_start_time))

   } else if (results.items[i + 2] && results.items[i + 2].start_time) {
    next_word_start_time = results.items[i + 2].start_time;
    ``
    // TODO truncaste this as it can go to lots of decimal places
    duration_ms = Math.round(1000 * (next_word_start_time - word_start_time))
   }
   type = results.items[i].type;

   // check for punctuation and ensure punctuation doesn't have spaces before them
   if (type == "pronunciation") {
    space = " ";
    paragraphWordCounter++;
   } else if (type == "punctuation") {
    space = "";
   };



   // make sure first word has a speaker - may be unecessary
   if (i == 0) {
    // find out and set the speaker counter for the first word

    // // to check who the speaker is at the time of the first word
    // while (Number(speaker_times[speaker_counter][1]) < Number(word_start_time)) {
    //   speaker_counter++;
    // };

    // TODO temporary if condition
    if (results.speaker_labels) {
     new_speaker = speaker_times[speaker_counter][0];
    }


    // add new para
    // function takes: timeOfFirstWord, speaker, wordCount
    paraId = "para-" + paragraphCounter;
    newPara = CreateNewPara(word_start_time, new_speaker, paraId);
    $('#content').append(newPara);
    // document.getElementById('speaker').insertAdjacentHTML('beforebegin',
    // newPara);
   };

   // ok this might need overhaul
   // want to detect if the speaker has changed
   // if it has, create a new paragraph and increase speaker counter by 1
   // speaker_times has the times where the speaker changes
   // speaker counter starts at 0
   // when the time of the word exceeds speaker_times 0th row, then change it

   // add new para if speaker changes
   // checks if it's not the last speaker

   // TODO temporary if condition
   if (results.speaker_labels) {
    if ((speaker_counter < speaker_times.length) && (i != 0)) {

     speakerStart = speaker_times[speaker_counter][1]
     // checks if the time of the speaker is less than the current word
     // ok to do this, we need to check for the next word, not this one
     // also what if the next word is punctuation
     if (speakerStart < next_word_start_time) {


      // checks if the amount of time the speaker spoke for is more than a second
      // might be able to remove this since it addressed a problems that's been solved elsewhere
      var min_time = 1;
      // if
      if (speaker_times[speaker_counter + 1] && (speaker_times[speaker_counter + 1][1] - speaker_times[speaker_counter][1] > min_time)) {
       speaker_counter++;
       // checks if the speaker has changed
       if (new_speaker != speaker_times[speaker_counter][0]) {
        // console.log(speaker_times);

        // console.log(word);
        // console.log(speaker_counter);


        // changes the speaker variable
        new_speaker = speaker_times[speaker_counter][0];

        // add a new para
        paragraphCounter++;
        paraId = "para-" + paragraphCounter;

        newPara = CreateNewPara(word_start_time, new_speaker, paraId);
        $('#content').append(newPara);
        // reset the paragraph word counter
        paragraphWordCounter = 0;



       };
      };

     };
    };
   }



   // add data to each word: confidence, start time, duration, speaker
   spanStartTime = "<span data-m=" + word_start_time_ms + " data-d=" + duration_ms + " data-confidence=" + confidence + ">";
   // create html to be added



   if (type == "pronunciation") {
    // remove

    text = space + spanStartTime + word + "</span>";
   } else if (type == "punctuation") {
    // check if the previous word was also punctuation cause by removing an utterence

    text = space + word


   };

   // Uncomment out below to use tooltips
   // spanTooltip = "<span class='tooltiptext'>";
   // divTooltip = "<div class='tooltip'>";
   // text = space + divTooltip + spanStartTime + word + "</span>" + spanTooltip + confidence + "<br>" + word_start_time + "</span>" + "</div>";

   // append text to paragraph
   para = "#para-" + paragraphCounter;

   $(para).append(text);

   // if it gets to a full stop and the current paragraph is too long, start a new paragraph
   // TODO let user set the paragraph amount




   if (type == "punctuation" && (word == "." || word == "!" || word == "?") && paragraphWordCounter > max_para_length && new_speaker == speaker_times[speaker_counter][0]) {
    // set data for new speaker
    paragraphCounter++;
    paraId = "para-" + paragraphCounter;

    // use next word start time as current one is punctuation
    newPara = CreateNewPara(next_word_start_time, new_speaker, paraId);
    $('#content').append(newPara);
    // reset the paragraph word counter
    paragraphWordCounter = 0;
    // console.log(word);
    // console.log('para too long');

   };

   //for (var i = 0; i < speaker_times.length; i++) {
   //console.log(speaker_times[i]);
   //}

  };


 } else if (data.monologues) {
  // rev.ai formatted json
  console.log('rev.ai formatted data detected');
  // turn on confidence display toggle
  document.getElementById('confidence').removeAttribute('disabled');

  // parse the rev.ai formatted json

  // rev.ai json structure has everything in "monologues"
  // it includes spaces as punctuation. It has confidence values for each word.
  // speakers are declared in new objects in monologues
  // start and end time are in seconds

  // console.log("length: " + data.monologues.length);

  var spearkerchanges = data.monologues.length;

  // loop through all the speaker changes
  for (var j = 0; j < spearkerchanges; j++) {
   var results = data.monologues[j];

   // create empty array to hold speaker names and start times
   // var whoIsSpeaker
   // var speaker_times = [];
   // var segments = results.speaker_labels.segments;
   // for (var i = 1; i < segments.length; i++) {
   //     // check if the speaker has changed
   //     if (whoIsSpeaker != segments[i].speaker_label) {
   //         // if so add to the array
   //         whoIsSpeaker = segments[i].speaker_label
   //         speaker = [];
   //         speaker.push(segments[i].speaker_label);
   //         speaker.push(Number(segments[i].start_time));
   //         speaker_times.push(speaker);
   //     }

   // };

   // saving global variables for use in audio-control.js 
   // TODO find another way without global variables
   speakerTimes = speaker_times
   transcriptObject = results.items;
   jsonLength = results.elements.length;

   // first, let's just try one speaker. 
   // Next deal with more
   // Maybe loop through: get length of each elements array

   // loop through json to appeand words and data


   para_start_time = results.elements[0].ts;
   new_speaker = results.speaker
   console.log("speaker: " + new_speaker + "  start time: " + para_start_time + "  paraId: " + paragraphCounter);
   paragraphCounter++;

   // add first paragraph when speaker changes



   // find out and set the speaker counter for the first word

   // // to check who the speaker is at the time of the first word
   // while (Number(speaker_times[speaker_counter][1]) < Number(word_start_time)) {
   //   speaker_counter++;
   // };
   // new_speaker = speaker_times[speaker_counter][0];

   // add new para
   // function takes: timeOfFirstWord, speaker, wordCount
   paraId = "para-" + paragraphCounter;
   newPara = CreateNewPara(para_start_time, new_speaker, paraId);
   $('#content').append(newPara);
   // document.getElementById('speaker').insertAdjacentHTML('beforebegin',
   // newPara);


   // loop through all words for each speaker
   for (var i = 0; i < jsonLength; i++) {
    // define word data from JSON string
    word = results.elements[i].value;
    confidence = results.elements[i].confidence;
    word_start_time = results.elements[i].ts;
    word_start_time_ms = Math.round(word_start_time * 1000);
    word_end_time = results.elements[i].end_ts;
    duration_ms = duration_ms = Math.round(1000 * (word_end_time - word_start_time))
    type = results.elements[i].type;

    // work out next word start time and duration (for new paragraph tag)
    if (results.elements[i + 1] && results.elements[i + 1].ts) {
     next_word_start_time = results.elements[i + 1].ts;
     // TODO truncaste this as it can go to lots of decimal places
     duration_ms = Math.round(1000 * (next_word_start_time - word_start_time))

    } else if (results.elements[i + 2] && results.elements[i + 2].ts) {
     next_word_start_time = results.elements[i + 2].ts;
     ``
     // TODO truncaste this as it can go to lots of decimal places
     duration_ms = Math.round(1000 * (next_word_start_time - word_start_time))
    } else if (results.elements[i + 3] && results.elements[i + 3].ts) {
     next_word_start_time = results.elements[i + 2].ts;
     ``
     // TODO truncaste this as it can go to lots of decimal places
     duration_ms = Math.round(1000 * (next_word_start_time - word_start_time))
    }


    // check for punctuation and ensure punctuation doesn't have spaces before them
    // if (type == "pronunciation") {
    //     space = " ";
    //     paragraphWordCounter++;
    // } else if (type == "punctuation") {
    //     space = "";
    // };

    // ok this might need overhaul
    // want to detect if the speaker has changed
    // if it has, create a new paragraph and increase speaker counter by 1
    // speaker_times has the times where the speaker changes
    // speaker counter starts at 0
    // when the time of the word exceeds speaker_times 0th row, then change it

    // add new para if speaker changes
    // checks if it's not the last speaker
    // this only works for AWS

    // if ((speaker_counter < speaker_times.length) && (i != 0)) {

    //     speakerStart = speaker_times[speaker_counter][1]
    //     // checks if the time of the speaker is less than the current word
    //     // ok to do this, we need to check for the next word, not this one
    //     // also what if the next word is punctuation
    //     if (speakerStart < next_word_start_time) {


    //         // checks if the amount of time the speaker spoke for is more than a second
    //         // might be able to remove this since it addressed a problems that's been solved elsewhere
    //         var min_time = 1;
    //         // if
    //         if (speaker_times[speaker_counter + 1] && (speaker_times[speaker_counter + 1][1] - speaker_times[speaker_counter][1] > min_time)) {
    //             speaker_counter++;
    //             // checks if the speaker has changed
    //             if (new_speaker != speaker_times[speaker_counter][0]) {
    //                 // console.log(speaker_times);

    //                 // console.log(word);
    //                 // console.log(speaker_counter);


    //                 // changes the speaker variable
    //                 new_speaker = speaker_times[speaker_counter][0];

    //                 // add a new para
    //                 paragraphCounter++;
    //                 paraId = "para-" + paragraphCounter;

    //                 newPara = CreateNewPara(word_start_time, new_speaker, paraId);
    //                 $('#content').append(newPara);
    //                 // reset the paragraph word counter
    //                 paragraphWordCounter = 0;



    //             };
    //         };

    //     };
    // };

    // remove uh and um
    if (type == "text" && (word == "uh" || word == "um")) {
     if (results.elements[i + 1].type == "punct") {
      i++;
     }
    } else {
     // add data to each word: confidence, start time, duration, speaker
     spanStartTime = "<span data-m=" + word_start_time_ms + " data-d=" + duration_ms + " data-confidence=" + confidence + ">";
     // create html to be added

     // add words and punctuation
     if (type == "text") {
      text = spanStartTime + word + "</span>";
      paragraphWordCounter++;
     } else if (type == "punct") {
      // check if the previous word was also punctuation cause by removing an utterence
      text = word
     };

     // Uncomment out below to use tooltips
     // spanTooltip = "<span class='tooltiptext'>";
     // divTooltip = "<div class='tooltip'>";
     // text = space + divTooltip + spanStartTime + word + "</span>" + spanTooltip + confidence + "<br>" + word_start_time + "</span>" + "</div>";

     // append text to paragraph
     para = "#para-" + paragraphCounter;

     $(para).append(text);

     // if it gets to a full stop and the current paragraph is too long, start a new paragraph
     // TODO let user set the paragraph amount

     // console.log(i + " : " + paragraphWordCounter);

     // start a new paragraph if text current length is over a max threshold and it reaches the end of a sentence
     if (type == "punct" && (word == "." || word == "!" || word == "?") && paragraphWordCounter > max_para_length && i < jsonLength - 2) {
      // set data for new speaker

      paragraphCounter++;
      paraId = "para-" + paragraphCounter;

      // use next word start time as current one is punctuation
      // new_speaker = data.monologues[j + 1].speaker
      newPara = CreateNewPara(next_word_start_time, new_speaker, paraId);
      $('#content').append(newPara);
      // reset the paragraph word counter
      paragraphWordCounter = 0;
      // console.log(word);
      // console.log('para too long');
     };

     //for (var i = 0; i < speaker_times.length; i++) {
     //console.log(speaker_times[i]);
     //}
    }
   };
  }

 } else if (data.response.chunks) {
  // Yandex formatted json
  // TODO test this

  console.log('YandexSpeechKit formatted data detected');
  // turn on confidence display toggle
  document.getElementById('confidence').removeAttribute('disabled');

  // turn off confidence toggle
  document.getElementById('confidence').setAttribute('disabled', 'disabled');


  var results = data.response.chunks

  jsonLength = results.length


  transcriptObject = results.words;
  var confidence = 1;

  // loop through json to appeand words and data
  // TODO need to adjust this to create a para first
  // then to append words to that paragraph
  // then when speaker changes to create a new para
  for (var j = 0; j < jsonLength; j++) {
   if (results[j].channelTag == '1') {
    chunk = results[j].alternatives[0].words;
    chunkLength = chunk.length;

    if (j == 0) {

     new_speaker = "New Para";

     // add new para
     // function takes: timeOfFirstWord, speaker, wordCount
     paraId = "para-" + paragraphCounter;
     newPara = CreateNewPara('0', new_speaker, paraId);
     $('#content').append(newPara);

    };

    for (var i = 0; i < chunkLength; i++) {
     // get data from JSON string
     // As yandex split text by pauses let assume that each fragment is a sentence.
     if (i == 0) {
      chunk[i].word = chunk[i].word[0].toUpperCase() + chunk[i].word.substring(1);
     } else if (i == chunkLength - 1) {
      chunk[i].word = chunk[i].word + '.';
     }
     wordLabel = chunk[i].word;
     startTimeLabel = Number(chunk[i]["startTime"].substr(0, chunk[i]["startTime"].length - 1));
     durationLabel = Number(chunk[i]["endTime"].substr(0, chunk[i]["endTime"].length - 1)) - Number(chunk[i]["startTime"].substr(0, chunk[i]["startTime"].length - 1));


     word = chunk[i].word;
     // word start time is in seconds

     // create an manual adjustment to data when there is a playback sync error
     // word highlighting too early means data time is too low, so make it higher
     // word highlighting too late means data time is too high, so make it lower
     var adjustment = 0;

     word_start_time = startTimeLabel + adjustment;
     word_start_time_ms = word_start_time * 1000


     duration_ms = 1000 * durationLabel;




     // add data to each word: confidence, start time, duration, speaker
     spanStartTime = "<span data-m='" + word_start_time_ms + "' data-d='" + duration_ms + "' data-confidence='" + confidence + "'>";
     // create html to be added

     space = " ";

     text = space + spanStartTime + word + "</span>";

     // append text to paragraph
     para = "#para-" + paragraphCounter;

     $(para).append(text);

     paragraphWordCounter++

    };
    // new para each 4 chunks
    if ((j % 4) == 0) {
     paragraphCounter++;
     paraId = "para-" + paragraphCounter;
     newPara = CreateNewPara(word_start_time, new_speaker, paraId);
     $('#content').append(newPara);
     // reset the paragraph word counter
     paragraphWordCounter = 0;
     // console.log(word);
     // console.log('para too long');
    }

   }
  }
 }

 // Google SpeechKit json parser (Works only if speaker diarization turned on!)
 // TODO test this
 else if (data.response.results) {
  console.log('GoogleSpeechKit formatted data detected');
  // turn on confidence display toggle
  document.getElementById('confidence').removeAttribute('disabled');

  // turn off confidence toggle
  document.getElementById('confidence').setAttribute('disabled', 'disabled');


  var results = data.response.results

  jsonLength = results.length

  if (results[jsonLength - 1].alternatives[0].words[0]['speakerTag'] != undefined) {
   results = [results[jsonLength - 1]]
   jsonLength = results.length
  }

  var confidence = 1;

  // loop through json to appeand words and data
  // TODO need to adjust this to create a para first
  // then to append words to that paragraph
  // then when speaker changes to create a new para
  for (var j = 0; j < jsonLength; j++) {
   chunk = results[j].alternatives[0].words;
   chunkLength = chunk.length;

   if (j == 0) {

    new_speaker = "spk_" + chunk[0].speakerTag;

    // add new para
    // function takes: timeOfFirstWord, speaker, wordCount
    paraId = "para-" + paragraphCounter;
    newPara = CreateNewPara('0', new_speaker, paraId);
    $('#content').append(newPara);

   };

   for (var i = 0; i < chunkLength; i++) {
    // get data from JSON string

    wordLabel = chunk[i].word;
    startTimeLabel = Number(chunk[i]["startTime"].substr(0, chunk[i]["startTime"].length - 1));
    durationLabel = Number(chunk[i]["endTime"].substr(0, chunk[i]["endTime"].length - 1)) - Number(chunk[i]["startTime"].substr(0, chunk[i]["startTime"].length - 1));

    if (i < chunkLength - 1) {
     nextStartTime = Number(chunk[i + 1]["startTime"].substr(0, chunk[i]["startTime"].length - 1)) - Number(chunk[i]["endTime"].substr(0, chunk[i]["endTime"].length - 1));
    } else {
     nextStartTime = 0;
    }

    word = chunk[i].word;
    // word start time is in seconds

    // create an manual adjustment to data when there is a playback sync error
    // word highlighting too early means data time is too low, so make it higher
    // word highlighting too late means data time is too high, so make it lower
    var adjustment = 0;

    word_start_time = startTimeLabel + adjustment;
    word_start_time_ms = word_start_time * 1000

    next_word_start_time = nextStartTime + adjustment;
    next_word_start_time_ms = next_word_start_time * 1000

    duration_ms = 1000 * durationLabel;




    // add data to each word: confidence, start time, duration, speaker
    spanStartTime = "<span data-n='" + next_word_start_time_ms + "' data-s='" + chunk[i].speakerTag + "'data-m='" + word_start_time_ms + "' data-d='" + duration_ms + "' data-confidence='" + confidence + "'>";
    // create html to be added

    space = " ";

    text = space + spanStartTime + word + "</span>";

    // append text to paragraph
    para = "#para-" + paragraphCounter;

    $(para).append(text);

    paragraphWordCounter++

    //if (paragraphWordCounter > max_para_length) {
    // set data for new speaker

    if (i < chunkLength - 2 && chunk[i].speakerTag != chunk[i + 1].speakerTag && chunk[i].speakerTag != chunk[i + 2].speakerTag) {
     paragraphCounter++;
     paraId = "para-" + paragraphCounter;
     new_speaker = 'spk_' + chunk[i + 1].speakerTag
     newPara = CreateNewPara(word_start_time, new_speaker, paraId);
     $('#content').append(newPara);
     // reset the paragraph word counter
     paragraphWordCounter = 0;
    }
    //};


   };


   if ((j % 4) == 0) {
    paragraphCounter++;
    paraId = "para-" + paragraphCounter;
    newPara = CreateNewPara(word_start_time, new_speaker, paraId);
    $('#content').append(newPara);
    // reset the paragraph word counter
    paragraphWordCounter = 0;
   }


  }
 }


 var obj = JSON.stringify(results);
 $('.raw').html(transcript_raw);
 $('.whole').html(obj);

 // });


 var autoScrollCheck = document.getElementById("autoscroll-off").checked;
 if (autoScrollCheck) {
  setTimeout(
   function () {
    console.log('transcript being initiated');
    hyper(true);

   }, 1000)
 }

};

// Link


// copy to clipboard
function CopyToClipboard(containerid) {
 // Create a new textarea element and give it id='temp_element'
 var textarea = document.createElement('textarea');
 textarea.id = 'temp_element';
 // Optional step to make less noise on the page, if any!
 textarea.style.height = 0;
 // Now append it to your page somewhere, I chose <body>
 document.body.appendChild(textarea);
 // Give our textarea a value of whatever inside the div of id=containerid
 textarea.value = document.getElementById(containerid).innerText;
 // Now copy whatever inside the textarea to clipboard
 var selector = document.querySelector('#temp_element');
 selector.select();
 document.execCommand('copy');
 // Remove the textarea
 document.body.removeChild(textarea);
};
