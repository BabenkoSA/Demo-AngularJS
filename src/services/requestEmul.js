// This is a mock service to simulate HTTP requests for user data.
module.exports = function($http, $q) {
    let users = require('../constants/demoUsers').users;

    return {
        checkUsername: function(username, id) {
            let deferred = $q.defer();
            setTimeout(function() {
                // Simulate a server response
                let exists = users.some(user => user.username === username && user.id !== id);
                deferred.resolve({ exists: exists });
            }, 500);
            return deferred.promise;
        },
        getUsers: function() {
            let deferred = $q.defer();
            setTimeout(function() {
                // Simulate a delay for the request
                deferred.resolve(angular.copy(users));
            }, 500);
            return deferred.promise;
        },
        getUser: function(userId) {
            let deferred = $q.defer();
            setTimeout(function() {
                let index = users.findIndex(user => user.id === userId);
                if (index === -1) {
                    deferred.reject('User not found');
                    return;
                }
                deferred.resolve(angular.copy(users[index]));
            }, 500);
            return deferred.promise;
        },
        updateUser: function(user) {
            let deferred = $q.defer();
            setTimeout(function() {
                let index = users.findIndex(u => u.id === user.id);
                if (index !== -1) {
                    users[index] = user; // Simulate updating the user
                }
                deferred.resolve(user);
            }, 500);
            return deferred.promise;
        },
        saveUser: function(user) {
            let deferred = $q.defer();
            setTimeout(function() {
                user.id = Date.now(); // Simulate ID assignment
                users.push(user); // Simulate saving the user
                deferred.resolve(user);
            }, 500);
            return deferred.promise;
        },
        deleteUser: function(userId) {
            let deferred = $q.defer();
            setTimeout(function() {
                let index = users.findIndex(user => user.id === userId);
                if (index !== -1) {
                    users.splice(index, 1); // Simulate deleting the user
                }
                deferred.resolve(userId);
            }, 500);
            return deferred.promise;
        }
    };
}