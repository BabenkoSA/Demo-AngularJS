'use strict';

require('@uirouter/angularjs');
require('angular-touch');
require('angular-messages');
require('angular-password');
require('angular-sanitize');
require('angular-ui-mask');
require('ng-autocomplete');
require('angular-animate');
require('angular-aria');
require('angular-material');
require('angular-scroll');

window.app = angular.module('Talent', [
	'ngPassword',
	'ngMessages',
	'ngAutocomplete',
	'ui.router',
	'ui.mask',
    'ngAria',
    'ngAnimate',
    'ngSanitize',
    'ngMaterial',
    'duScroll',
])

.constant('config', {
	api: process.env.api,
	hellosign: process.env.hellosign,
    env: process.env.environment,
    domain: process.env.domain,
    stripe: process.env.stripe,
	facebook: process.env.facebook,
    release_date: '2021-10-05 10:00:00'
})
.constant('values', require('./constants/values'))

.run(require('./run'))

.config(require('./config'))
.config(require('./routes'))
// .config(require('./routes/events'))
// .config(require('./routes/user'))

// .config(require('./decorators/event'))
// .config(require('./decorators/staffing'))
// .config(require('./decorators/shift'))
// .config(require('./decorators/user'))
// .config(require('./decorators/user-shift'))

// .controller('Forgot', require('./controllers/forgot'))
// .controller('Earning', require('./controllers/earning'))
// .controller('Event', require('./controllers/Event'))
// .controller('Contact', require('./controllers/contact'))
// .controller('PasswordReset', require('./controllers/password-reset'))
// .controller('Settings', require('./controllers/settings'))
// .controller('Signedout', require('./controllers/signedout'))
// .controller('Signedin', require('./controllers/signedin'))
// .controller('Signup', require('./controllers/signup'))
// .controller('Setup', require('./controllers/setup'))
// .controller('SetupCont', require('./controllers/setup-cont'))
// // .controller('Home', require('./controllers/home'))
// .controller('Live', require('./controllers/live'))
// .controller('BrandsTalent', require('./controllers/brands-talent'))
// .controller('Events', require('./controllers/events'))
// .controller('Profile', require('./controllers/profile'))
// .controller('Photos', require('./controllers/photos'))
// .controller('Messages', require('./controllers/messages'))
// .controller('External', require('./controllers/external'))

// .factory('alert', require('./factories/alert'))
// .factory('avatar', require('./factories/avatar'))
// .factory('minimumAlert', require('./factories/minimumAlert'))
// .factory('overlappedAlert', require('./factories/overlappedAlert'))
// .factory('cancel', require('./factories/cancel'))
// .factory('confirm', require('./factories/confirm'))
// .factory('signinPrompt', require('./factories/signinPrompt'))
// .factory('busyModal', require('./factories/busyModal'))
// .factory('construct', require('./factories/construct'))
// .factory('imgModal', require('./factories/imgModal'))
// .factory('shiftsModal', require('./factories/shiftsModal'))
// .factory('messageModal', require('./factories/messageModal'))
// .factory('manual', require('./factories/manual'))

// .factory('preloader', require('./utils/preloader'))

.directive('formError', require('./directives/form-error'))

// .service('menu', require('./services/menu'))
// .service('body', require('./services/body'))

angular.bootstrap(document, ['Talent']);
