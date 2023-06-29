
function WhisperParser() {

}

WhisperParser.prototype.detect = function (jsonobj) {
    let retval =  (jsonobj.segments) ? true : false
    if(retval) { console.log('Whisper formatted data detected') }
    return retval
}

/**
 * configure editor toggles given the transcript input
 */
WhisperParser.prototype.config() = function () {
    // turn off confidence toggle
    document.getElementById('confidence').removeAttribute('disabled');
}

WhisperParser.prototype.generate = function (jsonobj) {
    var results = jsonobj.segments

    transcriptObject = results.words;
    var confidence = 1;

    // process each result
    results.forEach((segment, idx) => {
        let adjustment = 0

        let word_start_time = segment.start + adjustment;
        let word_start_time_ms = word_start_time * 1000

        let duration = segment.end - segment.start
        let duration_ms = 1000 * duration

        let confidence = Math.exp(segment.avg_logprob) // see: https://github.com/openai/whisper/discussions/1183#discussioncomment-5585981
        let paraId = "para-" + idx
        let speakerId = "speaker 0"

        newPara = CreateNewPara(word_start_time, speakerId, paraId);
        $('#content').append(newPara);

        let html = "<span data-m='" + word_start_time_ms + "' data-d='" + duration_ms + "' data-confidence='" + confidence + "'>"
            + " "
            + segment.text
            + "</span>";

        para = "#" + paraId;

        $(para).append(html);

    })
}

