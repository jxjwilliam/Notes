/**
 * @ngdoc module
 * @name ngDirective
 * @description
 *
 * <div directive></div>
 *
 * See {@link ui-bootstrap.js `$cookies`} for usage.
 */

var app = angular.module('app', []);

app.directive('collapse', ['$animate', function($animate) {
    return {
        link: function(scope, element, attr) {
            scope.$watch(attrs.collapse, function (shouldCollapse) {});
        }
    }
}]);

app.directive('accordion', function() {
    return {
        restrict: 'EA',
        controller: 'AccordionController',
        transclude: true,
        replace: false,
        templateUrl: 'template/accordion/accordion.html'
    }
}).directive('accordionGroup', function() {
    return {
        require: '^accordion',
        restrict: 'EA',
        transclude: true,
        replace: true,
        templateUrl: 'template/accordion/accordion-group.html',
        scope: {
            heading: '@',
            isOpen: '=?',
            isDisabled: '=?'
        },
        controller: function() {},
        link: function(scope, element, attrs, accordionCtrl) {
            scope.$watch('isOpen', function(value) {});
        }
    }
}).directive('accordingHeading', function() {
    return {
        restrict: 'EA',
        transclude: true,
        template: '', // In effect remove this element!
        replace: true,
        require: '^accordionGroup',
        link: function(scope, element, attr, accordionGroupCtrl, transclude) {}
    }
}).directive('accordionTransclude', function() {
    return {
        require: '^accordionGroup',
        link: function(scope, element, attr, controller) {}
    }
});


app.directive('alert', function() {
    return {
        restrict: 'EA',
        controller: 'AlertController',
        templateUrl: 'template/alert/alert.html',
        transclude: true,
        replace: true,
        scope: {
            type: '@',
            close: '&'
        }
    }
}).directive('dismissOnTimeout', ['$timeout', function($timeout) {
    return {
        require: 'alert',
        link: function(scope, element, attrs, alertCtrl) {
            scope.$on('$destroy', function() {});
            scope.$watch('active', function() {})
        }
    }
}]);


/**
 * @ngdoc directive
 * @name ui.bootstrap.tabs.directive:tabset
 * @restrict EA
 *
 * @description
 * Tabset is the outer container for the tabs directive
 *
 * @param {boolean=} vertical Whether or not to use vertical styling for the tabs.
 * @param {boolean=} justified Whether or not to use justified styling for the tabs.
 *
 * @example
 <example module="ui.bootstrap">
 <file name="index.html">
 <tabset>
 <tab heading="Tab 1"><b>First</b> Content!</tab>
 <tab heading="Tab 2"><i>Second</i> Content!</tab>
 </tabset>
 <hr />
 <tabset vertical="true">
 <tab heading="Vertical Tab 1"><b>First</b> Vertical Content!</tab>
 <tab heading="Vertical Tab 2"><i>Second</i> Vertical Content!</tab>
 </tabset>
 <tabset justified="true">
 <tab heading="Justified Tab 1"><b>First</b> Justified Content!</tab>
 <tab heading="Justified Tab 2"><i>Second</i> Justified Content!</tab>
 </tabset>
 </file>
 </example>
 */
app.directive('tabset', function() {
    return {
        restrict: 'EA',
        transclude: true,
        replace: true,
        scope: {
            type: '@'
        },
        controller: 'TabsetController',
        templateUrl: 'template/tabs/tabset.html',
        link: function(scope, element, attrs) {
            scope.vertical = angular.isDefined(attrs.vertical) ? scope.$parent.$eval(attrs.vertical) : false;
            scope.justified = angular.isDefined(attrs.justified) ? scope.$parent.$eval(attrs.justified) : false;
        }
    };
})
    .directive('tab', ['$parse', '$log', function($parse, $log) {
        return {
            require: '^tabset',
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/tabs/tab.html',
            transclude: true,
            scope: {
                active: '=?',
                heading: '@',
                onSelect: '&select', //This callback is called in contentHeadingTransclude
                //once it inserts the tab's content into the dom
                onDeselect: '&deselect'
            },
            controller: function() {
                //Empty controller so other directives can require being 'under' a tab
            },
            compile: function(elm, attrs, transclude) {
                return function postLink(scope, elm, attrs, tabsetCtrl) {
                    scope.$watch('active', function(active) {
                        if (active) {
                            tabsetCtrl.select(scope);
                        }
                    });

                    scope.disabled = false;
                    if ( attrs.disable ) {
                        scope.$parent.$watch($parse(attrs.disable), function(value) {
                            scope.disabled = !! value;
                        });
                    }

                    // Deprecation support of "disabled" parameter
                    // fix(tab): IE9 disabled attr renders grey text on enabled tab #2677
                    // This code is duplicated from the lines above to make it easy to remove once
                    // the feature has been completely deprecated
                    if ( attrs.disabled ) {
                        $log.warn('Use of "disabled" attribute has been deprecated, please use "disable"');
                        scope.$parent.$watch($parse(attrs.disabled), function(value) {
                            scope.disabled = !! value;
                        });
                    }

                    scope.select = function() {
                        if ( !scope.disabled ) {
                            scope.active = true;
                        }
                    };

                    tabsetCtrl.addTab(scope);
                    scope.$on('$destroy', function() {
                        tabsetCtrl.removeTab(scope);
                    });

                    //We need to transclude later, once the content container is ready.
                    //when this link happens, we're inside a tab heading.
                    scope.$transcludeFn = transclude;
                };
            }
        };
    }])





