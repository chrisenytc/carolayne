'use strict';

module.exports = {

    /*
     * Route => GET /
     */

    'get /': {
        controller: 'HomeCtrl',
        action: 'index'
    },

    /*
     * Route => GET /page
     */

    'get /page': {
        controller: 'HomeCtrl',
        action: 'page'
    }
};
