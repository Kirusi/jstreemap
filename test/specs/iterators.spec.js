/*global should Iterator ReverseIterator*/
// When runing in the browser, then JStreeMap, Mocha and Should are already preloaded.
if (process) {
    // Running inside NodeJS
    let lib;
    if (process.env.DEV_TEST) {
        // Use source code
        lib = require('../../src/public/iterators');
    }
    else {
        // use web-packed library
        lib = require('../../jstreemap');
    }
    // eslint-disable-next-line no-global-assign
    Iterator = lib.Iterator;
    // eslint-disable-next-line no-global-assign
    ReverseIterator = lib.ReverseIterator;
    require('should');
}

// Nodes are replaced with integers
class ContainerStubIterTest {
    prev(n) {
        return n - 1;
    }

    next(n) {
        return n + 1;
    }
}

describe('Iterator tests', function() {

    it('constructor; node and container', function(done) {
        let c = new ContainerStubIterTest();
        let it = new Iterator(5, c);
        should.strictEqual(5, it.node);
        should.strictEqual(c, it.container);

        done();
    });

    it('constructor; copy of an Iterator', function(done) {
        let c = new ContainerStubIterTest();
        let it = new Iterator(5, c);
        let it1 = new Iterator(it);
        should.strictEqual(5, it1.node);
        should.strictEqual(c, it1.container);

        done();
    });

    it('constructor; copy of a ReverseIterator', function(done) {
        let c = new ContainerStubIterTest();
        let it = new ReverseIterator(5, c);
        let it1 = new Iterator(it);
        should.strictEqual(6, it1.node);
        should.strictEqual(c, it1.container);

        done();
    });

    it('constructor; too many paramaters', function(done) {
        try {
            let it = new Iterator('test', 'test', 'test');
            should.fail('Constructor should have failed');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('provided parameters'), msg);
        }
        done();
    });

    it('constructor; invalid copy request', function(done) {
        try {
            let it = new Iterator('test');
            should.fail('Constructor should have failed');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('Iterator'), msg);
            should.ok(msg.includes('String'), msg);
        }
        done();
    });

    it('next', function(done) {
        let c = new ContainerStubIterTest();
        let it = new Iterator(5, c);
        it.next();
        should.strictEqual(6, it.node);
        should.strictEqual(c, it.container);

        done();
    });

    it('prev', function(done) {
        let c = new ContainerStubIterTest();
        let it = new Iterator(5, c);
        it.prev();
        should.strictEqual(4, it.node);
        should.strictEqual(c, it.container);

        done();
    });
});

describe('ReverseIterator tests', function() {

    it('constructor; node and container', function(done) {
        let c = new ContainerStubIterTest();
        let it = new ReverseIterator(5, c);
        should.strictEqual(5, it.node);
        should.strictEqual(c, it.container);

        done();
    });

    it('constructor; copy of an ReverseIterator', function(done) {
        let c = new ContainerStubIterTest();
        let it = new ReverseIterator(5, c);
        let it1 = new ReverseIterator(it);
        should.strictEqual(5, it1.node);
        should.strictEqual(c, it1.container);

        done();
    });

    it('constructor; copy of a Iterator', function(done) {
        let c = new ContainerStubIterTest();
        let it = new Iterator(5, c);
        let it1 = new ReverseIterator(it);
        should.strictEqual(4, it1.node);
        should.strictEqual(c, it1.container);

        done();
    });

    it('constructor; too many paramaters', function(done) {
        try {
            let it = new ReverseIterator('test', 'test', 'test');
            should.fail('Constructor should have failed');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('provided parameters'), msg);
        }
        done();
    });

    it('constructor; invalid copy request', function(done) {
        try {
            let it = new ReverseIterator('test');
            should.fail('Constructor should have failed');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('ReverseIterator'), msg);
            should.ok(msg.includes('String'), msg);
        }
        done();
    });

    it('next', function(done) {
        let c = new ContainerStubIterTest();
        let it = new ReverseIterator(5, c);
        it.next();
        should.strictEqual(4, it.node);
        should.strictEqual(c, it.container);

        done();
    });

    it('prev', function(done) {
        let c = new ContainerStubIterTest();
        let it = new ReverseIterator(5, c);
        it.prev();
        should.strictEqual(6, it.node);
        should.strictEqual(c, it.container);

        done();
    });
});

describe('BaseIterator tests', function() {

    it('equals; same node', function(done) {
        let c = new ContainerStubIterTest();
        let it1 = new Iterator(5, c);
        let it2 = new Iterator(5, c);
        should.ok(it1.equals(it2));
        should.ok(it2.equals(it1));

        done();
    });

    it('equals; different nodes', function(done) {
        let c = new ContainerStubIterTest();
        let it1 = new Iterator(4, c);
        let it2 = new Iterator(5, c);
        should.ok(!it1.equals(it2));
        should.ok(!it2.equals(it1));

        done();
    });

    it('equals; different containers', function(done) {
        let c1 = new ContainerStubIterTest();
        let c2 = new ContainerStubIterTest();
        let it1 = new Iterator(4, c1);
        let it2 = new Iterator(5, c2);
        try {
            it1.equals(it2);
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('different containers'), msg);
        }
        try {
            it2.equals(it1);
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('different containers'), msg);
        }

        done();
    });

    it('equals; different types of iterators', function(done) {
        let c1 = new ContainerStubIterTest();
        let c2 = new ContainerStubIterTest();
        let it1 = new Iterator(4, c1);
        let it2 = new ReverseIterator(5, c2);
        try {
            it1.equals(it2);
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('Iterator'), msg);
            should.ok(msg.includes('ReverseIterator'), msg);
        }
        try {
            it2.equals(it1);
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('Iterator'), msg);
            should.ok(msg.includes('ReverseIterator'), msg);
        }

        done();
    });

    it('equals; comparison to non-iterator object', function(done) {
        let c = new ContainerStubIterTest();
        let it = new Iterator(4, c);
        try {
            it.equals('test');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('Iterator'), msg);
            should.ok(msg.includes('String'), msg);
        }

        done();
    });
});
