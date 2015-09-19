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