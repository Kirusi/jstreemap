import assert from 'node:assert/strict';

import should from 'should';
import { describe, it } from 'vitest';

import { TreeSet } from '../../src/tree-set.js';

describe('TreeSet tests', function () {
  it('constructor;', function () {
    const set = new TreeSet();
    should.equal(set.size, 0);
  });

  it('constructor; array literal', function () {
    const set = new TreeSet([1, 2, 3]);
    should.equal(set.size, 3);

    const actual = [];
    for (const k of set) {
      actual.push(k);
    }

    const expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('constructor; ES6 set', function () {
    const jsSet = new Set([2, 1, 3]);
    const set = new TreeSet(jsSet);
    should.equal(set.size, 3);

    const actual = [];
    for (const k of set) {
      actual.push(k);
    }

    const expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('constructor; generator function', function () {
    function* gen(): Generator<number, void, number> {
      for (let i = 1; i < 4; ++i) {
        yield i;
      }
    }
    const set = new TreeSet(gen());
    should.equal(set.size, 3);

    const actual = [];
    for (const k of set) {
      actual.push(k);
    }

    const expected = [1, 2, 3];
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

    function compareIds(idLhs: Id, idRhs: Id): number {
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

    const set: TreeSet<Id> = new TreeSet();
    set.compareFunc = compareIds;
    set.add(new Id('B', 8));
    set.add(new Id('A', 340));
    set.add(new Id('A', 12));
    set.add({ alpha: 'AA', num: 147 }); // create an ad-hoc object

    const actual = [];
    for (const k of set) {
      actual.push([k.alpha, k.num]);
    }
    const expected = [
      ['A', 12],
      ['A', 340],
      ['AA', 147],
      ['B', 8],
    ];
    should.deepEqual(expected, actual);
  });

  it('constructor; invalid literal', function () {
    try {
      new TreeSet<number>(35 as unknown as number[]);
      assert(false, 'The error was not detected');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('iterable objects'), msg);
    }
  });

  it('constructor; null', function () {
    const set = new TreeSet(null as unknown as number[]);
    should.equal(set.size, 0);
  });

  it('constructor; undefined', function () {
    const set = new TreeSet(undefined);
    should.equal(set.size, 0);
  });

  it('toStringTag', function () {
    const expected = '[object TreeSet]';
    const actual = Object.prototype.toString.call(new TreeSet());
    should.strictEqual(expected, actual);
  });

  it('species; on object', function () {
    const set = new TreeSet();
    const constrFunc = Object.getPrototypeOf(set).constructor[Symbol.species];
    const set2 = new constrFunc();
    should.ok(set2 instanceof TreeSet);
  });

  it('species; on class', function () {
    const ctr = TreeSet[Symbol.species];
    const actual = new ctr();
    should.ok(actual instanceof TreeSet);
  });

  it('clear', function () {
    const set = new TreeSet([1, 2, 3]);
    set.clear();
    should.equal(set.size, 0);
  });

  it('delete', function () {
    const set = new TreeSet([1, 2, 3]);
    set.delete(2);
    const expected = '{1,3}';
    should.equal(set.toString(), expected);
    set.delete(4);
    should.equal(set.toString(), expected);
  });

  it('delete; rightmost and root', function () {
    const set = new TreeSet([1, 5, 3]);
    set.delete(5);
    set.delete(3);
    set.add(4);
    const expected = '{1,4}';
    should.equal(set.toString(), expected);
  });

  it('delete; leftmost and root', function () {
    const set = new TreeSet([1, 5, 3]);
    set.delete(1);
    set.delete(3);
    set.add(2);
    const expected = '{2,5}';
    should.equal(set.toString(), expected);
  });

  it('entries', function () {
    const set = new TreeSet([1, 2, 3]);
    const actual = [];
    for (const key of set.entries()) {
      actual.push(key);
    }
    const expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('forEach', function () {
    const set: TreeSet<number> = new TreeSet([1, 2, 3]);
    const actual: number[][] = [];
    set.forEach(function (value: number, key: number, _container: any) {
      actual.push([key, value]);
    });
    const expected = [
      [1, 1],
      [2, 2],
      [3, 3],
    ];
    should.deepEqual(expected, actual);
  });

  it('has', function () {
    const set = new TreeSet([1, 2, 3]);
    should.equal(set.has(1), true);
    should.equal(set.has(4), false);
  });

  it('keys', function () {
    const set = new TreeSet([1, 2, 3]);
    const actual = [];
    for (const key of set.keys()) {
      actual.push(key);
    }
    const expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('values', function () {
    const set = new TreeSet([1, 2, 3]);
    const actual = [];
    for (const value of set.values()) {
      actual.push(value);
    }
    const expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('backward', function () {
    const set = new TreeSet([1, 2, 3]);
    const actual = [];
    for (const key of set.backwards()) {
      actual.push(key);
    }
    const expected = [3, 2, 1];
    should.deepEqual(expected, actual);
  });

  it('begin/end', function () {
    const set = new TreeSet([1, 2, 3]);
    const actual = [];
    for (let iter = set.begin(); !iter.equals(set.end()); iter.next()) {
      actual.push(iter.key);
    }
    const expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('rbegin/rend', function () {
    const set = new TreeSet([1, 2, 3]);
    const actual = [];
    for (let iter = set.rbegin(); !iter.equals(set.rend()); iter.next()) {
      actual.push(iter.key);
    }
    const expected = [3, 2, 1];
    should.deepEqual(expected, actual);
  });

  it('find', function () {
    const set = new TreeSet([1, 2, 3]);
    let iter = set.find(2);
    should.equal(iter.key, 2);

    iter = set.find(4);
    should.ok(iter.equals(set.end()));
  });

  it('lowerBound / upperBound', function () {
    const set: TreeSet<number> = new TreeSet();
    for (let i = 1; i <= 16; ++i) {
      set.add(i * 2);
    }
    const actual = [];
    const from = set.lowerBound(0);
    const to = set.upperBound(50);
    const iter = to;
    while (!iter.equals(from)) {
      iter.prev();
      actual.push(iter.key);
    }
    const expected = [
      32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2,
    ];
    should.deepEqual(expected, actual);
  });

  it('insertUnique', function () {
    const set = new TreeSet();
    for (let i = 1; i < 4; ++i) {
      const res = set.insertUnique(1);
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
    const set = new TreeSet();
    for (let i = 1; i < 4; ++i) {
      const res = set.insertOrReplace(1);
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

  it('erase', function () {
    const map = new TreeSet([1, 2, 3]);
    const iter = map.find(2);
    iter.prev();
    map.erase(iter);
    const expected = '{2,3}';
    should.equal(map.toString(), expected);
    map.delete(4);
    should.equal(map.toString(), expected);
  });

  it('first / last', function () {
    const set = new TreeSet([1, 2, 3]);
    should.strictEqual(1, set.first());
    should.strictEqual(3, set.last());
  });

  it('first / last; empty set', function () {
    const set = new TreeSet([]);
    should.strictEqual(undefined, set.first());
    should.strictEqual(undefined, set.last());
  });
});
