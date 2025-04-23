module.exports = function ($http, $q, $timeout, RequestEmulator) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {

            ngModel.$asyncValidators.exists = function(modelValue, viewValue) {
                let username = viewValue,
                    deferred = $q.defer(),
                    id = scope[attr.checkUsername] ? scope[attr.checkUsername].id : undefined;

                // ask the server if this username exists
                RequestEmulator.checkUsername(username, id).then(function(response) {
                    if (response.exists) {
                        deferred.reject();
                    } else {
                        deferred.resolve();
                    }
                });
                // return the promise of the asynchronous validator
                return deferred.promise;
            }
        }
    }
}