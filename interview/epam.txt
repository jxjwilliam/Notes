// http://jsbin.com/qunigupina/edit?js,console

//Find bug in the code:
var items = [1, 5, 'a', {b: "c"}, 555];
function processItem1(item) {
    console.log('started processing', item);
    setTimeout(function() {
        console.log('finished processing', item);
    }, Math.floor(Math.random() * 3000));
}

function processItem(item, i) {
    //console.log('started processing', item, i);  
    var tm
    for (var j=items.length; j>i; j--) {
        tm = 
    }
    setTimeout(function() {
        console.log('finished processing', item);
        
    }, Math.floor(Math.random() * 3000) );
}

console.log('started processing items');
items.forEach(processItem);
console.log('finished processing items');


////////////////////////////////////////////
// Fix popup code, so when close it there is no redirection
// Should have this layout:
<a class=“popup” href=“http://….”>
  <span class=“close-button”>X</span>
</a>


a.onClick = function(e) {
  e.preventDefault();
  //add logic;
  return false;
}


////////////////////////////////////////////
// Write function to validate credit card number “38xx xxxx xxxx xxxx”

function validate(card) {
  return /^38\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?/.test(card);
}

console.log(validate('3812 3456 789w0000'));

////////////////////////////////////////////

//Implement multiply function so it produces corresponding output:


multiply = function() {
  var arg = [].slice.call(arguments);
  var res = arg[0];
  
  return function mul() {
    res =  res * ([].slice.call(arguments)[0]);
    mul.toString = function() {
      return res.toString();
    }
    return mul;
  }
};


console.log(multiply(1)(10)); // 10
console.log(multiply(10)(5)(2)); // 100
console.log(multiply(10)(5)(2)(6)); // 600