// script to autosave to local storage

// TODO: stop javascript running when page not active

// check for idleness every 10 seconds
// idle if no mouse or key events for 20 seconds
var idleTime = 0;
$(document).ready(function () {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 10000); // 10 seconds
    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
});

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
        if (localStorage.getItem("saved-text")) {
            var storedText = localStorage.getItem("saved-text")
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
    } else {
        //document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
    }
}
$(document).ready(function() {
  loadSavedText();
})
