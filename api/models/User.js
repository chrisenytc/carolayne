'use strict';

/*
 * Module Dependencies
 */

var mongoose = require('mongoose'),
    timestamps = require('mongoose-timestamp'),
    Schema = mongoose.Schema;

/*
 * User Schema
 */
var UserSchema = new Schema({

    email: {
        type: String,
        trim: true,
        unique: true,
        require: true
    },

    username: {
        type: String,
        trim: true,
        unique: true,
        require: true
    },

    password: {
        type: String,
        require: true
    }

});

/*
 * Plugins
 */
UserSchema.plugin(timestamps);

//Exports model
module.exports = mongoose.model('User', UserSchema);
