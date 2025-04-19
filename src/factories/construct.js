module.exports = function(modal) {
	return modal({
		controller: function($scope, construct, $rootScope, $transitions, body) {
			$rootScope.body = body;

			$scope.close = function() {
				construct.resolve();
				body.close();
			}

			$transitions.onFinish({}, function() {
                construct.reject();
				body.close();
			});
		},
		templateUrl: '/html/common/construct.html'
	});
    
};
