/**
 * http://stackoverflow.com/questions/22841225/ngmodel-formatters-and-parsers
 <form name="myForm" ng-submit="doSomething()">
  <input type="text" name="fruitName" ng-model="data.fruitName" blacklist="coconuts,bananas,pears" required/>
  <span ng-show="myForm.fruitName.$error.blacklist">The phrase "{{data.fruitName}}" is blacklisted</span>
  <span ng-show="myForm.fruitName.$error.required">required</span>
  <button type="submit" ng-disabled="myForm.$invalid">Submit</button>
 </form>
 */
app.directive('blacklist', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attr, ngModel) {
            var blacklist = attr.blacklist.split(',');

            //For DOM -> model validation
            ngModel.$parsers.unshift(function (value) {
                var valid = blacklist.indexOf(value) === -1;
                ngModel.$setValidity('blacklist', valid);
                return valid ? value : undefined;
            });

            //For model -> DOM validation
            ngModel.$formatters.unshift(function (value) {
                ngModel.$setValidity('blacklist', blacklist.indexOf(value) === -1);
                return value;
            });
        }
    };
});

/**
 * use ngMessages
 * http://plnkr.co/edit/ucbkRcZxaSvWSLBC5v2z?p=preview
 <form name="personForm">
  <input type="email" name="email" ng-model="person.email" required/>
  <div ng-messages="personForm.email.$error">
    <div ng-message="required">required</div>
    <div ng-message="email">invalid email</div>
  </div>
 </form>
 */
var app = angular.module('myApp', ['ngMessages']);

/**
 <form novalidate="">
 <input type="text" id="name" name="name" ng-model="newPerson.name"
 ensure-expression="(persons | filter:{name: newPerson.name}:true).length !== 1">
 <!-- or in your case:-->
 <input type="text" id="fruitName" name="fruitName" ng-model="data.fruitName"
 ensure-expression="(blacklist | filter:{fruitName: data.fruitName}:true).length !== 1">
 </form>
 */
app.directive('ensureExpression', ['$http', '$parse', function($http, $parse) {
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, ngModelController) {
            scope.$watch(attrs.ngModel, function(value) {
                var booleanResult = $parse(attrs.ensureExpression)(scope);
                ngModelController.$setValidity('expression', booleanResult);
            });
        }
    };
}]);