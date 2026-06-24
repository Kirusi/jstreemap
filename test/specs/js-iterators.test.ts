import should from 'should';
import { describe, it } from 'vitest';

import { JsIterator, JsReverseIterator } from '../../src/js-iterators.js';
import { TreeNode } from '../../src/tree-node.js';

class NodeIsValuePolicy<K, V> {
  fetch(n: TreeNode<K, V>): TreeNode<K, V> {
    return n;
  }
}

// Nodes are replaced with integers
class ContainerStubJsIterTest {
  public valuePolicy: any;
  constructor() {
    this.valuePolicy = new NodeIsValuePolicy();
  }

  prev(n: any): any {
    return n - 1;
  }

  next(n: any): any {
    return n + 1;
  }

  // Allowed range is 0..4
  jsBegin(): number {
    return 0;
  }

  jsEnd(): number {
    return 5; // one more than the last allowed value
  }

  jsRbegin(): number {
    return 4;
  }

  jsRend(): number {
    return -1; // one less than the first allowed value
  }
}

describe('JsIterator tests', function () {
  it('forward iteration', function () {
    const c = new ContainerStubJsIterTest();
    const iter = new JsIterator(c);
    const actual = [];
    while (true) {
      const res = iter.next();
      if (res.done) {
        break;
      }
      actual.push(res.value);
    }
    const expected = [0, 1, 2, 3, 4];
    should.deepEqual(expected, actual);
  });

  it('backward iteration', function () {
    const c = new ContainerStubJsIterTest();
    const iter = new JsReverseIterator(c);
    const actual = [];
    while (true) {
      const res = iter.next();
      if (res.done) {
        break;
      }
      actual.push(res.value);
    }
    const expected = [4, 3, 2, 1, 0];
    should.deepEqual(expected, actual);
  });

  it('backward iteration using forward iterator', function () {
    const c = new ContainerStubJsIterTest();
    const iter = new JsIterator(c);
    const actual = [];
    for (const v of iter.backwards()) {
      actual.push(v);
    }
    const expected = [4, 3, 2, 1, 0];
    should.deepEqual(expected, actual);
  });

  it('forward iteration using backward iterator', function () {
    const c = new ContainerStubJsIterTest();
    const iter = new JsReverseIterator(c);
    const actual = [];
    for (const v of iter.backwards()) {
      actual.push(v);
    }
    const expected = [0, 1, 2, 3, 4];
    should.deepEqual(expected, actual);
  });
});
