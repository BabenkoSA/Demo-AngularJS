module.exports = function($rootScope, $transitions, $state) {
	// $rootScope.menu = menu;
	$rootScope.state = $state;

	$transitions.onStart({}, () => {});

	$transitions.onFinish({}, (transition) => {
		window.scrollTo(0, 0);
	});

	$state.defaultErrorHandler(function(error) {
		if (error.detail.go) {
			$state.go(error.detail.go.name, error.detail.go.params);
		} else {
		}
	});
}
