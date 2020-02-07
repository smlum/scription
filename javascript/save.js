// script to autosave to local storage

// TODO: stop javascript running when page not active

// check for idleness every 10 seconds
// idle if no mouse or key events for 20 seconds
var idleTime = 0;
$(document).ready(function () {

    // save configuration as cookies

    // save autosave configuration
    $('#autosave').change(function() {
        // store the value of the checkbox when it's changed
        var autosaveCheckbox = document.getElementById("autosave").checked;
        window.localStorage.setItem("autosave-check", autosaveCheckbox);
        console.log("new saved value:" + autosaveCheckbox);
        if (autosaveCheckbox == true) {
            startTimer();
        }
    });

    // save deepspeech configuration
    $('#deepspeech').change(function() {
        // store the value of the checkbox when it's changed
        var deepspeechCheckbox = document.getElementById("deepspeech").checked;
        window.localStorage.setItem("deepspeech-check", deepspeechCheckbox);
        console.log("new deepspeech value:" + deepspeechCheckbox);
    });

    //Increment the idle time counter every minute.

});

function startTimer() {
    var idleInterval = setInterval(timerIncrement, 2000); // 10 seconds
    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
}

// call autosave function if not idle
function timerIncrement() {
    idleTime++;
    if (idleTime > 2) { // idle after 20 seconds
      console.log("idle");
    } else {
      autosave()
    }
}



// save content to local storage
function autosave(){

    
    // save transcript text
    var textToSave = document.getElementById("content").innerHTML;
    window.localStorage.setItem("saved-text", textToSave);
    // save input box text
    var audioUrlToSave = document.getElementById("audioUrl").value;
    window.localStorage.setItem("saved-audio-url", audioUrlToSave);
    var jsonUrlToSave = document.getElementById("user-filename").value;
    window.localStorage.setItem("saved-transcript-filename", jsonUrlToSave);
    console.log("saved");
};

// load previously saved data
function loadSavedText() {    
    
    if(typeof(Storage) !== "undefined") {

        // check if the set value for the checkbox is true
        // if it's true, then set the checkbox value to true

        if (localStorage.getItem("autosave-check")) {
            var previousCheck = localStorage.getItem("autosave-check")
            
            // if no autosave, then load the transcript
            // if autosave turned on then load the stored data
            if (previousCheck == "false") {
                console.log("no autosave");
                document.getElementById("autosave").checked = false;
                displayTranscript()
            } else if (previousCheck == "true") {
                console.log("autosave enabled");
                document.getElementById("autosave").checked = true;
                startTimer();

                if (localStorage.getItem("saved-text")) {
                    var storedText = localStorage.getItem("saved-text");
                    console.log("saved data found");
                    document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + storedText;
                }
                if (localStorage.getItem("saved-audio-url")) {
                    var storedAudioUrl = localStorage.getItem("saved-audio-url")
                    document.getElementById("audioUrl").value = storedAudioUrl;
                }
                if (localStorage.getItem("saved-transcript-filename")) {
                    var storedJsonUrl = localStorage.getItem("saved-transcript-filename")
                    document.getElementById("user-filename").value = storedJsonUrl;
                }
            }
        }
    } else {
        //document.getElementById("result").innerHTML = "Sorry, autosave didn't work :'(";
    }
}
$(document).ready(function() {
  loadSavedText();

})
