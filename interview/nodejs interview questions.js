var http = require('http');

var server = http.createServer(function (request, response) {
    var body = "";
    request.on('data', function (chunk) {        
        *****
    });
    request.on('end', function () {
        response.end('Post data: ' + body);
    });
}).listen(8080);

var clientOptions = {host: 'localhost', port: 8080, path: '/user', method: 'POST'};
var request = http.request(clientOptions, function(response) {
    response.on('data', function(data) { process.stdout.write(data);});    
    response.on('end', function(){server.close();});
});
request.write('first_name=john');
request.end('&last_name=doe');
 



  NodeJS ODM (Object Document Mapper) model?



	A.	console.log('user %s of age %d has name %j', ['johndoe', 30, {first: 'John', last: 'Doe'}]);
 
	B.	console.log('user %s of age %d has name %j', 'johndoe', 30, {first: 'John', last: 'Doe'});
 
	C.	console.log({format: 'user %s of age %d has name %j', args: ['johndoe', 30, {first: 'John', last: 'Doe'}]});
 
	D.	console.log('johndoe', 30, {first: 'John', last: 'Doe'});
 
	E.	console.log({user:'johndoe', age:30, name:{first: 'John', last: 'Doe'}, inspect: function(){return JSON.stringify(this)}});
 


	A.	Reverse proxies provide enhanced error handling capability compared to cluster module.
	B.	Many reverse proxies support sticky load balancing while cluster module does not.
	C.	Reverse proxies provide means of communication between its worker processes while cluster module does not.
	D.	Reverse proxies provide many additional services when compared to cluster module like url rewrites, response caching, optimized static file serving and ssl termination.
	E.	Reverse proxy distribute load across machines while cluster module can distribute load across processes on same machine.
Submit Answer	Skip Question






A developer is writing a NodeJS program to zip a file using the code below:

var fs = require('fs');
var gzip = require('zlib').createGzip();
var input = fs.createReadStream('file.txt');
var output = fs.createWriteStream('file.txt.gz');
****

Which of the following can be subsituted for **** to complete this code and pipe the input, gzip and output streams?
	A.	output.pipe(gzip).pipe(input);
	B.	input.pipe(gzip);
gzip.pipe(output);
	C.	input.pipe(gzip).pipe(output);
	D.	output.pipe(gzip.pipe(input));
	E.	input.pipe(gzip.pipe(output));


	Which of the following commands can be used to locate and update any MongoDB document atomically using MongoDB client (when accessed concurrently by multiple clients)?
	A.	db.collection.findAndModify();
	B.	db.collection.save(db.collection.find());
	C.	db.collection.update(db.collection.find());
	D.	db.collection.update(db.collection.findOne());
	E.	db.collection.save(db.collection.findOne());





Which of the following are valid methods for scaling a NodeJS application across multiple machines?
	A.	Using caching of request and responses of a NodeJS application
	B.	Using reverse proxy servers like nginx or haproxy
	C.	Using the NodeJS module cluster
	D.	Using the NodeJS module child_process
	E.	Using the NodeJS module http-proxy and seaport





	Which of the following is output by executing the NodeJS code below? (NOTE: the position parameter of the read and readSync function is passed as null, and data will be read from the current file position.)

// file.txt contains 0123456789
var fs = require('fs');
fs.open('file.txt', 'r', function(err, fd){
    var asyncBuffer = new Buffer(5);
    fs.read(fd, asyncBuffer, 0, asyncBuffer.length, null, function (err, bytesRead, data) {
       if (err) {
           return console.error(err);
       }
       console.log('asynchronous file read (' + bytesRead + '): ' + asyncBuffer.toString('utf8', 0, bytesRead));
    });
    
    var syncBuffer = new Buffer(5);
    var bytesRead = fs.readSync(fd, syncBuffer, 0, syncBuffer.length, null);
    console.log('synchronous file read (' + bytesRead + '): ' + syncBuffer.toString('utf8', 0, bytesRead));
});
	A.	synchronous file read (5): 56789
