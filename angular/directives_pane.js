//http://stackoverflow.com/questions/17005122/extending-angular-directive
app.config(function($provide) {

    $provide.decorator('paneDirective', function($delegate) {

        var directive = $delegate[0];
        angular.extend(directive.scope, {
            disabled: '@',
            heading:'@'
        });
        return $delegate;
    });
});

// priority, emitter
angular.module('test').directive('dynamicName', ["$parse", function($parse) {
    return {
        restrict: 'A',
        priority: 10000,
        controller : ["$scope", "$element", "$attrs",
            function($scope, $element, $attrs){
                var name = $parse($attrs.dynamicName)($scope);
                delete($attrs['dynamicName']);
                $element.removeAttr('data-dynamic-name');
                $element.removeAttr('dynamic-name');
                $attrs.$set("name", name);
            }]

    };
}]);