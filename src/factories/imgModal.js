module.exports = function(modal) {
	return modal({
		controller: function($scope, $transitions, body, url, imgModal) {

            $scope.imgUrl = url;
            
			$scope.close = function() {
				imgModal.reject();
				body.close();
			};
            
//            $scope.confirm = () => imgView.resolve();

            $transitions.onStart( {}, () => body.close() );
		},
		templateUrl: '/html/common/imgModal.html'
	});
}