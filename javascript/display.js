// This script converts the json transcript file to html
// so that hyperaudio-lite can interpret it

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

// creates a new paragraph tag
function CreateNewPara(timeOfFirstWord, speaker, paraId) {
    var formattedTime = fmtMSS(timeOfFirstWord)
    var paraTime = "<p id='" + paraId + "' data-time='" + timeOfFirstWord + "' data-tc='" + formattedTime + "'>";
    // only give it span if a word?
    var paraSpeaker = "<span class='unread' data-m='" + timeOfFirstWord + "' data-d='0' class='speaker'>" + speaker + " </span>";
    var paraFormattedTime = "<span class ='timecode'>[" + formattedTime + "] </span>";
    var endPara = "</p>"
    var newPara = paraTime + paraSpeaker + paraFormattedTime + endPara;
    return newPara;
}

// load audio from file or url
function getAudioUrl() {
    var audioUrl = "audio/" + document.getElementById("audioUrl").value;
    document.getElementById("hyperplayer").src = audioUrl;
}

// load transcript on start
displayTranscript()


// for the audio control (possibly to be deleted eventually)
var speakerTimes = [];
var transcriptObject = [];

function displayTranscript() {

    // get json transcript from user input (default transcript.json)
    var json = "json/" + document.getElementById("user-filename").value;
    console.log("loading: " + json);

    $.getJSON(json, function (data) {

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


        // parse the DeepSPeech formatted json
        if (document.getElementById('deepspeech').checked) {
            var results = data.words

            jsonLength = results.length

            console.log(results);


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
                word_start_time = startTimeLabel;
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
                var max_para_length = 35;


                //for (var i = 0; i < speaker_times.length; i++) {
                //console.log(speaker_times[i]);
                //}
                paragraphWordCounter++
                console.log(paragraphWordCounter);

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



        } else {
            // parse the AWS formatted json

            var results = data.results;
            var transcript_raw = JSON.stringify(results.transcripts[0].transcript);

            // create empty array to hold speaker names and start times
            // TODO is this array actually used in anything?  
            // REPLY: yes, it is used to look up who the speaker is depending on the time
            // Note: in the json a speaker can speak multiple times in a row
            // we simplify this
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
                word_start_time_ms = word_start_time * 1000
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
                    new_speaker = speaker_times[speaker_counter][0];

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
                var max_para_length = 35;


                if (type == "punctuation" && (word == "." || word == "!" || word == "?") && paragraphWordCounter > max_para_length && new_speaker == speaker_times[speaker_counter][0]) {
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

                //for (var i = 0; i < speaker_times.length; i++) {
                //console.log(speaker_times[i]);
                //}

            };

        }



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