module.exports = function($rootScope, $transitions, $state) {
	// $rootScope.menu = menu;
	$rootScope.state = $state;
    
    $rootScope.$on("unauthorized", async function() {
        // await alert.open({
        //     data: {
        //         message: "Your access token is expired. Please, re-login to the app.",
        //         button: "Ok"
        //     }
        // }).then(() => {}, () => {});
        // Authenticate.signout();
        // $state.go('signedout.home', { signin: true });
    });


	$transitions.onStart({}, function() {
        // menu.close();
    });

	$transitions.onFinish({}, function(transition) {
		window.scrollTo(0, 0);

		// if (config.env === 'production') {
		// 	gtag('config', process.env.google.analytics, {'page_path': transition.to().url});
		// }
	});

	$state.defaultErrorHandler(function(error) {
		if (error.detail.go) {
			$state.go(error.detail.go.name, error.detail.go.params);
		} else {
			//console.error(error);//need to remove if don't wanna see error about superseded transition
		}
	});
	
	//mock backend for demo purposes
	// var occupiedUsernames = ['user1', 'user2', 'user3']; // Example occupied usernames
	// $httpBackend.whenGET("localhost:3000/checkIfAvailable").respond(
	// 	function(method, url, data) {
	// 	  var username = data;
	// 	  var exists = occupiedUsernames.indexOf(username) > -1; // 'true' if username is in array
	// 	  return [200, {exists: exists}, {}];
	// 	}
	// );
}
