//Configuration
App.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        'use strict';
        //Routes
        $routeProvider
            .when('/', {
                controller: 'indexCtrl',
                templateUrl: '/assets/views/index.html'
            });
        //Enable html5Mode
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }
]);