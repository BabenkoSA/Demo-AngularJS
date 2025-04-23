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
        // controller: 'Signedin',
        resolve: {},

    })

    .state('main.home', {
        url: '/',
        templateUrl: '/html/home.html',
        resolve: {},

    })

    // .state('main.users', {
    //     url: '/users',
    //     component: 'usersComponent',
    //     bindings: { users: 'UsersList' },
    //     resolve: {
    //         UsersList: function(RequestEmulator) {
    //             return RequestEmulator.getUsers().then(function(users) {
    //                 return users;
    //             });
    //         }
    //     }
    // })
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

    // // .state('main.users.test', {
    // //     url: '/test',
    // //     template: `<div class="test">Test</div>`,
    // // })

    // .state('main.users.user', {
    //     url: '/:userId',
    //     templateUrl: '/html/user.html',
    //     controller: 'User',
    //     resolve: {
    //         User: function($stateParams, RequestEmulator) {
    //             return RequestEmulator.getUser($stateParams.userId).then(function(user) {
    //                 return user;
    //             });
    //         }
    //     },
    //     params: {
    //         userId: {
    //             dynamic: true
    //         },
    //         mode: null
    //     }

    // })
    
    .state('main.403', {
        url: '/403',
        templateUrl: '/html/forbidden.html',
        resolve: {}
    })

    .state('main.404', {
        url: '/404',
        templateUrl: '/html/notFound.html',
        resolve: {}
    })
}
