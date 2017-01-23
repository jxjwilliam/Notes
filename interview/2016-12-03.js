
1 == '1' // TRUE
1 === '1' //false
null == undefined; //true
null === undefined; //false
false == '0'       // true

false == undefined // false
false == null      // false
null == undefined  // true


try {
	obj.property = 'aaa'
} catch (e) {
	console.log('try eror');
} // 'try error'

try{ 
	throw new Error('kkk'); //or: throw 'kkk'
}
catch(e) { 
	console.log('try error'); 
} // 'try error'


var pobj = {
  getName: function() {
     return this.name;
  }
}
function MyFunc(name) {
  this.name = name;
}
MyFunc.prototype = pobj;
var myfunc = new MyFunc('william')
myfunc.getName(); //"william"

function duplicate(ary) {
  return ary.concat(ary);
};
duplicate([1,2,3,4,5]); //[1, 2, 3, 4, 5, 1, 2, 3, 4, 5]

Array.prototype.duplicator = function() {
	return this.concat(this);
}
[1,2,3,4,5].duplicator(); // [1,2,3,4,5,1,2,3,4,5]


// empty an array
var arrayList = [ .... ];
arrayList = [];
arrayList.length = 0;
arrayList.splice(0, arrayList.length);

while(arrayList.length) {
	arrayList.pop();	
}



////////////////////////////////

Function.prototype.curry = function() {
    if (arguments.length<1) {
        return this; //nothing to curry. return function
    }
    var self = this;
    var args = toArray(arguments);
    return function() {
        return self.apply(this, args.concat(toArray(arguments)));
    }
}

function toArray(args) {
    return Array.prototype.slice.call(args);
}

var converter = function(factor, symbol, input){
  return input * factor + symbol;
}

var mileToKm = converter.curry(1.62, 'km');
mileToKm(3); // 4.82km

var kgToLb = converter.curry(2.2, 'lb');
kgToLb(3); // 6.6lb 


/////////////////////////////////
function aaa(cb, param1) {
  var a=1, b=2;
  cb(param1, a, b);
}

function callback(p1, p2, p3) {
  console.log('1', p1);
  console.log('2', p2);
  console.log('3', p3);
}

aaa(callback, 100);
1 100
2 1
3 2


/////////////////////
var hero = {
    _name: 'John Doe',
    getSecretIdentity: function (){
        return this._name;
    }
};

//console.log(stoleSecretIdentity());
var stoleSecretIdentity = hero.getSecretIdentity.bind(hero);
or:
var stoleSecretIdentity = hero.getSecretIdentity;
stoleSecretIdentity.call(hero);


////////////
for (var i = 0; i < 5; i++) {
	(function(x) {
    	setTimeout(function() { console.log(x); }, x * 1000 );
    })(i);
}
for (var i = 0; i < counter.length; i++) {
  setTimeout((function() { console.log(i); })(i), i );
}
function aaa(i) {
  console.log(i);
}
for (var i = 0; i < 5; i++) {
  setTimeout(aaa(i), i * 1000 );
}
for (var i = 0; i < 5; i++) {
  setTimeout(function() { console.log(i); }.call(i), i * 1000 );
}


/////////////
var fullname = 'John Doe';
var obj = {
   fullname: 'Colin Ihrig',
   prop: {
      fullname: 'Aurelio De Rosa',
      getFullname: function() {
         return this.fullname;
      }
   }
};

console.log(obj.prop.getFullname());

var test = obj.prop.getFullname;

console.log(test());

//////////////
var funcs = {};
for (var i = 0; i < 3; i++) {
    funcs[i] = function(x) {
        console.log('My value: ' + x);
    }.bind(this, i);
}
for (var j = 0; j < 3; j++) {
    funcs[j]();
}


/////////////////////
/// Hide cells:
var len = $('div.pane').length
// len: 72
var i=0; var clearIds = setInterval(function() {
  if(i<len) {
    $($('div.pane')[i++]).fadeOut(100);
    console.log(i + ' is fadeOut.');
  }
  else {
   clearInterval(clearIds);
  }
}, 200);
