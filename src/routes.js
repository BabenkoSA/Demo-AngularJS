module.exports = function($stateProvider, $urlRouterProvider, $locationProvider) {
 
    $locationProvider.html5Mode(true).hashPrefix('!');
    
    $urlRouterProvider.otherwise(function($injector, $location) {
        let state = $injector.get('$state');
        state.go('default.404');
        return;
    });

    $stateProvider.state('main', {
        abstract: true,
        templateUrl: '/html/test.html',
        // controller: 'Signedin',
        resolve: {},

    })

    .state('main.home', {
        url: '/',
        templateUrl: '/html/test2.html',
        // controller: 'Signedin',
        resolve: {},

    })

    .state('main.users', {
        url: '/users',
        templateUrl: '/html/users.html',
        controller: function($scope, $http) {
            $scope.users = [{
                username: 'user1',
                id: 1,
                email: 'user1@mail.com',
                first_name: 'User',
                last_name: 'One',
                type: 'Admin'
            }, {
                username: 'user2',
                id: 2,
                email: 'user2@mail.com',
                first_name: 'User',
                last_name: 'Two',
                type: 'Driver'
            }];

            $scope.selectedUser = null;
            $scope.editUser = function(user) {
                $scope.selectedUser = angular.copy(user);
                $scope.editing = true;
            }

            $scope.closeEdit = function() {
                $scope.selectedUser = null;
                $scope.editing = false;
            }

            $scope.saveUser = function() {
                // Save the user to the server or perform any other action
                console.log('User saved:', $scope.selectedUser);
                $scope.users = $scope.users.map(user => {
                    if (user.id === $scope.selectedUser.id) {
                        user = angular.merge(user, $scope.selectedUser);
                    }
                    return user;
                });
                $scope.closeEdit();
            }

            $scope.deleteUser = function() {
                // Delete the user from the server or perform any other action
                console.log('User deleted:', user);
                $scope.users = $scope.users.filter(u => u.id !== $scope.selectedUser.id);
                $scope.closeEdit();
            }

        },
        resolve: {},

    })

    .state('main.user', {
        url: '/user/:userId',
        template: `<div>User page</div>`,
        // controller: 'Signedin',
        resolve: {},
        params: {
            userId: {
                dynamic: true
            }
        }

    })
    
    .state('default', {
        abstract: true,
        // templateUrl: '/html/notFound.html',
        // controller: 'Signedin',
        resolve: {},
    })
    .state('default.403', {
        url: '/403',
        templateUrl: '/html/forbidden.html',
        // controller: 'Signedin',
        resolve: {},
    })
    .state('default.404', {
        url: '/404',
        templateUrl: '/html/notFound.html',
        // controller: 'Signedin',
        resolve: {},
    })
}
