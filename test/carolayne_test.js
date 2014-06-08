/*
 * carolayne
 * https://github.com/chrisenytc/carolayne
 *
 * Copyright (c) 2014, Christopher EnyTC
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var Carolayne = require('../lib/core/carolayne.js'),
    carolayne = new Carolayne();

describe('he-man module', function() {

    describe('#constructor()', function() {

        it('should be a function', function() {

            carolayne.should.be.a('function');

        });
    });

    describe('#instance()', function() {

        it('should be a object', function() {

            carolayne.should.be.a('object');
            
        });
    });
});
