'use strict';

module.exports = {

    /*
     * Policie => HomeCtrl
     */

    HomeCtrl: {
        '*': true
    },

    /*
     * Policie => BasicCtrl
     */

    BasicCtrl: {
        '*': true,
        'page': ['allowed',
            function (req, res, next) {
                //actions here
                return next();
            }
        ]
    }
};
