/*
 * Controller: indexCtrl
 */

App.controller('indexCtrl', ['$scope', '$livi18n',
    function indexCtrl($scope, $livi18n) {
        'use strict';
        $scope.welcome = $livi18n.t({key: 'messages.welcome'});
    }
]);
