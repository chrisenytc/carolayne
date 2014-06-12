'use strict';

module.exports = {
    core: {
        extends: {
            socket: function(io) {
                //Socket Middleware
                io.use(function(req, next) {
                    return next();
                });
            }
        }
    }
};
