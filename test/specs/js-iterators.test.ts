import { describe, it } from 'vitest'
import should from 'should';
import { JsIterator, JsReverseIterator } from '../../src/js-iterators.js';
import { TreeNode } from '../../src/tree-node.js';

// When runing in the browser, then JStreeMap, Mocha and Should are already preloaded.
/*
if (process) {
  // Running inside NodeJS
  let lib;
  if (process.env.DEV_TEST) {
    // Use source code
    lib = require('../../src/public/js-iterators');
  } else {
    // use web-packed library
    lib = require('../../jstreemap');
  }

  JsIterator = lib.JsIterator;

  JsReverseIterator = lib.JsReverseIterator;
  require('should');
}
*/

class NodeIsValuePolicy<K, V> {
  fetch(n: TreeNode<K, V>) {
    return n;
  }
}

// Nodes are replaced with integers
class ContainerStubJsIterTest {
  public valuePolicy: any;
  constructor() {
    this.valuePolicy = new NodeIsValuePolicy();
  }

  prev(n: any) {
    return n - 1;
  }

  next(n: any) {
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

describe('JsIterator tests', function () {
  it('forward iteration', function () {
    let c = new ContainerStubJsIterTest();
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
  });

  it('backward iteration', function () {
    let c = new ContainerStubJsIterTest();
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
  });

  it('backward iteration using forward iterator', function () {
    let c = new ContainerStubJsIterTest();
    let it = new JsIterator(c);
    let actual = [];
    for (let v of it.backwards()) {
      actual.push(v);
    }
    let expected = [4, 3, 2, 1, 0];
    should.deepEqual(expected, actual);
  });

  it('forward iteration using backward iterator', function () {
    let c = new ContainerStubJsIterTest();
    let it = new JsReverseIterator(c);
    let actual = [];
    for (let v of it.backwards()) {
      actual.push(v);
    }
    let expected = [0, 1, 2, 3, 4];
    should.deepEqual(expected, actual);
  });
});
