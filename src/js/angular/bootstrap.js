// Bootstrap
angular.element(document).ready(function() {
    'use strict';
    livi18n.init(window.location.href.split('/')[0] + '//' + window.location.href.split('/')[2], ['messages'], function(){
        angular.bootstrap(document, ['CarolayneApp']);
    });
});