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

var util = require('util');

module.exports = function(app, config) {
    //Root Application
    var ApplicationController = app.getLib('appController');

    function HomeController() {
        ApplicationController.call(this);
    }

    util.inherits(HomeController, ApplicationController);

    HomeController.prototype.index = function index(req, res, next) {
        //Actions here
        return res.jsonp({welcome: 'Hello :D', config: config});
    };

    HomeController.prototype.page = function page(req, res, next) {
        //Actions here
        return res.jsonp({welcome: 'Page called'});
    };

    return HomeController;
};

