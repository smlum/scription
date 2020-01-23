  // description: editor for Amazon Web Service Translate output file

  // TODO:
  // custom confidence thresholds
  // add playback editing for low confidence words
  //    - audio playback (start/ stop/ speed)
  //    - shifting input on red words as they come up in speech
  //        - time dependent or in sequence
  // add custom speaker naming
  //    - and toggle live speaker during playback
  // improve speaker recognition/ correction
  // add toggle options
  // add error messages
  // adapt for when speaker detection is not enabled
  // create a form to find and replace speaker names
  // delete content div when new transript is loaded
  // create info box like this: https://codepen.io/Shokeen/pen/XXggZr
  // add autoscroll playback option
  // add infobox

  function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+Math.round(s)}

  // function that adds the content, html and data for new paragraphs and speakers
  function CreateNewPara(timeOfFirstWord, speaker, wordCount) {
    var formattedTime = fmtMSS(timeOfFirstWord)      
    if (wordCount > 0) {
      var endPara = "</span>";
    } else {
      endPara = "";
    };
    var paraTime = "<p data-time='" + timeOfFirstWord + "' data-tf='" + formattedTime + "'>";
    var paraSpeaker = "<span class='speaker-header'>" + speaker + " </span>";
    var paraFormattedTime = "<span class ='timecode'>[" + formattedTime + "] </span>";
    var newPara = endPara + paraTime + paraSpeaker + paraFormattedTime;
    return newPara;
  }

  // load audio from file or url
  function getAudioUrl() {
    var audioUrl = document.getElementById("audioUrl").value;
    document.getElementById("audio").src = audioUrl;

  // add waveform visualisation - save for later
    //   var wavesurfer = WaveSurfer.create({
    //     container: '#waveform',
    //     waveColor: 'violet',
    //     progressColor: 'purple'
    // });
    //     wavesurfer.load('audio.mp3');


  }

  // for the audio control (possibly to be deleted eventually)
  var speakerTimes = [];
  var transcriptObject = [];

  function displayTranscript() {
    // clear any previous text from transcript box
    // the below clears but doesn't display the new data
    // document.getElementById("content").innerHTML = "";

    // get json transcript filename from user input (default transcript.json)
    var json = document.getElementById("user-filename").value;

    $.getJSON(json, function(data) {
      // data is the JSON string
      var results = data.results;
      var transcript_raw = JSON.stringify(results.transcripts[0].transcript);

      // create an array of start times for each speaker
      // possible reduced version commented out below
      // var speaker_times = [];
      // var segments = results.speaker_labels.segments;
      // for (var i = 0; i < segments.length; i++) {
      //   speaker = [];
      //   speakerLabel = segments[i].speaker_label
      //   // don't push if it's the same one
      //   if ((i == 0 ) || (segments[i].speaker_label != segments[i-1].speaker_label)) {
          
      //     speaker.push(segments[i].speaker_label);
      //     speaker.push(Number(segments[i].start_time));
      //     speaker_times.push(speaker);
      //   } 
      // };
      

      // old version of speaker times below
      var speaker_times = [];
      var segments = results.speaker_labels.segments;
      for (var i = 0; i < segments.length; i++) {
        speaker = [];
        speaker.push(segments[i].speaker_label);
        speaker.push(Number(segments[i].start_time));
        speaker_times.push(speaker);
      };

      // saving global variables for use in audio-control.js (poss can delete)
      speakerTimes = speaker_times

      transcriptObject = results.items;

      // assign variables for use in for loop below
      var text = "";
      // possibly tidy up speaker counter in future versions
      var speaker_counter = 0;
      var new_speaker = "";
      // to count how long each para is to avoid too long paras
      var paragraphCounter = 0;
      var newPara = "";

      // loop through json to appeand words and data
      for (var i = 0; i < results.items.length; i++) {
        // get data from JSON string
        word = results.items[i].alternatives[0].content;
        confidence = results.items[i].alternatives[0].confidence;
        word_start_time = results.items[i].start_time;
        next_word_start_time = results.items[i+1].start_time;
        type = results.items[i].type;        

        // check for punctuation and ensure punctuation doesn't have spaces before them
        if (type == "pronunciation") {
          space = " ";
          paragraphCounter++;
        } else if (type == "punctuation") {
          space = "";
        };

        // remove unwanted utterances 
        if (word == "um" | word == "Um") {
          word = "";
        }        

        // make sure first word has a speaker - may be unecessary
        if (i == 0) {
          // find out and set the speaker counter for the first word
          while (Number(speaker_times[speaker_counter][1]) < Number(word_start_time)) {
            speaker_counter++;
          };

          new_speaker = speaker_times[speaker_counter][0];
          
          // $('#speaker').before("<span class='speaker-header'>" + speaker_times[speaker_counter][0] + ":</span>");
          // $('#speaker').before("<br><br>")
          // add new para
          // function takes: timeOfFirstWord, speaker, wordCount
          newPara = CreateNewPara(word_start_time, new_speaker, i)
          $('#speaker').before(newPara)
          // document.getElementById('speaker').insertAdjacentHTML('beforebegin',
          // newPara);
          console.log(newPara);
        };

        // add new para if speaker changes
        if ((speaker_counter < speaker_times.length) && (i != 0)) {
          if (speaker_times[speaker_counter][1] - 0.1 < word_start_time) {
            // TODO only display if speaker changes for less than a specified amount of time
            // default minumum time set to 1 sec
            var min_time = 1;
            if (speaker_times[speaker_counter + 1] && (speaker_times[speaker_counter + 1][1] - speaker_times[speaker_counter][1] > min_time)) {

              // new paragraph if speaker has actually changed
              // change this to use paragraph tags instead of line breaks if possible
              if (new_speaker != speaker_times[speaker_counter][0]) {
                new_speaker = speaker_times[speaker_counter][0];
                
                newPara = CreateNewPara(word_start_time, new_speaker, i)
                $('#speaker').before("</p><br><br>");
                $('#speaker').before(newPara)
                // $('#speaker').before("<span class='speaker-header'>" + speaker_times[speaker_counter][0] + ":</span>");
                paragraphCounter = 0;
              };
            };
            speaker_counter++;
          };
        };



        // add data to each word: confidence, start time, speaker
        spanStartTime = "<span class='word-container' data-time=" + word_start_time + " data-confidence=" + confidence + ">";
        // comment out line below if using tooltips
        text = space + spanStartTime + word + "</span>";


        // Uncomment out below to use tooltips
        // spanTooltip = "<span class='tooltiptext'>";
        // divTooltip = "<div class='tooltip'>";
        // text = space + divTooltip + spanStartTime + word + "</span>" + spanTooltip + confidence + "<br>" + word_start_time + "</span>" + "</div>";

        // append text to speaker div
        $('#speaker').before(text);        
        
        // if it gets to a full stop and the current paragraph is too long, start a new paragraph
        // TODO let user set the paragraph amount
        var max_para_length = 35;

          if (type == "punctuation" && (word == "." || word == "!" || word == "?") && paragraphCounter > max_para_length && new_speaker == speaker_times[speaker_counter][0]) {
            // set data for new speaker
            newPara = CreateNewPara(next_word_start_time, new_speaker, i)
            $('#speaker').before("</span><br><br>");
            $('#speaker').before(newPara)
            // $('#speaker').before("<br><br>");
            // $('#speaker').before("<span class='speaker-header " + speaker_times[speaker_counter][0] + "'>" + speaker_times[speaker_counter][0] + ":</span>");
            paragraphCounter = 0;
          };
        

        //for (var i = 0; i < speaker_times.length; i++) {
        //console.log(speaker_times[i]);
        //}

      };

      var obj = JSON.stringify(results);
      $('.raw').html(transcript_raw);
      $('.whole').html(obj);

    });

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

