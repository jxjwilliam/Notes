var app = angular.module('bootstrap', []);

app.directive('accordion', function() {
	return {
		restrict: 'E',
		controller: 'AccordionCtrl',
		controllerAs: 'accordion',
		transclude: true,
		replace: false,
		templateUrl: function(element, attrs) {
			return attrs.templateUrl || 'template/accordion/accordion.html'
		}
	};
});

app.directive('accordionGroup', function() {
	return {
		require: '^accordion',
		restrict: 'E',
		transclude: true,
		replace: true,
		templateUrl: function(element, attrs) {
			return attrs.templateUrl || ''
		},
		scope: {
			heading: '@',
			isOpen: '=?',
			isDisabled: '=?'
		},
		controller: function() {

		},
		link: function(scope, element, attrs, accordionCtrl) {

		}
	};
});