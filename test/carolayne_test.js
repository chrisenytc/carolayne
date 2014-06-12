'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var Carolayne = require('../lib/core/carolayne.js'),
    carolayne = new Carolayne();

describe('carolayne module', function() {

    describe('#constructor()', function() {

        it('should be a function', function() {

            Carolayne.should.be.a('function');

        });
    });

    describe('#instance()', function() {

        it('should be a object', function() {

            carolayne.should.be.a('object');
            
        });
    });
});
