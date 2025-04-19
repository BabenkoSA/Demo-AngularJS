module.exports = function(modal) {
	return modal({
		controller: function($scope, $rootScope, $transitions, $sce, signinPrompt, body, data) {
			$rootScope.body = body;
            $scope.title = data.title;
            $scope.message = $sce.trustAsHtml(data.message);
            $scope.btn_title = data.btn;
            
			$scope.close = function() {
				signinPrompt.reject();
			}

			$scope.confirm = function() {
				signinPrompt.resolve();
			}

			$transitions.onStart({}, function() {
				signinPrompt.reject();
                body.close();
			});
		},
		templateUrl: '/html/common/signinPrompt.html'
	});
}
