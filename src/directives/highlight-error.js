module.exports = function() {
    return {
        restrict: 'A',
        require: '^form',
        link: function(scope, element, attrs, formCtrl) {
            const fieldName = attrs.name;

            if (!fieldName) {
                console.warn('highlightError directive requires a "name" attribute on the input field.');
                return;
            }

            scope.$watch(() => formCtrl[fieldName] && formCtrl[fieldName].$invalid && formCtrl.$submitted, (hasError) => {
                if (hasError) {
                    element.addClass('has-error');
                } else {
                    element.removeClass('has-error');
                }
            });
        }
    };
}