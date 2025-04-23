module.exports = function () {
    let DIGIT_REGEXP = /[0-9]/g;
    let CHAR_REGEXP = /[A-Za-z]/g;
    
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ctrl) {
        ctrl.$validators.strong = function(modelValue, viewValue) {
            if (ctrl.$isEmpty(modelValue)) {
              // consider empty models to be valid
              return true;
            }
    
            if (viewValue.match(DIGIT_REGEXP) && viewValue.match(CHAR_REGEXP)) {
              // it is valid
              return true;
            }
    
            // it is invalid
            return false;
            };
        }
    }
}