module.exports = function(modal) {
	return modal({
		controller: function($scope, $transitions, body, data, alert) {
            
            $scope.show = false;
            $scope.showMessage = () => $scope.show = !$scope.show;
			$scope.message = data.message;
            $scope.extra_message = data.extra_message;
			$scope.button = data.button;
			$scope.title = data.title || null;

			$scope.close = () => alert.reject();
            
            $scope.confirm = () => alert.resolve();

            $transitions.onStart( {}, () => body.close() );
		},
		templateUrl: '/html/common/alert.html'
	});
}
