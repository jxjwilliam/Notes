(function () {
    app.controller(‘ThingController’, [‘$scope’, function ($scope) {
        // models
        angular.extend($scope, {
            thingOne: ‘one’,
            thingTwo: ‘two’
        });

        // methods
        angular.extend($scope, {
            // in HTML template, something like {{ getThings() }}
            getThings: function () {
                return $scope.thingOne + ‘‘ + $scope.thingTwo;
            }
        });
    }]);
}());
