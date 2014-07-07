'use strict';

module.exports = function() {

    function BasicController() {
        //
    }

    BasicController.prototype.index = function index(req, res) {
        //Actions here
        return res.sendResponse(200, {index: 'Welcome to Basic Controller'});
    };

    BasicController.prototype.page = function page(req, res) {
        //Actions here
        return res.sendResponse(200, { basic: 'Welcome to Basic Page' });
    };

    return BasicController;
};

