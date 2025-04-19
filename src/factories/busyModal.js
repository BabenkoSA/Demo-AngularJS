module.exports = function(modal) {
	return modal({
		controller: function($scope, busyModal, $rootScope, $transitions, body, mode) {
			$rootScope.body = body;
            $scope.mode = mode;

			$scope.close = function() {
				busyModal.reject();
				body.close();
			}

			$scope.confirm = function(action) {
				busyModal.resolve(action);
			}

			$transitions.onFinish({}, function() {
				busyModal.reject();
                body.close();
			});
		},
		templateUrl: '/html/common/busyModal.html'
	});
}
