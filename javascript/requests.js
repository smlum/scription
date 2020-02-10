$.get( "http://localhost:5000/files", function( data ) {
console.log(data);

var mySelect = $('#audioUrl');
$.each(data[0], function(val, text) {
    mySelect.append(
        $('<option></option>').val(text).html(text)
    );
});
var mySelect = $('#user-filename');
$.each(data[1], function(val, text) {
    console.log('object');
    mySelect.append(
        $('<option></option>').val(text).html(text)
    );
});

});