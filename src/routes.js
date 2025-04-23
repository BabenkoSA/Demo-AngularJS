module.exports = function($stateProvider, $urlRouterProvider, $locationProvider) {
 
    $locationProvider.html5Mode(true).hashPrefix('!');
    
    $urlRouterProvider.otherwise(function($injector, $location) {
        let state = $injector.get('$state');
        state.go('main.404');
        return;
    });

    $stateProvider.state('main', {
        abstract: true,
        templateUrl: '/html/main.html',
        controller: function($scope, $state) {
            $scope.goHome = function() {
                $state.go('main.home');
            }
        }
    })

    .state('main.home', {
        url: '/',
        templateUrl: '/html/home.html',
        resolve: {},

    })

    .state('main.users', {
        url: '/users',
        controller: 'Users',
        templateUrl: './html/users.html',
        resolve: {
            UsersList: function(RequestEmulator) {
                return RequestEmulator.getUsers().then(function(users) {
                    return users;
                });
            }
        }
    })
    
    .state('main.403', {
        url: '/403',
        templateUrl: '/html/forbidden.html'
    })

    .state('main.404', {
        url: '/404',
        templateUrl: '/html/notFound.html'
    })
}
