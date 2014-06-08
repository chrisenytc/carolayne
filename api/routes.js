/*
 * carolayne
 * https://github.com/chrisenytc/carolayne
 *
 * Copyright (c) 2014, Christopher EnyTC
 * Licensed under the MIT license.
 */

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
