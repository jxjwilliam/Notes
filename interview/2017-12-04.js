//<script src="" defer></script>
//<script src="" async></script>

//There are three possible modes that can be selected using these attributes. If the async attribute is present, then the script will be executed asynchronously, as soon as it is available. If the async attribute is not present but the defer attribute is present, then the script is executed when the page has finished parsing. If neither attribute is present, then the script is fetched and executed immediately, before the user agent continues parsing the page.


Function.prototype.bind = function(){ 
  var fn = this, args = [].slice.call(arguments),
    object = args.shift();
  return function(){ 
    return fn.apply(object, 
      args.concat([].slice.call(arguments))); 
  }; 
};

function tryMe() {	
    var args = [].slice.call(arguments)
    alert (args.join(','));
}

function callbackTester(callback) {
    callback ();
}



//> removeDupChars('Learn more javascript dude');
//  = "Lnmojvsciptu"

function removeDupChars(str) {
    var ary=[];
    for (var i=0; i < str.length; i++) {
      if (str.indexOf(str[i]) === str.lastIndexOf(str[i])) {
         ary.push(str[i]);
      }
    }
    return ary.join('');    
}    
removeDupChars('Learn more javascript dude');

// function reverseWords(str)

//> reverseInPlace('I am the good boy');
//= "I ma eht doog yob"

function reverseInPlace(str) {
  return str.split(' ').map(function(s) {  
    return s.split('').reverse().join('');
  }).join(' ');
}
reverseInPlace('I am the good boy');

