module.exports = function(modal) {
	return modal({
		controller: function($scope, manual, $rootScope, $transitions, $state, body, flag) {

            $scope.state = $state;
            $scope.flag = flag;
			$scope.close = function() {
				manual.resolve();
				body.close();
			};

			$transitions.onStart({}, () => body.close());
            
		},
		templateUrl: '/html/common/manual.html'
	});
    
};