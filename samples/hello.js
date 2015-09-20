var app = angular.module('app', []);

/**
 * <div ng-controller="OverlayCtrl" class="overlay" ng-click="hideOverlay()">
 *  <img src="http://some_src" ng-click="nextImage()" stop-event="click"/>
 * </div>
 */
app.directive('stopEvent', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if(attr && attr.stopEvent)
                element.bind(attr.stopEvent, function (e) {
                    e.stopPropagation();
                });
        }
    };
});

/**
 * Name: <input type="text" focus-me="shouldBeOpen">
 */
app.directive('focusMe', function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
                console.log('value=',value);
                if(value === true) {
                    $timeout(function() {
                        element[0].focus();
                    });
                }
            });
            // to address @blesh's comment, set attribute value to 'false'
            // on blur event:
            element.bind('blur', function() {
                console.log('blur');
                scope.$apply(model.assign(scope, false));
            });
        }
    };
});
/**
 * <button ng-click="isVisible = !isVisible">Toggle input</button>
 * <input ng-show="isVisible" auto-focus="{{ isVisible }}" value="auto-focus on" />
 */
app.directive('autoFocus', function($timeout) {
   return {
       link: function (scope, element, attrs) {
           attrs.$observe($parse(attrs.autofocus), function(newValue){
               if (newValue === "true")
                   $timeout(function(){element.focus()});
           });
       }
   }
});

app.directive('itemFocus', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, controller) {
            controller.$focused = false;
            element.bind('focus', function (e) {
                scope.$apply(function () {
                    controller.$focused = true;
                });
            }).bind('blur', function (e) {
                scope.$apply(function () {
                    controller.$focused = false;
                });
            })
        }
    }
})