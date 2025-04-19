module.exports = function(modal) {
	return modal({
		controller: function($scope, confirm, message, button, $rootScope, $transitions, body, $sce) {

			$rootScope.body = body;
			$scope.button_title = button;
			$scope.message = $sce.trustAsHtml(message);
			
			$scope.close = function() {
				confirm.reject();
				body.close();
			};

			$scope.confirm = () => confirm.resolve();

			$transitions.onStart( {}, () => body.close() );
		},
		templateUrl: '/html/common/confirm.html'
	});
    
};
