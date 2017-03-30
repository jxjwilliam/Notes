angular.module('app', [])
.directive('inputFocus', ['$interval', function ($interval) {
    return {
        restrict: 'A',
        link: function (scope, element) {

            var stop = $interval(function () {
                if (element.length) {
                    element[0].focus();
                    $interval.cancel(stop);
                    stop = undefined;
                }
            }, 500);
        }
    }
}]);