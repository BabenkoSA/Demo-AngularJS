module.exports = function(modal) {
	return modal({
		controller: function ($scope, messageModal, $rootScope, Loader, $transitions, body) {
//			$rootScope.body = body;
            $scope.message = '';
            
            $scope.messageError = () => !$scope.message || $scope.message.length < 5;
            
            $scope.confirm = function() {
                if ($scope.message.length > 1500) {
                    $scope.message.length = 1500;
                }
                messageModal.resolve({
                    message: $scope.message
                });
				body.close();
            };
            
			$scope.close = function() {
				messageModal.reject();
				body.close();
			};
            
            $transitions.onStart( {}, () => body.close() );
		},
		templateUrl: '/html/common/messageModal.html'
	});
    
};
