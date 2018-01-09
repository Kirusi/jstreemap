'use strict';

const should = require('should');
const assert = require('assert');

const {TreeMap} = require('../src/public/tree-map');

describe('TreeMap tests', function() {

    it('constructor;', function(done) {
        let m = new TreeMap();
        should.equal(0, m.size);

        done();
    });

    it('constructor; array literal', function(done) {
        let m = new TreeMap([[2, 'B'], [1, 'A'], [3, 'C']]);
        should.equal(3, m.size);

        let actual = [];
        for (let [k, v] of m) {
            actual.push([k, v]);
        }

        let expected = [[1, 'A'], [2, 'B'], [3, 'C']];
        should.deepEqual(expected, actual);

        done();
    });

});