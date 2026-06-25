import assert from 'node:assert/strict';

import should from 'should';
import { describe, it } from 'vitest';

import { TreeMultiMap } from '../../src/tree-multimap.js';

describe('TreeMultiMap tests', function () {
  it('constructor;', function () {
    const m = new TreeMultiMap();
    should.equal(m.size, 0);
  });

  it('constructor; array literal', function () {
    const m = new TreeMultiMap([
      [2, 'B'],
      [2, 'A'],
      [3, 'C'],
    ]);
    should.equal(m.size, 3);

    const actual = [];
    for (const [k, v] of m) {
      actual.push([k, v]);
    }

    const expected = [
      [2, 'B'],
      [2, 'A'],
      [3, 'C'],
    ];
    should.deepEqual(expected, actual);
  });

  it('constructor; ES6 map', function () {
    const jsMap = new Map([
      [2, 'B'],
      [1, 'A'],
      [3, 'C'],
    ]);
    const m = new TreeMultiMap(jsMap);
    should.equal(m.size, 3);

    const actual = [];
    for (const [k, v] of m) {
      actual.push([k, v]);
    }

    const expected = [
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ];
    should.deepEqual(expected, actual);
  });

  it('constructor; generator function', function () {
    function* gen(): Generator<[number, string], void, number> {
      for (let i = 1; i < 4; ++i) {
        yield [i, `N${i * 2}`];
      }
    }
    const m = new TreeMultiMap(gen());
    should.equal(m.size, 3);

    const actual = [];
    for (const [k, v] of m) {
      actual.push([k, v]);
    }

    const expected = [
      [1, 'N2'],
      [2, 'N4'],
      [3, 'N6'],
    ];
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

    const m: TreeMultiMap<Id, string> = new TreeMultiMap();
    m.compareFunc = compareIds;
    m.set(new Id('B', 8), 'Book with id B8');
    m.set(new Id('A', 340), 'Book with id A340');
    m.set(new Id('A', 12), 'Book with id A12');
    m.set(new Id('A', 12), 'Another book with id A12');
    m.set({ alpha: 'AA', num: 147 }, 'Book with id AA147'); // create an ad-hoc object

    const actual: [string, number, string][] = [];
    for (const [k, v] of m) {
      actual.push([k.alpha, k.num, v]);
    }
    const expected = [
      ['A', 12, 'Book with id A12'],
      ['A', 12, 'Another book with id A12'],
      ['A', 340, 'Book with id A340'],
      ['AA', 147, 'Book with id AA147'],
      ['B', 8, 'Book with id B8'],
    ];
    should.deepEqual(expected, actual);
  });

  it('constructor; invalid literal', function () {
    try {
      new TreeMultiMap(35 as unknown as Iterable<[number, string]>);
      assert(false, 'The error was not detected');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('iterable objects'), msg);
    }
  });

  it('constructor; null', function () {
    const m = new TreeMultiMap(null as unknown as Iterable<[number, string]>);
    should.equal(m.size, 0);
  });

  it('constructor; undefined', function () {
    const m = new TreeMultiMap(undefined);
    should.equal(m.size, 0);
  });

  it('toStringTag', function () {
    const expected = '[object TreeMultiMap]';
    const actual = Object.prototype.toString.call(new TreeMultiMap());
    should.strictEqual(expected, actual);
  });

  it('species; on object', function () {
    const map = new TreeMultiMap();
    const constrFunc = Object.getPrototypeOf(map).constructor[Symbol.species];
    const map2 = new constrFunc();
    should.ok(map2 instanceof TreeMultiMap);
  });

  it('species; on class', function () {
    const ctr = TreeMultiMap[Symbol.species];
    const actual = new ctr();
    should.ok(actual instanceof TreeMultiMap);
  });

  it('clear', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    map.clear();
    should.equal(map.size, 0);
  });

  it('delete', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [2, 'C'],
      [3, 'D'],
    ]);
    map.delete(2);
    let expected = '{1:A,2:C,3:D}';
    should.equal(map.toString(), expected);
    map.delete(2);
    expected = '{1:A,3:D}';
    should.equal(map.toString(), expected);
    map.delete(4);
    should.equal(map.toString(), expected);
  });

  it('entries', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    const actual = [];
    for (const [key, value] of map.entries()) {
      actual.push([key, value]);
    }
    const expected = [
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ];
    should.deepEqual(expected, actual);
  });

  it('forEach', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    const actual: [number, string][] = [];
    map.forEach(function (value: string, key: number, _container: any) {
      actual.push([key, value]);
    });
    const expected = [
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ];
    should.deepEqual(expected, actual);
  });

  it('get', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    should.equal(map.get(1), 'A');
    should.equal(map.get(4), undefined);
  });

  it('has', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    should.equal(map.has(1), true);
    should.equal(map.has(4), false);
  });

  it('keys', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    const actual = [];
    for (const key of map.keys()) {
      actual.push(key);
    }
    const expected = [1, 2, 3];
    should.deepEqual(expected, actual);
  });

  it('values', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    const actual = [];
    for (const value of map.values()) {
      actual.push(value);
    }
    const expected = ['A', 'B', 'C'];
    should.deepEqual(expected, actual);
  });

  it('backward', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    const actual = [];
    for (const [key, value] of map.backwards()) {
      actual.push([key, value]);
    }
    const expected = [
      [3, 'C'],
      [2, 'B'],
      [1, 'A'],
    ];
    should.deepEqual(expected, actual);
  });

  it('begin/end', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    const actual = [];
    for (let iter = map.begin(); !iter.equals(map.end()); iter.next()) {
      actual.push([iter.key, iter.value]);
    }
    const expected = [
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ];
    should.deepEqual(expected, actual);
  });

  it('rbegin/rend', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    const actual = [];
    for (let iter = map.rbegin(); !iter.equals(map.rend()); iter.next()) {
      actual.push([iter.key, iter.value]);
    }
    const expected = [
      [3, 'C'],
      [2, 'B'],
      [1, 'A'],
    ];
    should.deepEqual(expected, actual);
  });

  it('find', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    let iter = map.find(2);
    should.equal(iter.key, 2);
    should.equal(iter.value, 'B');

    iter = map.find(4);
    should.ok(iter.equals(map.end()));
  });

  it('lowerBound / upperBound', function () {
    const map = new TreeMultiMap();
    for (let i = 1; i <= 16; ++i) {
      map.set(i * 2, `N${i}`);
    }
    const actual = [];
    const from = map.lowerBound(0);
    const to = map.upperBound(50);
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
    const m = new TreeMultiMap();
    for (let i = 1; i < 4; ++i) {
      const res = m.insertUnique(1, `N${i}`);
      if (i === 1) {
        should.ok(res.wasAdded);
        should.ok(!res.wasReplaced);
        should.strictEqual(1, res.iterator!.key);
        should.strictEqual('N1', res.iterator!.value);
      } else {
        should.ok(!res.wasAdded);
        should.ok(!res.wasReplaced);
      }
    }
    should.equal(m.size, 1);
  });

  it('insertOrUpdate', function () {
    const m = new TreeMultiMap();
    for (let i = 1; i < 4; ++i) {
      const res = m.insertOrReplace(1, `N${i}`);
      if (i === 1) {
        should.ok(res.wasAdded);
        should.ok(!res.wasReplaced);
        should.strictEqual(1, res.iterator!.key);
        should.strictEqual(`N${i}`, res.iterator!.value);
      } else {
        should.ok(!res.wasAdded);
        should.ok(res.wasReplaced);
        should.strictEqual(1, res.iterator!.key);
        should.strictEqual(`N${i}`, res.iterator!.value);
      }
    }
    should.equal(m.size, 1);
  });

  it('insertMulti', function () {
    const m = new TreeMultiMap();
    for (let i = 1; i < 4; ++i) {
      const res = m.insertMulti(1, `N${i}`);
      should.ok(res.wasAdded);
      should.ok(!res.wasReplaced);
      should.strictEqual(1, res.iterator!.key);
      should.strictEqual(`N${i}`, res.iterator!.value);
    }
    should.equal(m.size, 3);
  });

  it('erase', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [2, 'B'],
      [3, 'C'],
    ]);
    const iter = map.find(2);
    iter.prev();
    map.erase(iter);
    const expected = '{2:B,3:C}';
    should.equal(map.toString(), expected);
    map.delete(4);
    should.equal(map.toString(), expected);
  });

  it('first / last', function () {
    const map = new TreeMultiMap([
      [1, 'A'],
      [1, 'B'],
      [1, 'C'],
    ]);
    should.strictEqual('A', map.first()![1]);
    should.strictEqual('C', map.last()![1]);
  });

  it('first / last; empty map', function () {
    const map = new TreeMultiMap([]);
    should.strictEqual(undefined, map.first());
    should.strictEqual(undefined, map.last());
  });
});
