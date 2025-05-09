module.exports = function($timeout, $rootScope) {
    const service = {};

    service.showMessage = function(message, type = 'info', duration = 3000) {
        if (!message) {
            console.error('Notification message is required');
            return;
        }
        $rootScope.notification = {
            message: message,
            type: type,
            visible: true
        };

        // Hide the notification after the specified duration
        $timeout(function() {
            $rootScope.notification.visible = false;
        }, duration);
    };

    return service;
}