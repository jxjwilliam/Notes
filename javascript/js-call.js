function MyObject(name, message) {
    this.name = name.toString();
    this.message = message.toString();
}

(function () {
    this.getName = function () {
        return this.name;
    };
    this.getMessage = function () {
        return this.message;
    };
}).call(MyObject.prototype);

var mo = new MyObject('william', 'queue, stack and heap');
document.writeln(mo.getName());
document.writeln(mo.getMessage());

///////////////////////

// Shape - superclass
function Shape() {
    this.x = 0;
    this.y = 0;
}

// superclass method
Shape.prototype.move = function (x, y) {
    this.x += x;
    this.y += y;
    document.writeln('Shape moved.');
};

// Rectangle - subclass
function Rectangle() {
    Shape.call(this); // call super constructor.
}

// subclass extends superclass
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle();

document.writeln('Is rect an instance of Rectangle? ' + (rect instanceof Rectangle)); // true
document.writeln('Is rect an instance of Shape? ' + (rect instanceof Shape)); // true
rect.move(1, 1); // Outputs, 'Shape moved.'

(function($, ng) {
    'use strict';

    var $val = $.fn.val; // save original jQuery function

    // override jQuery function
    $.fn.val = function (value) {
        // if getter, just return original
        if (!arguments.length) {
            return $val.call(this);
        }

        // get result of original function
        var result = $val.call(this, value);

        // trigger angular input (this[0] is the DOM object)
        ng.element(this[0]).triggerHandler('input');

        // return the original result
        return result;
    }
})(window.jQuery, window.angular);


///////////////

 //1. constructor:
function CarMaker() {}

//2. Factory Items Iteration:
CarMaker.Compact = function(){};
CarMaker.Convertible = function(){};
CarMaker.SUV = function() {};

//3. public methods:
CarMaker.prototype.tool = function() {};
CarMaker.prototype.drive = function() {};

//4. Static methods:
CarMaker.factory = function(type) {
  var constr = type;
  
  if(typeof CarMaker[constr] !== 'function') {
     throw {
       name: "Error",
       message: constr + 'not exist'
     };
  }
  //inheritance only once
  if(typeof CarMaker[constr].prototype.tool !== 'function') {
    CarMaker[constr].prototype = new CarMaker();
  }
  
  return new CarMaker[constr]();
} 

//5. Usage:
var camry = CarMaker.factory('Convertible');
var cherokee = CarMaker.factory('SUV');
camry.tool();
cherokee.drive();