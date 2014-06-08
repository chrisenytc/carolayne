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

var Carolayne = require('./carolayne.js'),
    carolayne = new Carolayne(),
    debug = require('./debugger.js');

exports.run = function() {
    //Load configs
    carolayne.loadConfigs();
    //Load dependencies
    carolayne.loader();
    //Start server
    var App = carolayne.configureServer(),
        Server = App.listen(carolayne.getConfig('app').port);
    //Start sockets
    if (carolayne.getConfig('app').sockets) {
        carolayne.loadSockets(Server, function() {
            debug('Sockets loaded successfully!', 'success');
        });
    }
};
