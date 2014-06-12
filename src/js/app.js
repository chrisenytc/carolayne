/*
 * carolayne
 * https://github.com/chrisenytc/carolayne
 *
 * Copyright (c) 2014 Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

var app = angular.module('CarolayneApp', ['ngRoute']);

app.config([
    '$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/index.html',
            controller: 'indexCtrl'
        }).otherwise({
            redirectTo: '/'
        });
    }
]);