asynchronous file read (5): 01234
 
	B.	synchronous file read (5): 01234
asynchronous file read (5): 56789
 
	C.	asynchronous file read (5): 56789
synchronous file read (5): 01234
 
	D.	asynchronous file read (5): 01234
synchronous file read (5): 01234
 
	E.	asynchronous file read (5): 01234
synchronous file read (5): 56789
 




A NodeJS developer writes a custom assertion regexEqual to match the expected regex to the actual value using the code snippet below. Which of the following are correct examples of using this assertion?

var assert = require('assert');
assert.regexEqual = function(actual, regex, message) {
    if (!actual.match(regex)) {
        assert.fail(actual, regex, message, 'regexEqual', assert.regexEqual);
    }
};
	A.	assert.regexEqual('{ name: "John Doe" }', '/John/', 'The name should contain John');
	B.	assert.regexEqual('{ name: "John Doe" }', 'john', 'The name should contain john');
	C.	assert.regexEqual('{ name: "John Doe" }', /john/, 'The name should contain john');
	D.	assert.regexEqual('{ name: "John Doe" }', 'John', 'The name should contain John');
	E.	assert.regexEqual('{ name: "John Doe" }', /John/, 'The name should contain John');





A NodeJS developer is writing a streaming console logger that extends from writable stream to log data to console. Which of the following is the correct output of executing the code below?

var Writable = require('stream').Writable;
function StreamingConsoleLogger(options) {
    Writable.call(this, options);    
}
require('util').inherits(StreamingConsoleLogger, Writable);
StreamingConsoleLogger.prototype._write = function (chunk) {
    console.log(this.level + ' : ' + chunk);
};
var infoLogger = new StreamingConsoleLogger({level: 'info'});
var errorLogger = new StreamingConsoleLogger({level: 'error'});

infoLogger.write('writing to the streaming console logger');
infoLogger.end();

errorLogger.write('error executing streaming console logger');
errorLogger.end();
	A.	G:\IKM\streaming_console_logger.js:7
        console.log(this.level + ' : ' + chunk);
                    ^

ReferenceError: level is not defined
    at StreamingConsoleLogger._write (G:\IKM\streaming_console_logger.js:7:14)
    at doWrite (_stream_writable.js:292:12)
    at writeOrBuffer (_stream_writable.js:278:5)
    at StreamingConsoleLogger.Writable.write (_stream_writable.js:207:11)
    at Object.<anonymous> (G:\IKM\streaming_console_logger.js:12:12)
    at Module._compile (module.js:425:26)
    at Object.Module._extensions..js (module.js:432:10)
    at Module.load (module.js:356:32)
    at Function.Module._load (module.js:311:12)
    at Function.Module.runMain (module.js:457:10)
 
	B.	error : error executing streaming console logger
info : writing to the streaming console logger
 
	C.	level : writing to the streaming console logger
level : error executing streaming console logger
 
	D.	info : writing to the streaming console logger
error : error executing streaming console logger
 
	E.	undefined : writing to the streaming console logger
undefined : error executing streaming console logger





Which of the following are valid calls to function test, given the JavaScript code snippet below? 

function test(a, b) { 
    return a+b; 
}
	A.	test.call(this, [2, 3]);
	B.	test.call(2, 3);
	C.	test.apply(this, [2, 3]);
	D.	test.call(this, 2, 3);
	E.	test.apply(this, 2, 3);






	When a low bandwidth client connects to a server and the server needs to do flow control on the stream, which of the following are valid NodeJS implementations? (NOTE: Assume that both client and server are inside a secured company network.)
	A.	Using pause/resume with the code below:
require('http').createServer( function(request, response) {
    var readable_stream = require('fs').createReadStream('data.json');
    readable_stream.on('data', function(data) {
        if (!response.write(data)) {
            console.log("pausing the stream");
            readable_stream.pause();
        }
    });
    response.on('drain', function() {
        console.log("resuming the stream");
        readable_stream.resume();
    });
    readable_stream.on('end', function() {        
        response.end();
    });
}).listen(8080);
 
	B.	Using pause/resume with the code below:
