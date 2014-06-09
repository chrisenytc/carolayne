'use strict';

/*
 * Module Dependencies
 */

var util = require('util');

module.exports = function(app, config) {
    //Root Application
    var ApplicationSocket = app.getLib('appSocket');

    function IndexSocket() {
        ApplicationSocket.call(this);
    }

    util.inherits(IndexSocket, ApplicationSocket);

    IndexSocket.prototype.index = {
        on: function() {
            //Create socket instance
            var socket = this;
            //Callback handler

            function callback(err, result, msg) {
                if (err) {
                    return socket.emit('index/list', {
                        error: err
                    });
                }
                if (!result) {
                    return socket.emit('index/list', {
                        error: msg
                    });
                }
                return socket.emit('index/list', result);
            }
            //Actions here
        }
    };

    return IndexSocket;
};

