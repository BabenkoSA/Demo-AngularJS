module.exports = function(modal) {
	return modal({
		controller: function($scope, $rootScope, $transitions, $sce, cancel, flag, data, body) {

			$rootScope.body = body;
			$scope.flag = flag;
            $scope.lostEventsNum = data.lostEventsNum;
            $scope.buttons = data.buttons;
            $scope.cancelReason = '';
			$scope.message = (data.message) ? $sce.trustAsHtml(data.message) : null;
			
			$scope.close = function() {
				cancel.reject();
				body.close();
			};

			$scope.confirm = function() {
				cancel.resolve(null);
			};
            
            $scope.confirmCancel = function(text) {
                if (!text) {
                    $scope.error = true;
                    return;
                } else {
                    cancel.resolve({ cancelText: text });
                }
            };

			$transitions.onStart({}, function() {
				body.close();
			});
		},
		templateUrl: '/html/common/cancel.html'
	});
}
