/*
 * Directive: directive
 */

App.directive('directive', function directive() {
    'use strict';
    return {
        templateUrl: '/assets/views/templates/directive.html',
        restrict: 'A'
    };
});
