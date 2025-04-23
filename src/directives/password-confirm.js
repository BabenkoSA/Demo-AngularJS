module.exports = function () {
   
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            passwordValue: "=passwordConfirm"
        },
        link: function(scope, element, attr, ngModel) {
            ngModel.$validators.match = function(modelValue) {
                return modelValue === scope.passwordValue;
            };
 
            scope.$watch("passwordValue", function() {
                ngModel.$validate();
            });
        }
    }
}