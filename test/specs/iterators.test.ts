import should from 'should';
import { describe, it } from 'vitest';

import { TreeIterator, ReverseIterator } from '../../src/iterators.js';

// Nodes are replaced with integers
class ContainerStubIterTest {
  prev(n: any): any {
    return n - 1;
  }

  next(n: any): any {
    return n + 1;
  }
}

describe('Iterator tests', function () {
  it('constructor; node and container', function () {
    const c = new ContainerStubIterTest();
    const iter = new TreeIterator(5, c);
    should.strictEqual(5, iter.node);
    should.strictEqual(c, iter.container);
  });

  it('constructor; copy of an Iterator', function () {
    const c = new ContainerStubIterTest();
    const iter = new TreeIterator(5, c);
    const iter1 = new TreeIterator(iter);
    should.strictEqual(5, iter1.node);
    should.strictEqual(c, iter1.container);
  });

  it('constructor; copy of a ReverseIterator', function () {
    const c = new ContainerStubIterTest();
    const iter = new ReverseIterator(5, c);
    const iter1 = new TreeIterator(iter);
    should.strictEqual(6, iter1.node);
    should.strictEqual(c, iter1.container);
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
    const c = new ContainerStubIterTest();
    const iter = new TreeIterator(5, c);
    iter.next();
    should.strictEqual(6, iter.node);
    should.strictEqual(c, iter.container);
  });

  it('prev', function () {
    const c = new ContainerStubIterTest();
    const iter = new TreeIterator(5, c);
    iter.prev();
    should.strictEqual(4, iter.node);
    should.strictEqual(c, iter.container);
  });
});

describe('ReverseIterator tests', function () {
  it('constructor; node and container', function () {
    const c = new ContainerStubIterTest();
    const iter = new ReverseIterator(5, c);
    should.strictEqual(5, iter.node);
    should.strictEqual(c, iter.container);
  });

  it('constructor; copy of an ReverseIterator', function () {
    const c = new ContainerStubIterTest();
    const iter = new ReverseIterator(5, c);
    const iter1 = new ReverseIterator(iter);
    should.strictEqual(5, iter1.node);
    should.strictEqual(c, iter1.container);
  });

  it('constructor; copy of a Iterator', function () {
    const c = new ContainerStubIterTest();
    const iter = new TreeIterator(5, c);
    const iter1 = new ReverseIterator(iter);
    should.strictEqual(4, iter1.node);
    should.strictEqual(c, iter1.container);
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
    const c = new ContainerStubIterTest();
    const iter = new ReverseIterator(5, c);
    iter.next();
    should.strictEqual(4, iter.node);
    should.strictEqual(c, iter.container);
  });

  it('prev', function () {
    const c = new ContainerStubIterTest();
    const iter = new ReverseIterator(5, c);
    iter.prev();
    should.strictEqual(6, iter.node);
    should.strictEqual(c, iter.container);
  });
});

describe('BaseIterator tests', function () {
  it('equals; same node', function () {
    const c = new ContainerStubIterTest();
    const it1 = new TreeIterator(5, c);
    const it2 = new TreeIterator(5, c);
    should.ok(it1.equals(it2));
    should.ok(it2.equals(it1));
  });

  it('equals; different nodes', function () {
    const c = new ContainerStubIterTest();
    const it1 = new TreeIterator(4, c);
    const it2 = new TreeIterator(5, c);
    should.ok(!it1.equals(it2));
    should.ok(!it2.equals(it1));
  });

  it('equals; different containers', function () {
    const c1 = new ContainerStubIterTest();
    const c2 = new ContainerStubIterTest();
    const it1 = new TreeIterator(4, c1);
    const it2 = new TreeIterator(5, c2);
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
    const c1 = new ContainerStubIterTest();
    const c2 = new ContainerStubIterTest();
    const it1 = new TreeIterator(4, c1);
    const it2 = new ReverseIterator(5, c2);
    try {
      it1.equals(it2);
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(
        msg.includes('instance of r') ||
          msg.includes('instance of TreeIterator'),
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
        msg.includes('instance of r') ||
          msg.includes('instance of TreeIterator'),
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
    const c = new ContainerStubIterTest();
    const iter = new TreeIterator(4, c);
    try {
      // @ts-expect-error: TS2345
      iter.equals('test');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(
        msg.includes('instance of r') ||
          msg.includes('instance of TreeIterator'),
        msg
      );
      should.ok(msg.includes('String'), msg);
    }
  });
});
