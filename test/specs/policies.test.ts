import should from 'should';
import { describe, it } from 'vitest';

import {
  KeyOnlyPolicy,
  ValueOnlyPolicy,
  KeyValuePolicy,
} from '../../src/policies.js';
import { TreeNode } from '../../src/tree-node.js';

describe('Policy tests', function () {
  it('KeyOnlyPolicy; fetch', function () {
    const p = new KeyOnlyPolicy();
    const n = new TreeNode();
    n.key = 'a';
    const actual = p.fetch(n);
    const expected = 'a';
    should.equal(actual, expected);
  });

  it('KeyOnlyPolicy; copy', function () {
    const p = new KeyOnlyPolicy();
    const nSrc = new TreeNode();
    nSrc.key = 'a';
    const nDst = new TreeNode();
    p.copy(nDst, nSrc);
    const actual = p.fetch(nDst);
    const expected = 'a';
    should.equal(actual, expected);
  });

  it('KeyOnlyPolicy; toString', function () {
    const p = new KeyOnlyPolicy();
    const n = new TreeNode();
    n.key = 'a';
    const actual = p.toString(n);
    const expected = 'a';
    should.equal(actual, expected);
  });

  it('KeyOnlyPolicy; toString, null key', function () {
    const p = new KeyOnlyPolicy();
    const n = new TreeNode();
    n.key = null;
    const actual = p.toString(n);
    const expected = 'null';
    should.equal(actual, expected);
  });

  it('KeyOnlyPolicy; toString, undefined key', function () {
    const p = new KeyOnlyPolicy();
    const n = new TreeNode();
    n.key = undefined;
    const actual = p.toString(n);
    const expected = 'undefined';
    should.equal(actual, expected);
  });

  it('ValueOnlyPolicy; fetch', function () {
    const p = new ValueOnlyPolicy();
    const n = new TreeNode();
    n.value = 'a';
    const actual = p.fetch(n);
    const expected = 'a';
    should.equal(actual, expected);
  });

  it('ValueOnlyPolicy; copy', function () {
    const p = new ValueOnlyPolicy();
    const nSrc = new TreeNode();
    nSrc.value = 'a';
    const nDst = new TreeNode();
    p.copy(nDst, nSrc);
    const actual = p.fetch(nDst);
    const expected = 'a';
    should.equal(actual, expected);
  });

  it('ValueOnlyPolicy; toString', function () {
    const p = new ValueOnlyPolicy();
    const n = new TreeNode();
    n.value = 'a';
    const actual = p.toString(n);
    const expected = 'a';
    should.equal(actual, expected);
  });

  it('ValueOnlyPolicy; toString, null value', function () {
    const p = new ValueOnlyPolicy();
    const n = new TreeNode();
    n.value = null;
    const actual = p.toString(n);
    const expected = 'null';
    should.equal(actual, expected);
  });

  it('ValueOnlyPolicy; toString, undefined value', function () {
    const p = new ValueOnlyPolicy();
    const n = new TreeNode();
    //n.value = 'a';
    const actual = p.toString(n);
    const expected = 'undefined';
    should.equal(actual, expected);
  });

  it('KeyValuePolicy; fetch', function () {
    const p = new KeyValuePolicy();
    const n = new TreeNode();
    n.key = 1;
    n.value = 'a';
    const actual = p.fetch(n);
    const expected = [1, 'a'];
    should.deepEqual(expected, actual);
  });

  it('KeyValuePolicy; copy', function () {
    const p = new KeyValuePolicy();
    const nSrc = new TreeNode();
    nSrc.key = 1;
    nSrc.value = 'a';
    const nDst = new TreeNode();
    p.copy(nDst, nSrc);
    const [actualKey, actualValue] = p.fetch(nDst);
    const [expectedKey, expectedValue] = [1, 'a'];
    should.equal(actualKey, expectedKey);
    should.equal(actualValue, expectedValue);
  });

  it('KeyValuePolicy; toString', function () {
    const p = new KeyValuePolicy();
    const n = new TreeNode();
    n.key = 1;
    n.value = 'a';
    const actual = p.toString(n);
    const expected = '1:a';
    should.equal(actual, expected);
  });

  it('KeyValuePolicy; toString, null key, null value', function () {
    const p = new KeyValuePolicy();
    const n = new TreeNode();
    n.key = null;
    n.value = null;
    const actual = p.toString(n);
    const expected = 'null:null';
    should.equal(actual, expected);
  });

  it('KeyValuePolicy; toString, undefined key, undefined value', function () {
    const p = new KeyValuePolicy();
    const n = new TreeNode();
    n.key = undefined;
    // n.value = null;
    const actual = p.toString(n);
    const expected = 'undefined:undefined';
    should.equal(actual, expected);
  });
});
