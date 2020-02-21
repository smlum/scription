// script to autosave to local storage



// export transcrpt
// function exportToTxt() {
//     console.log('saving');
//     var blob = new Blob(["Welcome to Websparrow.org."],
//         { type: "text/plain;charset=utf-8" });
//     saveAs(blob, "static.txt");
// }

// function exportToTxt() {
//     var content = "bla"
//     var fileName = "blo.txt"
//     var contentType = "text/plain;charset=utf-8"
//     var a = document.createElement("a");
//     var file = new Blob([content], {type: contentType});
//     a.href = URL.createObjectURL(file);
//     a.downloadd = fileName;
//     a.click();
// }
// downloadd(jsonData, 'json.txt', 'text/plain');

// export just text to file
function exportToTxt() {
    var filename = "transcript.txt";
    // var text = document.getElementById("content").innerHTML;
    var text = document.getElementById("content").textContent;;
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// export raw html to file - can late be reloaded
function exportToHtml() {
    var userFilename = $('#save-html-name').val();

    var filename = userFilename;
    console.log('saving: ' + filename);
    var text = document.getElementById("content").innerHTML;
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


// TODO: stop javascript running when page not active

// check for idleness every 10 seconds
// idle if no mouse or key events for 20 seconds
var idleTime = 0;
$(document).ready(function () {

    // save configuration as cookies

    // save autosave configuration
    $('#autosave').change(function () {
        // store the value of the checkbox when it's changed
        var autosaveCheckbox = document.getElementById("autosave").checked;
        window.localStorage.setItem("autosave-check", autosaveCheckbox);
        console.log("new saved value:" + autosaveCheckbox);
        if (autosaveCheckbox == true) {
            startTimer();
        }
    });

    $('#autoscroll-off').change(function () {
        // store the value of the checkbox when it's changed
        var autoscrollCheckbox = document.getElementById("autoscroll-off").checked;
        window.localStorage.setItem("autoscroll-off", autoscrollCheckbox);
        console.log("new autoscroll value:" + autoscrollCheckbox);
        if (autoscrollCheckbox == true) {
            hyper()
        }
        autoscrollOff();
    });

    // realise better to do this was to add an if condition on the function
    $('#annotation-switch').change(function () {
        // 
        var annotaionCheckbox = document.getElementById("annotation-switch").checked;
        if (annotaionCheckbox == true) {
            $(".selected").css({"backgroundColor": ""});
            // $(".drop-element").css({'cssText': 'display: none !important'});
            console.log("annotations on");
        } else {
            $(".selected").css({"backgroundColor": "transparent"});
            // $(".drop-element").css({'cssText': 'display: block !important'});
            console.log("annotations off");
        }
        
        // $('.selected').css("background-color") = "transparent !important";
    });


    // $('#dark-mode-switch').change(function () {
    //     // store the value of the checkbox when it's changed
    //     var darkModeCheck = document.getElementById("dark-mode-switch").checked;
    //     window.localStorage.setItem("dark-mode-switch", darkModeCheck);
    //     console.log("new darkmode value:" + darkModeCheck);
    // });




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
        // console.log("idle");
    } else {
        autosave()
    }
}



// save content to local storage
function autosave() {


    // save transcript text
    var textToSave = document.getElementById("content").innerHTML;
    window.localStorage.setItem("saved-text", textToSave);
    // save input box text - turned off
    // var audioUrlToSave = document.getElementById("audioUrl").value;
    // window.localStorage.setItem("saved-audio-url", audioUrlToSave);
    // var jsonUrlToSave = document.getElementById("user-filename").value;
    // window.localStorage.setItem("saved-transcript-filename", jsonUrlToSave);
    // console.log("saved");

    // save annotation sidebar contents
    // var annotationsToSave = document.getElementsByClassName("annotation-content-1").innerHTML;
    var annotationsToSave = $('.annotation-content-1').html();
    window.localStorage.setItem("saved-annotation-1", annotationsToSave);
};



// load previously saved data
function loadSavedText() {

    if (typeof (Storage) !== "undefined") {

        // check if the set value for the checkbox is true
        // if it's true, then set the checkbox value to true

        if (localStorage.getItem("autosave-check")) {
            var previousCheck = localStorage.getItem("autosave-check")

            // if no autosave, then load the transcript
            // if autosave turned on then load the stored data
            if (previousCheck == "false") {
                console.log("no autosave");
                document.getElementById("autosave").checked = false;
                // uncomment for automatic display
                // displayTranscript()
            } else if (previousCheck == "true") {
                console.log("autosave enabled");
                document.getElementById("autosave").checked = true;
                startTimer();

                if (localStorage.getItem("saved-text")) {
                    var storedText = localStorage.getItem("saved-text");
                    console.log("saved data found");
                    document.getElementById("content").innerHTML = document.getElementById("content").innerHTML + storedText;
                }
                // TODO save more for each one
                if (localStorage.getItem("saved-annotation-1")) {
                    var storedAnnotation = localStorage.getItem("saved-annotation-1");
                    $('.annotation-content-1').html(storedAnnotation);
                }
                // load dark mode from cookie, else detect it from user computer
                // if (localStorage.getItem("dark-mode-switch") != undefined) {
                //     var storedDarkMode = localStorage.getItem("dark-mode-switch")
                //     // note that stored data is a string not a Boolean
                //     if (storedDarkMode == "true") {
                //         $('#dark-mode-switch').prop('checked', true);
                //     } else {
                //         $('#dark-mode-switch').prop('checked', false);
                //     }
                // } else {
                //     if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                //         // dark mode
                //         console.log('dark mode detected from system');
                //         $('#dark-mode-switch').prop('checked', true);
                //     } else {
                //         console.log('light mode detected from system');
                //         $('#dark-mode-switch').prop('checked', false);
                //     }
                // }
                // if (localStorage.getItem("saved-audio-url")) {
                //     var storedAudioUrl = localStorage.getItem("saved-audio-url")
                //     document.getElementById("audioUrl").value = storedAudioUrl;
                // }
                // if (localStorage.getItem("saved-transcript-filename")) {
                //     var storedJsonUrl = localStorage.getItem("saved-transcript-filename")
                //     document.getElementById("user-filename").value = storedJsonUrl;
                // }
                
            }
        }
    } else {
        //document.getElementById("result").innerHTML = "Sorry, autosave didn't work :'(";
    }
}
$(document).ready(function () {
    loadSavedText();

})