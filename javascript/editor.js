// adds aditing functionality such as click highlighting and keyboard shortcuts to control audio

$(document).ready(function () {

    // load audio 
    var myAudio = document.getElementById("hyperplayer");
    var isPlaying = false;
    var playbackRate = 1.0;

    // select and highlight the clicked word (ready to be edited)
    $('#content').on("click", "[data-confidence]", function () {
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
    });

    // Add keybaord shortcuts

    // toggle play and pause
    function togglePlay() {
        if (isPlaying) {
            myAudio.pause();
        } else {
            myAudio.play();
        };
    };
    myAudio.onplaying = function () {
        isPlaying = true;
    };
    myAudio.onpause = function () {
        isPlaying = false;
    };

    document.addEventListener('keydown', function (e) {
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
            console.log('playback rate: ' + playbackRate);

        };
        // slow down audio (ctrl + shift + <)
        if (e.ctrlKey && e.shiftKey && e.keyCode == 188) {
            if (playbackRate > 0.25) {
                playbackRate = playbackRate - 0.25;
            };
            myAudio.playbackRate = playbackRate;
            console.log('playback rate: ' + playbackRate);
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

var displayConfidenceToggle = false

// highlight low confidence words
function displayConfidence() {
    
    if (displayConfidenceToggle == false) {
        var userConfidence = $("#user-confidence").val()
        console.log(userConfidence);
        $("span").filter(function() {
            return $(this).data("confidence") < userConfidence;
            }).addClass("low-confidence")
        displayConfidenceToggle = true
    } else if (displayConfidenceToggle == true) {
        $(".low-confidence").removeClass("low-confidence");
        console.log('removed');
        
        displayConfidenceToggle = false;
    }
    
}

// turn off the interactivity and return text color 
// TODO this is not a smart way of doing this!

var autoscrollOffToggle = false;

function autoscrollOff() {
    
    if (autoscrollOffToggle == false) {
        // to beat the javascript altering the color each span had to be selected
        $("[data-m]").addClass("not-interactive")
        $(".timecode").addClass("not-interactive")
        autoscrollOffToggle = true
        console.log('autoscroll off');
        hyper(false);
    } else if (autoscrollOffToggle == true) {
        $(".not-interactive").removeClass("not-interactive");
        
        autoscrollOffToggle = false;
    }
    
}