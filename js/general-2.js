//1. rewrite constructor function in a closure:
var Singleton = (function() {
  var instance;  
  Singleton = function Singleton() {
    if(instance) {
      return instance;
    }

    instance = this;
  
    this.start_time = 0;
    this.others = "others";
  };  
}());

// more directly:
function Singleton() {
  var instance = this;
  
  this.start_time = 0;
  this.others = "others";
  
  Singleton = function() {
    return instance;
  };
  
}

//2. pretty cool: use static attribute of constructor:
function Singleton() {
  if(typeof Singleton.instance === 'object') {
    return Singleton.instance;
  }
  
  this.start_time = 0;
  this.others = "others";

  Singleton.instance = this;
}

function Singleton() {
  var o;
  //rewrite constructor,
  //so next time directly return Singleton instance.
  Singleton = function Singleton() {
    return o;
  }
  
  // for dynamic prototype mode
  Singleton.prototype = this;
  
  // o.__proto__=Singleton
  o = new Singleton();
  // 
  o.constructor = Singleton;
  this.start_time = 0;
  this.others = "others";

  return o;  //not return this!
}


//Parasitic + Combination Inheritance
// reference:
function object(o) {
  function F(){}
  F.prototype = o;
  return new F();
}
// deal with prototype:
function inheritPrototype(child, parent) {
  function F() {}
  F.prototype = parent.prototype;
  var p = new F();
  p.constructor = child;
  child.prototype = p;
}

function Super(args) {
 //this attrs and methods
}
Super.prototype.say1 = function() {
  //process args...
}

function Sub(args, more_args) {
  //inherit Super
  //2.
  Super.call(this, args);
  this.more_arges = more_args;
}
//1.
inheritPrototype(Sub, Super);

Sub.prototype.say2 = function() {
  // process more_args;
}



//a typical JS closure: nextId()
var nextId=(function() {
  var counter = 1;
  return function() {
    return counter ++;
  };
}());



//1.Very Basicly ineritance - Copy:
function inheritCopy(C, P) {
  C.prototype = new P();
}
// function Parent(){}; function Child(){};
// inheritCopy(Child, Parent); 
//Child's prototype is an instance invocation of Parent.


// select2.js, using jQuery.extend(), multi-inheritance:
function clazz(Parent, methods) {
    var F = function () {};
    F.prototype = new Parent;
    F.prototype.constructor = F;
    F.prototype.parent = Parent.prototype;
    F.prototype = $.extend(F.prototype, methods);
    return F;
}
// var AbstractSelect2 = clazz(Object, {...});
// var SingleSelect2 = clazz(AbstractSelect2, {...});
// var MultiSelect2 = clazz(AbstractSelect2, {...});

function Parent() {};
function Child(){};
Child.prototype = Parent.prototype; //reference
var c = new Child(); //get all constructors' prototype.

// sub-constructor inherit
function extend(Child, Parent) {
  var F = function() {};
  F.prototype = Parent.prototype;
  Child.prototype = new F();
  Child.prototype.constructor = Child;
  Child.uber = Parent.prototype;
}
// function Shape() {}; function TwoDShape() {};
// extend(TwoDShape, Shape);

function objectMixAttrs(o, attrs) {
  var n = null;
  function F() {};
  F.prototype = o;
  n = new F();
  n.uber = o;
  
  for(var i in attrs) {
    n[i] = attrs[i];
  }
  return n;
}
// var fastFood = objectMixAttrs(food, { fast_hash });

function deepCopy(p, c) {
  var c = c || {};
  for (var i in p) {
    if(typeof p[i] === 'object') { // Array or Hash?
      c[i] = (p[i].constructor === Array) ? [] : {};
      deepCopy(p[i], c[i]);
    }
    else {
      c[i] = p[i];
    }
  }
  return c;
}
// var parent={...}; var deep = deepCopy(p);