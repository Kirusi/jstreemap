import { describe, it } from 'vitest'
import should from 'should';
import { TreeIterator, ReverseIterator } from '../../src/iterators.js';

/*global should Iterator ReverseIterator*/
// When runing in the browser, then JStreeMap, Mocha and Should are already preloaded.
// @ts-ignore: TS2591
if (process) {
  // Running inside NodeJS
  // let lib;
  /*
  if (process.env.DEV_TEST) {
    // Use source code
    lib = require('../../src/public/iterators');
  } else {
    // use web-packed library
    lib = require('../../jstreemap');
  }

  Iterator = lib.Iterator;
  ReverseIterator = lib.ReverseIterator;
  */
}

// Nodes are replaced with integers
class ContainerStubIterTest {
  prev(n: any) {
    return n - 1;
  }

  next(n: any) {
    return n + 1;
  }
}

describe('Iterator tests', function () {
  it('constructor; node and container', function () {
    let c = new ContainerStubIterTest();
    let it = new TreeIterator(5, c);
    should.strictEqual(5, it.node);
    should.strictEqual(c, it.container);
  });

  it('constructor; copy of an Iterator', function () {
    let c = new ContainerStubIterTest();
    let it = new TreeIterator(5, c);
    let it1 = new TreeIterator(it);
    should.strictEqual(5, it1.node);
    should.strictEqual(c, it1.container);
  });

  it('constructor; copy of a ReverseIterator', function () {
    let c = new ContainerStubIterTest();
    let it = new ReverseIterator(5, c);
    let it1 = new TreeIterator(it);
    should.strictEqual(6, it1.node);
    should.strictEqual(c, it1.container);
  });

  it('constructor; too many paramaters', function () {
    try {
      new TreeIterator('test', 'test', 'test');
      // @ts-expect-error: TS2554
      should.fail('Constructor should have failed');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('provided parameters'), msg);
    }
  });

  it('constructor; invalid copy request', function () {
    try {
      new TreeIterator('test');
      // @ts-expect-error: TS2554
      should.fail('Constructor should have failed');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('Iterator'), msg);
      should.ok(msg.includes('String'), msg);
    }
  });

  it('next', function () {
    let c = new ContainerStubIterTest();
    let it = new TreeIterator(5, c);
    it.next();
    should.strictEqual(6, it.node);
    should.strictEqual(c, it.container);
  });

  it('prev', function () {
    let c = new ContainerStubIterTest();
    let it = new TreeIterator(5, c);
    it.prev();
    should.strictEqual(4, it.node);
    should.strictEqual(c, it.container);
  });
});

describe('ReverseIterator tests', function () {
  it('constructor; node and container', function () {
    let c = new ContainerStubIterTest();
    let it = new ReverseIterator(5, c);
    should.strictEqual(5, it.node);
    should.strictEqual(c, it.container);
  });

  it('constructor; copy of an ReverseIterator', function () {
    let c = new ContainerStubIterTest();
    let it = new ReverseIterator(5, c);
    let it1 = new ReverseIterator(it);
    should.strictEqual(5, it1.node);
    should.strictEqual(c, it1.container);
  });

  it('constructor; copy of a Iterator', function () {
    let c = new ContainerStubIterTest();
    let it = new TreeIterator(5, c);
    let it1 = new ReverseIterator(it);
    should.strictEqual(4, it1.node);
    should.strictEqual(c, it1.container);
  });

  it('constructor; too many paramaters', function () {
    try {
      new ReverseIterator('test', 'test', 'test');
      // @ts-expect-error: TS2554
      should.fail('Constructor should have failed');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('provided parameters'), msg);
    }
  });

  it('constructor; invalid copy request', function () {
    try {
      new ReverseIterator('test');
      // @ts-expect-error: TS2554
      should.fail('Constructor should have failed');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('ReverseIterator'), msg);
      should.ok(msg.includes('String'), msg);
    }
  });

  it('next', function () {
    let c = new ContainerStubIterTest();
    let it = new ReverseIterator(5, c);
    it.next();
    should.strictEqual(4, it.node);
    should.strictEqual(c, it.container);
  });

  it('prev', function () {
    let c = new ContainerStubIterTest();
    let it = new ReverseIterator(5, c);
    it.prev();
    should.strictEqual(6, it.node);
    should.strictEqual(c, it.container);
  });
});

describe('BaseIterator tests', function () {
  it('equals; same node', function () {
    let c = new ContainerStubIterTest();
    let it1 = new TreeIterator(5, c);
    let it2 = new TreeIterator(5, c);
    should.ok(it1.equals(it2));
    should.ok(it2.equals(it1));
  });

  it('equals; different nodes', function () {
    let c = new ContainerStubIterTest();
    let it1 = new TreeIterator(4, c);
    let it2 = new TreeIterator(5, c);
    should.ok(!it1.equals(it2));
    should.ok(!it2.equals(it1));
  });

  it('equals; different containers', function () {
    let c1 = new ContainerStubIterTest();
    let c2 = new ContainerStubIterTest();
    let it1 = new TreeIterator(4, c1);
    let it2 = new TreeIterator(5, c2);
    try {
      it1.equals(it2);
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('different containers'), msg);
    }
    try {
      it2.equals(it1);
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('different containers'), msg);
    }
  });

  it('equals; different types of iterators', function () {
    let c1 = new ContainerStubIterTest();
    let c2 = new ContainerStubIterTest();
    let it1 = new TreeIterator(4, c1);
    let it2 = new ReverseIterator(5, c2);
    try {
      it1.equals(it2);
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(
        msg.includes('instance of r') || msg.includes('instance of TreeIterator'),
        msg
      );
      should.ok(
        msg.includes('instance of i') ||
        msg.includes('instance of ReverseIterator'),
        msg
      );
    }
    try {
      it2.equals(it1);
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(
        msg.includes('instance of r') || msg.includes('instance of TreeIterator'),
        msg
      );
      should.ok(
        msg.includes('instance of i') ||
        msg.includes('instance of ReverseIterator'),
        msg
      );
    }
  });

  it('equals; comparison to non-iterator object', function () {
    let c = new ContainerStubIterTest();
    let it = new TreeIterator(4, c);
    try {
      // @ts-expect-error: TS2345
      it.equals('test');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(
        msg.includes('instance of r') || msg.includes('instance of TreeIterator'),
        msg
      );
      should.ok(msg.includes('String'), msg);
    }
  });
});
