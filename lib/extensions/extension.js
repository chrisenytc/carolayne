'use strict';

module.exports = {
    core: {
        extends: function(App) {
            //Middleware
            App.use(function(req, res, next) {
                return next();
            });
        }
    }
};