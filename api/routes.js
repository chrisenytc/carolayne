'use strict';

/*
 * Module Dependencies
 */

module.exports = {

    /*
     * Route => GET /
     */

    '/': {
        method: 'get',
        controller: 'HomeCtrl',
        action: 'index'
    },

    /*
     * Route => GET /page
     */

    '/page': {
        method: 'get',
        controller: 'HomeCtrl',
        action: 'page'
    }
};
