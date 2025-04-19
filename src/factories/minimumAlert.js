module.exports = function(modal) {
	return modal({
		controller: function($scope, minimumAlert, switcher, shiftLength) {
            
            $scope.textSwitcher = switcher;
            
            if(shiftLength) {
                $scope.hours = Math.trunc(shiftLength / 60);
                $scope.minutes = (shiftLength % 60) ? (shiftLength % 60) : '00';
            }

			$scope.close = function() {
				minimumAlert.reject();
			}

		},
		templateUrl: '/html/common/minimumAlert.html'
	});
}