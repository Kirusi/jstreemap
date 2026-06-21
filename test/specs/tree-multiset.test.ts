import { describe, it } from 'vitest'
import should from 'should';
import assert from 'node:assert/strict';
import { TreeMultiSet } from '../../src/tree-multiset.js';

// When runing in the browser, then JStreeMap, Mocha and Should are already preloaded.
/*
if (process) {
  // Running inside NodeJS
  let lib;
  if (process.env.DEV_TEST) {
    // Use source code
    lib = require('../../src/public/tree-multiset');
  } else {
    // use web-packed library
    lib = require('../../jstreemap');
  }

  TreeMultiSet = lib.TreeMultiSet;
  require('should');
}
*/

describe('TreeMultiSet tests', function () {
  it('constructor;', function () {
    let m = new TreeMultiSet();
    should.equal(m.size, 0);
  });

  it('constructor; array literal', function () {
    let m = new TreeMultiSet([1, 2, 3, 1]);
    should.equal(m.size, 4);

    let actual = [];
    for (let k of m) {
      actual.push(k);
    }

    let expected = [1, 1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('constructor; ES6 set', function () {
    let jsSet = new Set([2, 1, 3]);
    let m = new TreeMultiSet(jsSet);
    should.equal(m.size, 3);

    let actual = [];
    for (let k of m) {
      actual.push(k);
    }

    let expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('constructor; generator function', function () {
    let gen = function* () {
      for (let i = 1; i < 4; ++i) {
        yield i;
        yield i;
      }
    };
    let m = new TreeMultiSet(gen());
    should.equal(m.size, 6);

    let actual = [];
    for (let k of m) {
      actual.push(k);
    }

    let expected = [1, 1, 2, 2, 3, 3];
    should.deepEqual(expected, actual);
  });

  it('compareFunc', function () {
    /* Test ability to compare alphanumeric structures like ['A',123]
           First string portion is compared. If string portions of two objects are equal then numeric portions are compared */
    class Id {
      public alpha: string;
      public num: number;

      constructor(a: string, n: number) {
        this.alpha = a;
        this.num = n;
      }
    }

    function compareIds(idLhs: Id, idRhs: Id) {
      if (idLhs.alpha < idRhs.alpha) {
        return -1;
      } else if (idLhs.alpha > idRhs.alpha) {
        return 1;
      } else {
        if (idLhs.num < idRhs.num) {
          return -1;
        } else if (idLhs.num > idRhs.num) {
          return 1;
        } else {
          return 0;
        }
      }
    }

    let m = new TreeMultiSet<Id>();
    m.compareFunc = compareIds;
    m.add(new Id('B', 8));
    m.add(new Id('A', 340));
    m.add(new Id('A', 340));
    m.add(new Id('A', 12));
    m.add({ alpha: 'AA', num: 147 }); // create an ad-hoc object

    let actual: [string, number][] = [];
    for (let k of m) {
      actual.push([k.alpha, k.num]);
    }
    let expected = [
      ['A', 12],
      ['A', 340],
      ['A', 340],
      ['AA', 147],
      ['B', 8],
    ];
    should.deepEqual(expected, actual);
  });

  it('constructor; invalid literal', function () {
    try {
      new TreeMultiSet(35 as unknown as number[]);
      assert(false, 'The error was not detected');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('iterable objects'), msg);
    }
  });

  it('constructor; null', function () {
    let m = new TreeMultiSet(null as unknown as number[]);
    should.equal(m.size, 0);
  });

  it('constructor; null', function () {
    let m = new TreeMultiSet(undefined);
    should.equal(m.size, 0);
  });

  it('toStringTag', function () {
    let expected = '[object TreeMultiSet]';
    let actual = Object.prototype.toString.call(new TreeMultiSet());
    should.strictEqual(expected, actual);
  });

  it('species; on object', function () {
    let set = new TreeMultiSet();
    let constrFunc = Object.getPrototypeOf(set).constructor[Symbol.species];
    let set2 = new constrFunc();
    should.ok(set2 instanceof TreeMultiSet);
  });

  it('species; on class', function () {
    let ctr = TreeMultiSet[Symbol.species];
    let actual = new ctr();
    should.ok(actual instanceof TreeMultiSet);
  });

  it('clear', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    set.clear();
    should.equal(set.size, 0);
  });

  it('delete', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    set.delete(2);
    let expected = '{1,3}';
    should.equal(set.toString(), expected);
    set.delete(4);
    should.equal(set.toString(), expected);
  });

  it('entries', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    let actual = [];
    for (let key of set.entries()) {
      actual.push(key);
    }
    let expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('forEach', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    let actual: [number, number][] = [];
    set.forEach(function (value: number, key: number, _container: any) {
      actual.push([key, value]);
    });
    let expected = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];
    should.deepEqual(expected, actual);
  });

  it('has', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    should.equal(set.has(1), true);
    should.equal(set.has(4), false);
  });

  it('keys', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    let actual = [];
    for (let key of set.keys()) {
      actual.push(key);
    }
    let expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('values', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    let actual = [];
    for (let value of set.values()) {
      actual.push(value);
    }
    let expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('backward', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    let actual = [];
    for (let key of set.backward()) {
      actual.push(key);
    }
    let expected = [3, 2, 1];
    should.deepEqual(expected, actual);
  });

  it('begin/end', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    let actual = [];
    for (let it = set.begin(); !it.equals(set.end()); it.next()) {
      actual.push(it.key);
    }
    let expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('rbegin/rend', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    let actual = [];
    for (let it = set.rbegin(); !it.equals(set.rend()); it.next()) {
      actual.push(it.key);
    }
    let expected = [3, 2, 1];
    should.deepEqual(expected, actual);
  });

  it('find', function () {
    let set = new TreeMultiSet([1, 2, 3]);
    let it = set.find(2);
    should.equal(it.key, 2);

    it = set.find(4);
    should.ok(it.equals(set.end()));
  });

  it('lowerBound / upperBound', function () {
    let set = new TreeMultiSet<number>();
    for (let i = 1; i <= 16; ++i) {
      set.add(i * 2);
    }
    let actual = [];
    let from = set.lowerBound(0);
    let to = set.upperBound(50);
    let it = to;
    while (!it.equals(from)) {
      it.prev();
      actual.push(it.key);
    }
    let expected = [32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
    should.deepEqual(expected, actual);
  });

  it('insertUnique', function () {
    let set = new TreeMultiSet();
    for (let i = 1; i < 4; ++i) {
      let res = set.insertUnique(1);
      if (i === 1) {
        should.ok(res.wasAdded);
        should.ok(!res.wasReplaced);
        should.strictEqual(1, res.iterator!.key);
      } else {
        should.ok(!res.wasAdded);
        should.ok(!res.wasReplaced);
      }
    }
    should.equal(set.size, 1);
  });

  it('insertOrUpdate', function () {
    let set = new TreeMultiSet();
    for (let i = 1; i < 4; ++i) {
      let res = set.insertOrReplace(1);
      if (i === 1) {
        should.ok(res.wasAdded);
        should.ok(!res.wasReplaced);
        should.strictEqual(1, res.iterator!.key);
      } else {
        should.ok(!res.wasAdded);
        should.ok(res.wasReplaced);
        should.strictEqual(1, res.iterator!.key);
      }
    }
    should.equal(set.size, 1);
  });

  it('insertMulti', function () {
    let set = new TreeMultiSet();
    for (let i = 1; i < 4; ++i) {
      let res = set.insertMulti(1);
      should.ok(res.wasAdded);
      should.ok(!res.wasReplaced);
      should.strictEqual(1, res.iterator!.key);
    }
    should.equal(set.size, 3);
  });

  it('erase', function () {
    let map = new TreeMultiSet([1, 2, 3]);
    let it = map.find(2);
    it.prev();
    map.erase(it);
    let expected = '{2,3}';
    should.equal(map.toString(), expected);
    map.delete(4);
    should.equal(map.toString(), expected);
  });

  it('first / last', function () {
    let set = new TreeMultiSet([1, 1, 2, 3, 3]);
    should.strictEqual(1, set.first());
    should.strictEqual(3, set.last());
  });

  it('first / last; empty set', function () {
    let set = new TreeMultiSet([]);
    should.strictEqual(undefined, set.first());
    should.strictEqual(undefined, set.last());
  });
});
