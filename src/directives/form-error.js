module.exports = function() {
    return {
        restrict: 'A',
        scope: {
            input: '=formError'
        },
        link: function(scope, element, attrs) {
            scope.$watch('input.$invalid', function(invalid) {
//                console.log('formError',scope.input)
//                if (!scope.input.$$parentForm.$submitted) {
//                    return;
//                }
                if (invalid) {
                    element.addClass('has-error');
                } else {
                    element.removeClass('has-error');       
                }
            });
        }
    }
}
