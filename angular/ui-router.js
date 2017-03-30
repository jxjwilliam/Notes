//http://stackoverflow.com/questions/21714655/angular-js-angular-ui-router-reloading-current-state-refresh-data

angular.module('app')

.config(function($provide) {
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
});

//Now, whenever you need to reload, simply call:

$state.forceReload();