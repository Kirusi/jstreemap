'use strict';

const should = require('should');
const assert = require('assert');

const {JsIterator, JsReverseIterator} = require('../src/public/js-iterators');

class NodeIsValuePolicy {
    fetch(n) {
        return n;
    }
}

// Nodes are replaced with integers
class ContainerStub {
    constructor() {
        this.valuePolicy = new NodeIsValuePolicy();
    }

    prev(n) {
        return n - 1;
    }

    next(n) {
        return n + 1;
    }

    // Allowed range is 0..4
    jsBegin() {
        return 0;
    }

    jsEnd() {
        return 5; // one more than the last allowed value
    }

    jsRbegin() {
        return 4;
    }

    jsRend() {
        return -1; // one less than the first allowed value
    }
}

describe('JsIterator tests', function() {

    it('forward iteration', function(done) {
        let c = new ContainerStub();
        let it = new JsIterator(c);
        let actual = [];
        while (true) {
            let res = it.next();
            if (res.done) {
                break;
            }
            actual.push(res.value);
        }
        let expected = [0, 1, 2, 3, 4];
        should.deepEqual(expected, actual);

        done();
    });

    it('backward iteration', function(done) {
        let c = new ContainerStub();
        let it = new JsReverseIterator(c);
        let actual = [];
        while (true) {
            let res = it.next();
            if (res.done) {
                break;
            }
            actual.push(res.value);
        }
        let expected = [4, 3, 2, 1, 0];
        should.deepEqual(expected, actual);

        done();
    });

    it('backward iteration using forward iterator', function(done) {
        let c = new ContainerStub();
        let it = new JsIterator(c);
        let actual = [];
        for (let v of it.backwards()) {
            actual.push(v);
        }
        let expected = [4, 3, 2, 1, 0];
        should.deepEqual(expected, actual);

        done();
    });

    it('forward iteration using backward iterator', function(done) {
        let c = new ContainerStub();
        let it = new JsReverseIterator(c);
        let actual = [];
        for (let v of it.backwards()) {
            actual.push(v);
        }
        let expected = [0, 1, 2, 3, 4];
        should.deepEqual(expected, actual);

        done();
    });
});