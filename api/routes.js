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
     * Route => /
     */

    '/': {
        method: 'get',
        controller: 'HomeCtrl',
        action: 'index'
    },

    /*
     * Route => /page
     */

    '/page': {
        method: 'get',
        controller: 'HomeCtrl',
        action: 'page'
    }
};
