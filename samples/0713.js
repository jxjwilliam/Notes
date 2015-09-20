/**
 * If you are using a jQuery plugin, do not put the code in the controller.
 * Instead create a directive and put the code that you would normally have inside the link function of the directive.
 */
app.directive('directiveName', function () {
    return {
        restrict: 'A',
        link: function (scrope, element, attrs) {
            angular.element(element).pluginActivationFunction(scope.$eval(attrs.directiveName));
        }
    }
});


/**
 * <h4>How to access cookies in AngularJS?</h4>
 */
angular.module('app', ['ngCookie'])
    .controller(function ($scope, $cookies) {
    });


/**
 <h4>How can I test an an AngularJS service from the console?</h4>
 */
angular.element(document.body).injector().get('serviceName');
angular.element(document).injector().get('serviceName')
angular.element($0).scope();
angular.element('*[ng-app]').injector();


var $injector = angular.injector(['app']);
var service = $injector.get('ExampleService');
service.test('parameter');
service.inject = ['$location', '$timeout'];


app.factory('ExampleService', function () {
    return function () {
        this.f1 = function (world) {
            return 'Hello' + world;
        }
    };
});
// This returns an ExampleService constructor which you will next have to do a 'new' on.
// Or alternatively,
app.service('ExampleService', function () {
    this.f1 = function (world) {
        return 'Hello' + world;
    };
});
//This returns new ExampleService() on injection.


/**
 <h4>ng-repeat :filter by single field</h4>

 Search by color: <input type="text" ng-model="search.color">
 <div ng-repeat="product in products | filter:search">
 <div ng-repeat="thing in things | filter: { properties: { title: title_filter, id: id_filter } }">
 */


/**
 <h4>Submit form on pressing Enter with AngularJS</h4>
 http://stackoverflow.com/questions/15417125/submit-form-on-pressing-enter-with-angularjs

 <input ng-keyup="$event.keycode===13 && myFunc()" .../>
 */

//<input key-bind="{ enter: 'go()', esc: 'clear()' }" type="text"></input>
myModule
    .constant('keyCodes', {
        esc: 27,
        space: 32,
        enter: 13,
        tab: 9,
        backspace: 8,
        shift: 16,
        ctrl: 17,
        alt: 18,
        capslock: 20,
        numlock: 144
    })
    .directive('keyBind', ['keyCodes', function (keyCodes) {
        function map(obj) {
            var mapped = {};
            for (var key in obj) {
                var action = obj[key];
                if (keyCodes.hasOwnProperty(key)) {
                    mapped[keyCodes[key]] = action;
                }
            }
            return mapped;
        }

        return function (scope, element, attrs) {
            var bindings = map(scope.$eval(attrs.keyBind));
            element.bind("keydown keypress", function (event) {
                if (bindings.hasOwnProperty(event.which)) {
                    scope.$apply(function () {
                        scope.$eval(bindings[event.which]);
                    });
                }
            });
        };
    }]);

//<input type="text" ng-enter="doSomething()">
angular.module('app').directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    }
});


/**
 <h4>What is the difference between required and ng-required?</h4>

 <input required> and <input ng-required="true"> are essentially the same thing
 */


/**
 * angular bower module
 * https://github.com/mgcrea/angular-strap/blob/master/src/navbar/navbar.js
 */
(function () {
    'use strict';
    angular.module('william.navbar', [])
        .provider('$navbar', function () {
            this.$get = function () {
                return {};
            }
        })
        .directive('bsNavbar', function ($window, $location, $navbar) {
            return {
                restrict: 'A',
                link: function postLink(scope, element, attr, controller) {
                    scope.$watch(function () {
                        return $location.path();
                    }, function (newV, oldV) {

                    })
                }
            }
        });
}());

/**
 * <h4>AngularJS - Create a directive that uses ng-model</h4>
 *
 You only need ng-model when you need to access the model's $viewValue or $modelValue.
 See NgModelController. And in that case, you would use require: '^ngModel'.
 */


/**
 * $parse, $scope.$eval
 */
app.directive('myDirective', function( $parse, $log ) {
    return function( scope, el, attrs ) {
        // parse the "my-attr" attribute value into a function
        var model = $parse( attrs.myAttr );
        // "model" is now a function which can be invoked to get the expression's value;
        // the following line logs the value of obj.name on scope:
        $log.log( model(scope) );

        el.bind('click', function() {
            // "model.assign" is also a function; it can be invoked to
            // update the expresssion value
            model.assign(scope, "New name");
            scope.$apply();
        })
    }
});