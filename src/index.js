'use strict';

require('@uirouter/angularjs');
require('angular-touch');
require('angular-messages');
require('angular-sanitize');
require('angular-animate');
require('angular-aria');

window.app = angular.module('DemoApp', [
	'ngMessages',
	'ui.router',
    'ngAria',
    'ngAnimate',
    'ngSanitize'
])

.constant('config', {
    env: process.env.environment
})
.constant('UsersList', require('./constants/demoUsers').users)

.run(require('./run'))

.config(require('./config'))
.config(require('./routes'))

.controller('Users', require('./controllers/users'))

.factory('Notification', require('./services/notify'))
.service('RequestEmulator', require('./services/requestEmul'))

.directive('highlightError', require('./directives/highlight-error'))
.directive('passwordStrength', require('./directives/password-strength'))
.directive('passwordConfirm', require('./directives/password-confirm'))
.directive('checkUsername', require('./directives/check-username'))

angular.bootstrap(document, ['DemoApp']);
