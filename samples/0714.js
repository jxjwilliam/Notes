/**
 To avoid the "flash of uncompiled content", use ng-bind or ng-cloak:

 <span ng-cloak ng-show="show">Hello, {{name}}!</span>
 */

/** ng-repeat
 * http://stackoverflow.com/questions/12977894/what-is-the-angularjs-way-to-databind-many-inputs/13782671#13782671
 each child scope still gets a new "item" property, but because list is now an array of objects, childScope[valueIdent] = value;
 results in the item property's value being set to a reference to one of the array objects (not a copy).
 */


/** factory, service, provider, invoke, instantiate
 */

function factory1() {
    return {
        str: 'str',
        fn: 'fn'
    }
}

function factory2() {
    return function (curry) {
        this.curry = curry;
        this.prop = 'prop';
        this.func = function () {
            console.log('func');
        }
    }
}

function service() {
    this.prop = 'prop';
    this.func = function () {
        console.log('func');
    }
}
