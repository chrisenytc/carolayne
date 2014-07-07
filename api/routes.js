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
    },

    /*
     * Route => GET /basic
     */

    'get /basic': {
        controller: 'BasicCtrl',
        action: 'index'
    },

    /*
     * Route => GET /basic/page
     */

    'get /basic/page': {
        controller: 'BasicCtrl',
        action: 'page'
    }
    
};
