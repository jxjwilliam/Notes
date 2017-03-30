/**
 * <div ng-controller="myCtrl" your-api-spinner> ... </div>
 * http://stackoverflow.com/questions/15033195/showing-spinner-gif-during-http-request-in-angular
 */
(function (NG) {
    var loaderTemplate = '<div class="ui active dimmer" data-ng-show="hasSpinner()"><div class="ui large loader"></div></div>';
    /**
     * Show/Hide spinner with ajax
     */
    function spinnerDirective($compile, api) {
        return {
            restrict: 'EA',
            link: function (scope, element) {
                // listen for api trigger
                scope.hasSpinner = api.isOn;

                // attach spinner html
                var spin = NG.element(loaderTemplate);
                $compile(spin)(scope); // bind+parse
                element.append(spin);
            }
        }
    }
    NG.module('yourModule')
        .directive('yourApiSpinner', ['$compile', 'yourApi', spinnerDirective]);
})(angular);

/**
 * angular-loading-spinner
 * <span us-spinner="{radius:30, width:8, length: 16}"></span>
 */
(function(){
    angular.module('ngLoadingSpinner', ['angularSpinner'])
        .directive('usSpinner',   ['$http', '$rootScope' ,function ($http, $rootScope){
            return {
                link: function (scope, elm, attrs)
                {
                    $rootScope.spinnerActive = false;
                    scope.isLoading = function () {
                        return $http.pendingRequests.length > 0;
                    };

                    scope.$watch(scope.isLoading, function (loading)
                    {
                        $rootScope.spinnerActive = loading;
                        if(loading){
                            elm.removeClass('ng-hide');
                        }else{
                            elm.addClass('ng-hide');
                        }
                    });
                }
            };

        }]);
}).call(this);

/**
 * 3.http://ericpanorel.net/2013/08/31/angularjs-button-directive-with-busy-indicator/
 * <i class="fa fa-refresh fa-spin">
 * <button type="submit" data-indi-click="vm.getComments()">Get Comments</button>
 *
 *
 */
(function (Spinner) {
    'use strict';
    var directiveId = 'indiClick';
    app.directive(directiveId, ['$parse', function ($parse) {
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;
        function link(scope, element, attr) {
            var fn = $parse(attr[directiveId]), // "compile" the bound expression to our directive
                target = element[0],
                height = element.height(),
                oldWidth = element.width(),
                opts = {
                    length: Math.round(height / 3),
                    radius: Math.round(height / 5),
                    width: Math.round(height / 10),
                    color: element.css("color"),
                    left: -5
                }; // customize this "resizing and coloring" algorithm

            // implement our click handler
            element.on('click', function (event) {
                scope.$apply(function () {
                    attr.$set('disabled', true);
                    element.width(oldWidth + oldWidth / 2); // make room for spinner

                    var spinner = new Spinner(opts).spin(target);
                    // expects a promise
                    // http://docs.angularjs.org/api/ng.$q
                    fn(scope, { $event: event })
                        .then(function (res) {
                            element.width(oldWidth); // restore size
                            attr.$set('disabled', false);
                            spinner.stop();
                            return res;
                        }, function (res) {
                            element.width(oldWidth); // restore size
                            attr.$set('disabled', false);
                            spinner.stop();
                        });
                });
            });
        }
    }]);
})(Spinner);