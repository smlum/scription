$.get( "http://localhost:5000/files", function( data ) {

var mySelect = $('#audioUrl');
$.each(data[0], function(val, text) {
    mySelect.append(
        $('<option></option>').val(text).html(text)
    );
});
var mySelect = $('#user-filename');
$.each(data[1], function(val, text) {
    mySelect.append(
        $('<option></option>').val(text).html(text)
    );
});
var mySelect = $('#html-load');
$.each(data[2], function(val, text) {
    mySelect.append(
        $('<option></option>').val(text).html(text)
    );
});

});