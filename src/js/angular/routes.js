//Configuration
App.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        'use strict';
        //Routes
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/assets/views/index.html',
                controller: 'indexCtrl'
            });
        //404
        $urlRouterProvider.otherwise('/');
        //Enable html5Mode
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');
    }
]);