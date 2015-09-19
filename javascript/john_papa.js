// IIFE, $inject, name function

(function() {
	
	angular
		.module('william')
		.controller('/name/space/dashboard/dashboard.ctrl',
					dashboardCtrl );

	
	dashboardCtrl.$inject = [
		'$scope',
		'name/space/rest/resource/promise.src'
	];

	function dashboardCtrl ($scope, promiseSrc) {
		$scope.list = [];

		init();

		function init() {
			promiseSrc.load().then(function success(data) {
				$scope.list = data;
			});
		}
	}

})();