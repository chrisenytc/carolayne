/*
 * Service: resource
 */

App.factory('Resource', function($resource) {
    'use strict';
    return $resource('/resource/:id', {
        id: '@id'
    }, {
        update: {
            method: 'PUT'
        }
    });
});
