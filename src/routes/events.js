module.exports = function($stateProvider) {
    let moment = require('moment');
    
    function getStaffingResolve(type) {
        return function($injector, $q, $window, Loader, $stateParams, values) {
            let Staffing = $injector.get('Staffing'),
                deferred = $q.defer(),
                loading = new Loader(),
                cursor = +$window.sessionStorage.getItem(`${type}Cursor`) || 0,
                status = (type === 'confirmed' || type === 'completed') ? 'HIRED' : type.toUpperCase(),
                sid = $stateParams.sid || null,
                queryParams = {
                    [type]: true,
                    count: values.eventsPerPage,
                    skip: values.eventsPerPage * cursor,
                    include: "event.expertises,shifts,event.event_group.images"
                };

            Staffing.query(queryParams, function(response) {
                loading.stop();

                if (!response.length && response.total) {
                    $window.sessionStorage.removeItem(`${type}Cursor`);
                    queryParams.skip = 0;
                    Staffing.query(queryParams, function(response) {
                        response.forEach( (staffing) => {
                            staffing.status = status;
                            (staffing.id == sid) ? staffing.expand = true : null;
                            return true;
                        });
                        deferred.resolve(response);
                    });
                } else {
                    response.forEach( (staffing) => {
                        staffing.status = status;
                        (staffing.id == sid) ? staffing.expand = true : null;
                        return true;
                    });
                    deferred.resolve(response);
                }
            }, function(error) {
                loading.stop();
            });

            return deferred.promise;
        }
    }

    $stateProvider.state('signedin.events', {
        abstract: true,
        templateUrl: '/html/layouts/events.html',
        controller: function($scope, $state, User) {
            $scope.state = $state;
            $scope.layoutScroll = document.getElementById('layout-scroll-container');
            $scope.Tabs = [
                {
                    title: 'Opportunities',
                    value: 'open'
                },
                {
                    title: 'Invited',
                    value: 'invited'
                },
                {
                    title: 'Reaccept',
                    value: 'reaccept'
                },
                {
                    title: 'Applied',
                    value: 'applied'
                },
                {
                    title: 'Confirmed',
                    value: 'confirmed'
                },
                {
                    title: 'Completed',
                    value: 'completed'
                }
            ];        
            $scope.invitedCount = 0;
            
            $scope.$on('changeTab', function(event, data) {
                $scope.active = data.active;
                $scope.invitedCount = data.invitedCount;
                $scope.reacceptCount = data.reacceptCount;
            });
            
            $scope.goTo = (path) => $state.go('signedin.events.' + path);
        
        },
        resolve: {
            SkillList: function($injector, $q) {
                let deferred = $q.defer(),
                    images = {
                        'Bartender': '../../../../assets/images/create-event/roles/bartender.png',
                        'Server': '../../../../assets/images/create-event/roles/server.png',
                        'Personality': '../../../../assets/images/create-event/roles/personality.png',
                        'Retail': '../../../../assets/images/create-event/roles/retail.png',
                        'Captain': '../../../../assets/images/create-event/roles/Captain.svg'
                    };
                
                $injector.get('Skill').query({ include: 'levels' }, (response) => {
                    deferred.resolve(response);
                    return true;
                }, (error) => deferred.reject(null));
                
                return deferred.promise;
            },
            Uniforms: function($http, $q, config) {
                let deferred = $q.defer(),
                    images = [
                        '../../../../assets/images/uniform/black-dress.png',
                        '../../../../assets/images/uniform/black-pants.png',
                        '../../../../assets/images/uniform/khaki-pants.png',
                        '../../../../assets/images/uniform/black-button-down.png',
                        '../../../../assets/images/uniform/white-button-down.png',
                        '../../../../assets/images/uniform/dark-denim.png',
                        '../../../../assets/images/uniform/black-belt-n-shoes.png',
                        '../../../../assets/images/uniform/black-tee.png',
                        '../../../../assets/images/uniform/white-tee.png'
                    ];
                
                $http.get(`${config.api}uniform`, { params: { primary: true, order: 'asc' } })
                    .then((response) => {
                        let uniforms = response.data.data;
                        
                        uniforms.forEach((uniform, index) => uniform.pict = images[index]);
                        
                        deferred.resolve(uniforms);
                        return true;
                    }, (error) => deferred.reject());
                
                return deferred.promise;
            },
            Ranks: ($q, $http, config) => {
                let deferred = $q.defer();
                
                $http.get(`${config.api}follower_rank`).then((resp) => deferred.resolve(resp.data.data));
                
                return deferred.promise;
            }
        },
        onEnter: function(User, $state) {
            if (User.status !== 'APPROVED') {
                $state.go('signedin.status-info');
            }
        }
    })

    .state('signedin.events.open', {
        url: '/events/open',
        templateUrl: '/html/views/events/events.html',
        controller: 'Events',
        resolve: {
            Staffing: function($injector, $state, $window, $q, StaffingCache, values) {
                let cursor = +$window.sessionStorage.getItem('openCursor') || 0,
                    deferred = $q.defer(),
                    Staffing = $injector.get('Staffing');

//                if (StaffingCache.get('Staffing')) {
//                    return StaffingCache.get('Staffing');
//                } else {
                    Staffing.query({
                        count: values.eventsPerPage,
                        skip: values.eventsPerPage * cursor,
                        include: "event.expertises,shifts,event.event_group.images",//Shifts???
                        order: 'asc'
                    }, function(response) {        
                        deferred.resolve(StaffingCache.put('Staffing', response));
                    });
//                }

                return deferred.promise;
            },
            Active: () => 'open'
        }
    })

    .state('signedin.events.invited', {
        url: '/events/invited',
        templateUrl: '/html/views/events/events.html',
        controller: 'Events',
        resolve: {
            Staffing: getStaffingResolve('invited'),
            Active: () => 'invited'
        }
    })
    
    .state('signedin.events.reaccept', {
        url: '/events/reaccept',
        templateUrl: '/html/views/events/events.html',
        controller: 'Events',
        resolve: {
            Staffing: getStaffingResolve('reaccept'),
            Active: () => 'reaccept'
        }
    })

    .state('signedin.events.applied', {
        url: '/events/applied',
        templateUrl: '/html/views/events/events.html',
        controller: 'Events',
        resolve: {
            Staffing: getStaffingResolve('applied'),
            Active: () => 'applied'
        }
    })

    .state('signedin.events.confirmed', {
        url: '/events/confirmed',
        templateUrl: '/html/views/events/events.html',
        controller: 'Events',
        resolve: {
            Staffing: getStaffingResolve('confirmed'),
            Active: () => 'confirmed'
        }
    })

    .state('signedin.events.completed', {
        url: '/events/completed',
        templateUrl: '/html/views/events/events.html',
        controller: 'Events',
        resolve: {
            Staffing: getStaffingResolve('completed'),
            Active: () => 'completed'
        }
    })

    .state('signedin.events.event', {
        url: '/events/:eid/staffing/:sid/:status',
        views: {
            '@signedin': {
                templateUrl: '/html/views/events/event.html',
                controller: 'Event',
            }
        },
        resolve: {
            Staffing: function($injector, $stateParams, $state, $q, Loader) {            
                let Staffing = $injector.get('Staffing'),
                    deferred = $q.defer(),
                    status = $stateParams.status,
                    loader = new Loader();
                
                Staffing.get({
                    id: $stateParams.sid,
                    include: "event.expertises.subexpertises,event.keywords,event.client.talent_rates,shifts.digital_info,shifts.files,usershifts.reports,event.event_group.files,event.event_group.images"
                }, function(response) {
                    loader.stop();
                    response.downloaded = true;
                    let res = response.statusHandler($stateParams.status),
                        redirect = {
                            go: {
                                name: 'signedin.events.event',
                                params: {
                                    eid: response.event.id,
                                    sid: response.id,
                                    status: 'open'
                                }
                            }
                        };
                    
                    if (res) {
                        deferred.resolve(response);
                    } else {
                        if (response.usershifts.length) {
                            let tmp = response.usershifts.find((user_shift) => user_shift.status != 'REJECTED' && user_shift.status != 'UNAVAILABLE');    
                        
                            if (tmp) {
                                switch(tmp.status) {
                                    case 'APPLIED': 
                                        redirect.go.params.status = 'applied';
                                        break;
                                    case 'INVITED': 
                                        redirect.go.params.status = 'invited';
                                        break;
                                    case 'REACCEPT': 
                                        redirect.go.params.status = 'reaccept';
                                        break;
                                    case 'HIRED':
                                        redirect.go.params.status = (response.event.end.isBefore(moment())) ? 'completed' : 'confirmed';
                                        break;
                                    default: 
                                        break;
                                }
                            } else {
                                redirect.go.name = 'signedin.events.open';
                                redirect.go.params = {};
                            }
                        }
                        deferred.reject(redirect);
                    }
                }, function(error) {
                    loader.stop();
                    deferred.reject(null);
                    $state.go('signedin.events.open');
                });
                
                return deferred.promise;
            },
            ImagesPreload: function($q, preloader, Staffing) {//preload group images
                let deferred = $q.defer(),
                    images = Staffing.event.event_group.images.map((image) => image.url);
                
                if (images.length) {
                    preloader.preloadImages(images)
                        .then(() => deferred.resolve(),// Loading was successful.
                              () => deferred.resolve());// Loading failed on at least one image.
                } else {
                    deferred.resolve();
                }
                
                return deferred.promise;
            }
        },
        params: {
            eid: {
                dynamic: true
            },
            sid: {
                dynamic: true
            },
            status: null,
            StaffingList: null
        }
    })
}