require('http').createServer( function(request, response) {
    var readable_stream = require('fs').createReadStream('data.json');
    readable_stream.on('data', function(data) {
        if (!response.write(data)) {
            console.log("pausing the stream");
            readable_stream.pause();
        }
    });
    readable_stream.on('drain', function() {
        console.log("resuming the stream");
        readable_stream.resume();
    });
    readable_stream.on('end', function() {        
        response.end();
    });
}).listen(8080);
 
	C.	Using pipe with the code below:
require('http').createServer(function(request, response) {
    var readable_stream = require('fs').createReadStream('data.json');
    readable_stream.pipe(response);
}).listen(8080);
 
	D.	Using pipe with the code below:
require('http').createServer(function(request, response) {
    var readable_stream = require('fs').createReadStream('data.json');
    response.pipe(readable_stream);
}).listen(8080);
 
	E.	Using pipe with the code below:
require('http').createServer(function(request, response) {
    var readable_stream = require('fs').createReadStream('data.json');
    response.pipe(request);
}).listen(8080);





Which of the following are valid locations of the NodeJS config file which npm will read?
	A.	$PROJECT/package.json
	B.	$HOME/.npmrc
	C.	$PROJECT/.npmrc
	D.	$PROJECT/node_modules/.npmrc
	E.	$PREFIX/etc/npmrc





Which of the following are valid methods of scaling the NodeJS application?
	A.	Load balancing using cloned worker instances that are created using cluster module
	B.	Hosting the application at datacenter in geographical location nearest to target users
	C.	Restricting the use of third party modules with NodeJS app
	D.	Decomposing application by functionality or service, as in microservices architecture
	E.	Using cloud infrastructure	





Which of the following can be substituted for the ***** in the NodeJS code below to result in an assertion error?

var assert = require('assert');
assert.timeout = function(actualPromise, timeout, message) {            
    return Promise.race([actualPromise, new Promise(function(resolve, reject){
        setTimeout(function(){
            reject(new assert.AssertionError({ message: message,                    
                actual: "Didn't complete in " + timeout + " ms",
                expected: "Should complete in " + timeout + " ms"
            }));        
        }, timeout);
    })]);
};   

assert.timeout(new Promise(function(resolve){
    *****
}), 1000, 'The function should return within 1000 ms.').catch(function(err) {
    setTimeout(function() { throw err; });
});
 
	A.	resolve("message");
 
	B.	setTimeout(function() { resolve("message"); });
 
	C.	setTimeout(function() { resolve("message"); }, 800);
 
	D.	setTimeout(function() { resolve("message"); }, 2000);
 
	E.	setTimeout(function() { resolve("message"); }, 1200);





Which of the following JavaScript coded snippets can take as input the three parameters shown below and then return "88" in a popup window? 

     Input parameter 1 = "(z + p)" 
     Input parameter 2 = "8" 
     Input parameter 3 = "8"
	A.	window.onload = window.onload = function()  { 
  var func = prompt("Enter function body in parenthesis"); 
  var z = prompt("Enter value of z"); 
  var p = prompt("Enter value of p"); 
  var func2 = func 
  var newFun = new Function("z", "p", func2); 
  var result = newFun(z, p); 
  alert(result); 
} 

 	B.	window.onload = function () { 
  var func = prompt("Enter function body in parenthesis"); 
  var z = prompt("Enter value of z"); 
  var p = prompt("Enter value of p"); 
  var func2 = "alert" + func; 
  var newFun = new Function("z", "p", func2); 
  var result = newFun(z, p); 
} 

 	C.	window.onload = function () { 
  var func = prompt("Enter function body in parenthesis"); 
  var a = prompt("Enter value of z"); 
  var b = prompt("Enter value of p"); 
  var func2 = "alert" + func; 
  var newFun = new Function("a", "b",func2); 
  var result = newFun(a, b); 
} 

 	D.	window.onload = function () { 
  var func = prompt("Enter function body in parenthesis"); 
  var z = prompt("Enter value of z"); 
  var p = prompt("Enter value of p"); 
  var func2 = func; 
  var newFun = new Function("z", "p", func2); 
  alert(newFun(z, p)); 
} 

 	E.	window.onload = function() { 
  var func = prompt("Enter function body in parenthesis"); 
  var z = prompt("Enter value of z"); 
  var p = prompt("Enter value of p"); 
  var func2 = "alert" + func; 
  var newFun = new Function(func2,"z", "p" ); 
  var result = newFun(z, p);} 





  A developer needs to create a JavaScript function to validate that the user has entered a valid email address in textbox txtemail prior to the form being submitted. Using the JavaScript runValidate() function and the HTML form shown below, which of the following statements are correct?

