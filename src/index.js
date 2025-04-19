'use strict';

require('@uirouter/angularjs');
require('angular-touch');
require('angular-messages');
require('angular-sanitize');
require('angular-animate');
require('angular-aria');
require('angular-material');

window.app = angular.module('DemoApp', [
	'ngMessages',
	'ui.router',
    'ngAria',
    'ngAnimate',
    'ngSanitize',
    'ngMaterial',
])

.constant('config', {
    env: process.env.environment,
    // domain: process.env.domain,
    // release_date: '2024-10-05 10:00:00'
})

.run(require('./run'))

.config(require('./config'))
.config(require('./routes'))


.directive('formError', require('./directives/form-error'))

angular.bootstrap(document, ['DemoApp']);
