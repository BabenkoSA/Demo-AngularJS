module.exports = function(modal) {
	return modal({
		controller: function($scope, overlappedAlert, $rootScope, $transitions, body, title) {

			$rootScope.body = body;
            
            $scope.event_name = title;
			
			$scope.close = function() {
				overlappedAlert.reject();
				body.close();
			}

			$scope.confirm = function() {
				overlappedAlert.resolve();
			}

			$transitions.onStart({}, function() {
				body.close();
			});
		},
		templateUrl: '/html/common/overlappedAlert.html'
	});
}