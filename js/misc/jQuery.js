// http://stackoverflow.com/questions/5436327/jquery-deferreds-and-promises-then-vs-done
var jqxhr = $.ajax({
    url: 'http://api.qa01.medscape.com/servicegateway/medscapeuserdata',
    xhrFields: {withCredentials: true}
});
//jqxhr.then() vs jqxhr.done()



$._data($($0)[0], 'events');