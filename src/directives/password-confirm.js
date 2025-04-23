module.exports = function () {
   
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
            ctrl.$validators.match = function(modelValue, viewValue) {
                let formName = attr.passwordConfirm;
                console.log('password confirm', scope[formName].password.$viewValue, viewValue);
                if (ctrl.$isEmpty(modelValue)) {
                    return true;
                }
        
                if (viewValue === scope[formName].password.$viewValue) {
                    // it is valid
                    return true;
                }
        
                // it is invalid
                return false;
            };
        }
    }
}