Function:
<script language="javascript" type="text/javascript" >
    function runValidate(form) {
      var strRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!strRegexp.test(form.txtemail.value)) {
            alert("Please enter a valid email address, eg. name@mycompany.com");
            return (false);
            form. txtemail.focus();
        }
        else {
        return (true);
        }
    }
</script>

Form:
<body>
<form name="Validate" action="Default.html">
     Enter your name :  <input type="text" name ="txtName" size="20"/> <br />
     Enter your e-mail address : <input type = "text" name="txtemail" size="20"/> <br />
     Re-Enter your e-mail address : <input type = "text" name="txtemail2" size="20"/> <br />
     <input type="button" name="Validate" value="Validate" onClick="runValidate (form)"/>
</form>
</body>
</html>
	A.	The user must enter the same value in textboxes txtemail and txtemail2 for frmValidate to be submitted.
	B.	If an invalid email is entered, the user will be notified by an alert popup and the input field txtemail will be cleared.
	C.	The domain extension for the email address must be two or three characters in length for frmValidate to be submitted.
	D.	The Validate button will function the same if the onClick command is changed to onClick="runValidate (this.form)".
	E.	If the Validate function fails, txtemail will receive the focus.





	When querying large data sets using streaming API of the NodeJS mysql module, which of the following can be correctly substituted for ***** in the code below for handling the event emitted on receiving each data row?

query.on('*****', function(arg1) {
    console.log('Received row: ' + JSON.stringify(arg1));    
});
	A.	received
	B.	result
	C.	readable
	D.	columns
	E.	data





A developer is implementing basic authentication for the web application using the Connect middleware in NodeJS. The mock function to authenticate provided below allows the user admin with password admin to authenticate successfully.

function authenticate(request, response, next) {
    function sendUnauthorized(){
        response.writeHead(401 , {'WWW-Authenticate': 'Basic'});
        response.end();
    }
    var authorizeHeader = request.headers.authorization;
    if (!authorizeHeader){ sendUnauthorized(); }        
    else{
        var authorizeParams = new Buffer(authorizeHeader.split(' ')[1], 'base64').toString().split(':');
        var username = authorizeParams[0];
        var password = authorizeParams[1];
        if (username === 'admin' && password === 'admin') {
            next(); // authenticated
        }
        else { sendUnauthorized(); }
    }
}

Which of the following are valid ways to use the authenticate function as middleware with Connect?
	A.	var connect = require('connect');
var server = connect()
    .listen(function (request, response) { response.end('Authenticated!'); })
    .listen(authenticate)    
    .listen(3000);
 
	B.	var connect = require('connect');
var server = connect()
    .use(authenticate)
    .use(function (request, response) { response.end('Authenticated!'); })
    .listen(3000);
 
	C.	var connect = require('connect');
var server = connect()
    .use(function (request, response) { response.end('Authenticated!'); })
    .use(authenticate)    
    .listen(3000);
 
	D.	var connect = require('connect');
var server = connect()
    .using(authenticate)
    .using(function (request, response) { response.end('Authenticated!'); })
    .listen(3000);
 
	E.	var connect = require('connect');
var server = connect()
    .listen(authenticate)
    .listen(function (request, response) { response.end('Authenticated!'); })    
    .listen(3000);
 



	