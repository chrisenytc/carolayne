/*
 * Service: service
 */

App.factory('Service', function() {
    'use strict';
    return {
        sayHello: function sayHello(name) {
            console.log('Hello, ' + name);
        }
    };
});
