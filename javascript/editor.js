// adds aditing functionality such as click highlighting and keyboard shortcuts to control audio

// creates an array of all annotated text
// ultimately, want to break them down by catogory. a column per category



// create array of annotations to be exported
function getAnnotations() {
    numberOfCategories = 7 + 1;


    // this would make an n*m matrics
    // var matrix = [];
    // for(var i=0; i<7; i++) {
    //     matrix[i] = [];
    //     for(var j=0; j<9; j++) {
    //         matrix[i][j] = ',';
    //     }
    // }

    // create the array from category names and contents
    var annotationsArray = []
    for (let i = 1; i < numberOfCategories; i++) {
        getCategory = '.category-' + i;
        categoryName = $(getCategory).html();
        // populate the list from the transcript
        var items = document.getElementsByClassName('selected-' + i);
        // var items = document.getElementsByClassName(categoryName);
        //var array = [categoryName]
        // put just the inner text in a new array
        for (let j = 0; j < items.length; j++) {
            time = 0;

            if (items[j].parentElement && items[j].parentElement.attributes["data-time"]){
            time = Math.round(items[j].parentElement.attributes["data-time"].value);
            tc = items[j].parentElement.attributes["data-tc"].value;
          }
            annotationsArray.push([categoryName,time,tc, items[j].innerText]);
        }
    }

    return annotationsArray;
}

// export to csv on button click
// set category name as filename, set data to rows
function exportToCsv() {

    filename = "test.csv";
    // define rows from annotations
    rows = getAnnotations()

    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    let csvFile = 'Category,Time(sec),Time(mm:ss),Text' + '\n';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }


    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

$(document).ready(function () {

    new GreenAudioPlayer('.gap-example');

    // load audio
    var myAudio = document.getElementById("hyperplayer");
    var isPlaying = false;
    var playbackRate = 1.0;

    // select and highlight the clicked word (ready to be edited)
    // checks if the element clicked has a data confidence value, which implies it's a word
    $('#content').on("click", "span", function () {
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

var displayConfidenceToggle = true



$('#confidence').prop('checked', false);

$('#confidence').change(function () {
    // store the value of the checkbox when it's changed
    var confidenceCheckbox = document.getElementById("confidence").checked;
    window.localStorage.setItem("autoscroll-off", confidenceCheckbox);
    console.log("new confidence checkbox value:" + confidenceCheckbox);
    // if (confidenceCheckbox == true) {
        displayConfidence()
    // }
});

// highlight low confidence words

function displayConfidence() {

    if (displayConfidenceToggle == false) {
        var userConfidence = $("#user-confidence").val()
        var userConfidence = 0.95;
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
// display confidence by default for demo
displayConfidence()

// turn off the interactivity and return text color
// TODO this is not a smart way of doing this!

var autoscrollOffToggle = false;

function autoscrollOff() {


    if (autoscrollOffToggle == false) {
        // to beat the javascript altering the color each span had to be selected
        $("[data-m]").addClass("not-interactive")
        $(".timecode").addClass("not-interactive")
        autoscrollOffToggle = true
        console.log('interactive transcript off');
        hyper(false);
    } else if (autoscrollOffToggle == true) {
        $(".not-interactive").removeClass("not-interactive");

        autoscrollOffToggle = false;
    }

}
