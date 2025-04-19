module.exports = function ($stateProvider) {

    var moment = require('moment');

    $stateProvider.state('signedin.user', {
        abstract: true,
        url: '/profile',
        templateUrl: '/html/layouts/user.html',
        resolve: {
            Status: function(User) {
                let status = User.status;

                return status;
            }
        },
        onEnter: function(Status, $state) {
            if (Status !== 'APPROVED') $state.go('signedin.status-info');
        },
        controller: function($scope, $state, User) {
            $scope.User = User;
            $scope.state = $state;
            $scope.layoutScroll = angular.element(document.getElementById('layout-scroll-container'));
//            $scope.busyOpen = false;//for schedule part
//            $scope.$on('modalBusy', function (event, data) {
//                $scope.busyOpen = data.value;
//            });
            $scope.$on('initTabs', function(event, data) {
                $scope.panel_title = data.panel_title;
                $scope.Tabs = data.tabs;
            });

            $scope.now = moment();
        }
    })

    .state('verify', {
        url: '/verify/:code',
        controller: function($scope, $stateParams, $state, $http, config) {
            $http({
                method: 'POST',
                url: config.api + 'verify/' + $stateParams.code
            }).then(function(response) {
                $state.go('signedin.user.settings');
            }, function(e) {
//                console.error(e);
            });
        }
    })

    .state('signedin.user.profile', {
        url: '',
        templateUrl: '/html/views/user/profile.html',
        controller: 'Profile',
        resolve: {
            Expertises: ($http, config) => $http.get(`${config.api}expertise`, { params: { count: 'all', primary: true, include: 'subexpertises' } }).then((response) => {
                return response.data.data.map(item => {
                    item.subexpertises = item.subexpertises.data;
                    return item;
                });
            }),
            Ranks: ($http, config) => $http.get(`${config.api}follower_rank`, { params: { count: 28 } }).then((resp) => resp.data.data)
            // Skills: ($injector, $q, User) => {
            //     let deferred = $q.defer();
            //     $injector.get('Skill').query({ include: 'levels' }, (resp) => {
            //         User.setSkillsList(resp);
            //         deferred.resolve(resp);
            //     }, () => deferred.reject(null));
            //     return deferred.promise;
            // }
        }
    })

    .state('signedin.user.settings', {
        url: '/settings',
        templateUrl: '/html/views/user/settings.html',
        controller: 'Settings'
    })

    .state('signedin.user.docs', {
        url: '/document/:doctype',
        templateUrl: '/html/views/user/docs.html',
        controller: function($scope, $state, $stateParams, $http, config, SignUrl, User) {
            function emitTabs() {
                let data = {
                    panel_title: `${$scope.User.first_name} ${$scope.User.last_name}`,
                    tabs: [{                
                            title: 'Profile',
                            state_link: 'signedin.user.profile'
                        },
                        {
                            title: 'Images',
                            state_link: 'signedin.user.images'
                        },
                        {
                            title: 'Settings',
                            state_link: 'signedin.user.settings'
                        }]
                };
                $scope.$emit('initTabs', data);
            };
            emitTabs();
            if (SignUrl == 'Signed') {
                $state.go('signedin.user.settings');
            } else {
                HelloSign.init(config.hellosign.client_id);
                HelloSign.open({
                    url: SignUrl.data.url,
                    allowCancel: true,
//                    skipDomainVerification: true,//for local testing
                    container: document.getElementById('hs__container'),
                    messageListener: function(data) {
                        if (data.event == 'signature_request_signed') {
                            let data = {
                                w9: true
                            };
                            User.w9 = true;
//                            if ($stateParams.doctype === 'w9') {
//                                User.w9 = true;
//                                data.w9 = true;
//                            } else 
                            if ($stateParams.doctype === 'ssn_agreement' || $stateParams.doctype === 'ein_agreement') {
                                User.agreement = true;
//                                User.w9 = true;
                                data.agreement = true;
//                                data.w9 = true;
                            } else if ($stateParams.doctype === 'ssn_digital_agreement' || $stateParams.doctype === 'ein_digital_agreement') {
                                User.digital_agreement = true;
//                                User.w9 = true;
                                data.digital_agreement = true;
//                                data.w9 = true;
                            }

                            if (Object.keys(data).length) {
                                $http({
                                    method: 'PATCH',
                                    url: `${config.api}user/${User.id}`,
                                    data: data
                                }).then((response) => {}, (error) => {});
                            }
                            $state.go('signedin.user.settings');
                        }
//                        console.log('hs data', data);
                        if (data.event == 'error') {
                            $state.go('signedin.user.settings');
                        }
                    }
                });

                
                $scope.layoutScroll.scrollTo(0, 0);
            }
        },
        resolve: {
            SignUrl: function($http, $stateParams, $state, $q, config, User, Loader) {
                let doctype = $stateParams.doctype,
                    loader,
                    deferred = $q.defer();
                
                if (doctype !== 'ssn_digital_agreement' && doctype !== 'ein_digital_agreement' && doctype !== 'ssn_agreement' && doctype !== 'ein_agreement') {
                    deferred.reject({ go: { name: 'signedin.user.settings' } });
                } else if ((doctype === 'ssn_agreement' || doctype === 'ein_agreement') && User.agreement && User.w9) {
                    deferred.reject({ go: { name: 'signedin.user.settings' } });
                } else if ((doctype === 'ssn_digital_agreement' || doctype === 'ein_digital_agreement') && User.digital_agreement && User.w9) {
                    deferred.reject({ go: { name: 'signedin.user.settings' } });
//                } else if (doctype === 'w9' && User.w9) {
//                    deferred.reject({ go: { name: 'signedin.user.settings' } });
                } else {
                    loader = new Loader();
                    $http.get(`${config.api}esign?type=${doctype}`).then(function(resp) {
                        loader.stop();
                        deferred.resolve(resp.data);
                    }, function(error) {
                        loader.stop();
                        deferred.reject({
                            go: {
                                name: 'signedin.user.settings'
                            }
                        });
                    });
                }
                
                return deferred.promise;
            }
        },
        onExit: () => HelloSign.close()
    })
    
    .state('signedin.user.earnings', {
//        abstract: true, //return for child states
//        url: '^/earnings',
//        controller: function($scope) {
//            function emitTabs() {
//                let data = {
//                    panel_title: 'Earnings',
//                    tabs: [{                
//                            title: 'Pending',
//                            state_link: 'signedin.user.earnings.pending'
//                        },
//                        {
//                            title: 'Complete',
//                            state_link: 'signedin.user.earnings.complete'
//                        }],
//                };
//                $scope.$emit('initTabs', data);
//            };
//            emitTabs();
//        }
        url: '^/earnings',
        templateUrl: '/html/views/user/earning.html', //remove this part for child states
        controller: 'Earning',
        resolve: {
            UserShifts: function($injector, $q, Loader, User) {
                let loading = new Loader(),
                    deferred = $q.defer(),
                    UserShift = $injector.get('UserShift');
                
                UserShift.query({
                    hired: true,
                    paid: true,
                    user: User.id,
                    count: 'all',
                    skip: 0,
                    sort: 'start',
                    include: 'staffing,event'
                }, function(response) {
                    loading.stop();
                    deferred.resolve(response);
                }, function(error) {
                    loading.stop();
                    deferred.reject();
                });
                
                return deferred.promise;
            }
        }
    })
    
//    .state('signedin.user.earnings.pending', {
//        url: '/pending',
//        templateUrl: '/html/views/user/earning.html',
//        controller: 'Earning',
//    })
//    
//    .state('signedin.user.earnings.complete', {
//        url: '/complete',
//        templateUrl: '/html/views/user/earning.html',
//        controller: 'Earning',
//    })
//    
//    .state('signedin.user.earnings.details', {
//        url: '',
//        templateUrl: '/html/views/user/earnings-details.html',
//    })

    .state('signedin.user.images', {
        url: '/images',
        templateUrl: '/html/views/user/profile-photos.html',
        controller: 'Photos'
    })

    .state('signedin.user.messages', {
        url: '^/messages',
        views: {
            '@signedin': {
                templateUrl: '/html/views/user/messages.html',
                controller: 'Messages'
            }
        },
        resolve: {
            Channels: async function($q, Loader, ChatClient) {
                let deferred = $q.defer(),
                    loader = new Loader(),
                    end;
        
                if (!ChatClient) {
                    loader.stop();
                    deferred.reject({
                        go: {
                            name: 'signedin.events.open',
                            params: {}
                        }
                    });
                } else {
                    end = (ChatClient.chats.length > 10) ? 10 : ChatClient.chats.length;
                    ChatClient.chats.sort(function(a, b) {
                        a.downloaded = false;
                        b.downloaded = false;

                        if (!a.lastMessage && !b.lastMessage) {
                            return 0;
                        }
                        if (!a.lastMessage) {
                            return 1;
                        }
                        if (!b.lastMessage) {
                            return -1;
                        }
                        if ( moment(a.lastMessage.timestamp).isAfter(moment(b.lastMessage.timestamp)) ) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });

                    for(let i = 0; i < end; i++) {
                        await ChatClient.channelHandler(ChatClient.chats[i]);
                    }

                    loader.stop();
                    deferred.resolve(ChatClient.chats);
                }
                
                return deferred.promise;
            }
        }
    })
//    .state('signedin.user.schedule', {
//        url: '/schedule',
//        templateUrl: './html/views/user/schedule.html',
//        controller: 'Schedule',
//        resolve: {
//            Confirmed: function(User, $document) {
//                let eventsData = [],
//                    style = '';
//
//                User.hired.forEach(function(item){
//                    let event = {
//                        title: item.event.title,
//                        start: item.shift.start,
//                        end: item.shift.end,
//                        text: item.shift.pretty,
//                        id: item.event.id
//                    },
//                        eventDate = '"'+event.start.format('dddd MMMM D YYYY')+'"';
//
//                    eventsData.push(event);
//
//                    style += 'table.md-calendar td[aria-label=' + eventDate + '] span::after {content: ""; background-color: #20cadb; position: absolute; width: 5px; height: 5px; right: 19px; bottom: 8px; border-radius: 50%;}';
//                });
//
//                $document.find('head').append(angular.element('<style type="text/css" id="marks">').html(style));//datepicker event marks
//                $document.find('html').addClass('schedule-height');
//
//                return eventsData;
//            }
//        },
//        onExit: function($document) {
//            if (document.getElementById('marks')) {
//                document.getElementById('marks').remove();
//            }
//            $document.find('html').removeClass('schedule-height');
//        }
//    })

//    .state('signedin.user.bankaccount', {
//        url: '/bankaccount',
//        templateUrl: '/html/views/user/bankaccount.html'
//    })
//
//    .state('signedin.user.creditcard', {
//        url: '/creditcard',
//        templateUrl: '/html/views/user/creditcard.html'
//    })
    
//    .state('signedin.user.benefits', {
//        url: '/benefits',
//        views: {
//            "@signedin": {
//                templateUrl: '/html/views/user/benefits.html',
//                controller: function($scope, TaxUrl) {
//                    if (TaxUrl.url) {
//                        let elem = document.getElementById('benefits'),
//                            frame = document.createElement('iframe');
//                        frame.setAttribute('src', TaxUrl.url);
//                        frame.classList.add("benefits--container");
//                        elem.appendChild(frame);
//                    } else {
//                        $scope.errors = true;
//                    }
//                },
//            }
//        },
//        resolve: {
//            TaxUrl: function($http, $q, config, Loader) {
//                let loading = new Loader(),
//                    deferred = $q.defer();
//                
//                $http.get(`${config.api}benefits`).then(function(resp) {
//                    loading.stop();
//                    deferred.resolve(resp.data.data);
//                }, function(e) {
//                    loading.stop();
//                    deferred.resolve(e);
//                });
//
//                return deferred.promise;
//            }
//        }
//    })
};
