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
    http = require('http'),
    debug = require('./debugger.js'),
    banner = require('./banner.js');

exports.run = function() {
    //Banner
    banner();
    //Load configs
    carolayne.loadConfigs();
    //Load dependencies
    carolayne.loader();
    //Start server
    var App = carolayne.configureServer(),
        Server = http.createServer(App).listen(carolayne.getConfig('app').port, function() {
            debug('Server running on port '.green + ' [ ' + String(carolayne.getConfig('app').port).bold + ' ]', 'success');
        });
    //Start sockets
    if (carolayne.getConfig('app').sockets) {
        carolayne.loadSockets(Server, function() {
            debug('Sockets loaded successfully!', 'success');
        });
    }
};
