var selection = '';
var params = '';
var drop;

// twttr.widgets.load();

function addShareTool() {
  if (window.getSelection) {
    selection = window.getSelection();
  } else if (document.selection) {
    selection = document.selection.createRange();
  }

  if (selection.toString() !== '') {
    if (drop) {
      drop.close();
      drop.remove();
      drop = null;
    }

    anchorNode = selection.anchorNode.parentNode;
    focusNode = selection.focusNode.parentNode;

    var anchorNodeTime = parseInt(anchorNode.getAttribute('data-m'), 10);
    var anchorNodeDuration = parseInt(anchorNode.getAttribute('data-d'), 10);
    var focusNodeTime = parseInt(focusNode.getAttribute('data-m'), 10);
    var focusNodeDuration = parseInt(focusNode.getAttribute('data-d'), 10);

    // 1/10 of a second accuracy is fine for our needs

    anchorNodeTime = Math.floor(anchorNodeTime / 100);
    anchorNodeDuration = Math.floor(anchorNodeDuration / 100);
    focusNodeTime = Math.floor(focusNodeTime / 100);
    focusNodeDuration = Math.floor(focusNodeDuration / 100);

    if (anchorNodeTime < focusNodeTime) {
      params =
        '?s=' +
        anchorNodeTime +
        '&d=' +
        (focusNodeTime + focusNodeDuration - anchorNodeTime);
    } else {
      params =
        '?s=' +
        focusNodeTime +
        '&d=' +
        (anchorNodeTime + anchorNodeDuration - focusNodeTime);
    }

    drop = new Drop({
      target: anchorNode,
      classes: 'drop-theme-arrows-bounce-dark',
      position: 'top center',
      constrainToWindow: true,
      constrainToScrollParent: false,
      openOn: 'always',
      content: '<div id="tweet-box"></div>',
    });

    drop.on('open', fillShare, false);

    /*<a class="sharelink" href="#"><span class="icon-twitter"></span><span style="padding-left:40px">Share this text + video on Twitter</span></a>*/
  }
}

function fillShare() {
  var url = window.location.href;
  var lastCharPos = url.length - 1;

  if (url.charAt(lastCharPos) == '/') {
    // URL ends with a '/'
    url = url.substr(0, lastCharPos);
  }

  //use intents http://stackoverflow.com/questions/6320007/how-do-i-add-a-hashtag-to-a-custom-tweet-button

  var shareText = selection + ' ' + url + params;

  var overspill = shareText.length - 140;

  selection += '';

  if (selection.charAt(0) == ' ') {
    // trim leading whitespace
    selection = selection.substring(1, selection.length);
  }

  if (overspill > 0) {
    selection = selection.substr(0, selection.length - overspill - 5) + '...'; //3 dots + 2 quotes make 5 chars (subtract 5)
  }

  selection = '&quot;' + selection + '&quot;';

  document.getElementById('tweet-box').innerHTML =
    '<div class="tweet-btn-hldr"> <a data-size="large" data-url="" data-text="' +
    selection +
    ' ' +
    url +
    params +
    '" href="http://twitter.com/share?url=none&count=none" class="twitter-share-button"></a><span><br/> text+video</span></div>';
  drop.position();

  twttr.widgets.load();
}

function closeDrop() {
  if (drop) {
    drop.close();
  }
}

var transcript = document.getElementById('hypertranscript');
transcript.addEventListener('mouseup', addShareTool, false);
transcript.addEventListener('touchend', addShareTool, false);
transcript.addEventListener('click', closeDrop, true);
