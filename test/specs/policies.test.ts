import { describe, it } from 'vitest'
import { TreeNode } from '../../src/tree-node.js';
import {
  KeyOnlyPolicy,
  ValueOnlyPolicy,
  KeyValuePolicy,
} from '../../src/policies.js';

import should from 'should';


if (process.env.DEV_TEST) {
  /*
  const { TreeNode } = require('../../src/internal/tree-node');
  const {
    KeyOnlyPolicy,
    ValueOnlyPolicy,
    KeyValuePolicy,
  } = require('../../src/internal/policies');

  const should = require('should');
  const assert = require('assert');
  */

  describe('Policy tests', function () {
    it('KeyOnlyPolicy; fetch', function () {
      let p = new KeyOnlyPolicy();
      let n = new TreeNode();
      n.key = 'a';
      let actual = p.fetch(n);
      let expected = 'a';
      should.equal(actual, expected);
    });

    it('KeyOnlyPolicy; copy', function () {
      let p = new KeyOnlyPolicy();
      let nSrc = new TreeNode();
      nSrc.key = 'a';
      let nDst = new TreeNode();
      p.copy(nDst, nSrc);
      let actual = p.fetch(nDst);
      let expected = 'a';
      should.equal(actual, expected);
    });

    it('KeyOnlyPolicy; toString', function () {
      let p = new KeyOnlyPolicy();
      let n = new TreeNode();
      n.key = 'a';
      let actual = p.toString(n);
      let expected = 'a';
      should.equal(actual, expected);
    });

    it('KeyOnlyPolicy; toString, null key', function () {
      let p = new KeyOnlyPolicy();
      let n = new TreeNode();
      n.key = null;
      let actual = p.toString(n);
      let expected = 'null';
      should.equal(actual, expected);
    });

    it('KeyOnlyPolicy; toString, undefined key', function () {
      let p = new KeyOnlyPolicy();
      let n = new TreeNode();
      n.key = undefined;
      let actual = p.toString(n);
      let expected = 'undefined';
      should.equal(actual, expected);
    });

    it('ValueOnlyPolicy; fetch', function () {
      let p = new ValueOnlyPolicy();
      let n = new TreeNode();
      n.value = 'a';
      let actual = p.fetch(n);
      let expected = 'a';
      should.equal(actual, expected);
    });

    it('ValueOnlyPolicy; copy', function () {
      let p = new ValueOnlyPolicy();
      let nSrc = new TreeNode();
      nSrc.value = 'a';
      let nDst = new TreeNode();
      p.copy(nDst, nSrc);
      let actual = p.fetch(nDst);
      let expected = 'a';
      should.equal(actual, expected);
    });

    it('ValueOnlyPolicy; toString', function () {
      let p = new ValueOnlyPolicy();
      let n = new TreeNode();
      n.value = 'a';
      let actual = p.toString(n);
      let expected = 'a';
      should.equal(actual, expected);
    });

    it('ValueOnlyPolicy; toString, null value', function () {
      let p = new ValueOnlyPolicy();
      let n = new TreeNode();
      n.value = null;
      let actual = p.toString(n);
      let expected = 'null';
      should.equal(actual, expected);
    });

    it('ValueOnlyPolicy; toString, undefined value', function () {
      let p = new ValueOnlyPolicy();
      let n = new TreeNode();
      //n.value = 'a';
      let actual = p.toString(n);
      let expected = 'undefined';
      should.equal(actual, expected);
    });

    it('KeyValuePolicy; fetch', function () {
      let p = new KeyValuePolicy();
      let n = new TreeNode();
      n.key = 1;
      n.value = 'a';
      let actual = p.fetch(n);
      let expected = [1, 'a'];
      should.deepEqual(expected, actual);
    });

    it('KeyValuePolicy; copy', function () {
      let p = new KeyValuePolicy();
      let nSrc = new TreeNode();
      nSrc.key = 1;
      nSrc.value = 'a';
      let nDst = new TreeNode();
      p.copy(nDst, nSrc);
      let [actualKey, actualValue] = p.fetch(nDst);
      let [expectedKey, expectedValue] = [1, 'a'];
      should.equal(actualKey, expectedKey);
      should.equal(actualValue, expectedValue);
    });

    it('KeyValuePolicy; toString', function () {
      let p = new KeyValuePolicy();
      let n = new TreeNode();
      n.key = 1;
      n.value = 'a';
      let actual = p.toString(n);
      let expected = '1:a';
      should.equal(actual, expected);
    });

    it('KeyValuePolicy; toString, null key, null value', function () {
      let p = new KeyValuePolicy();
      let n = new TreeNode();
      n.key = null;
      n.value = null;
      let actual = p.toString(n);
      let expected = 'null:null';
      should.equal(actual, expected);
    });

    it('KeyValuePolicy; toString, undefined key, undefined value', function () {
      let p = new KeyValuePolicy();
      let n = new TreeNode();
      n.key = undefined;
      // n.value = null;
      let actual = p.toString(n);
      let expected = 'undefined:undefined';
      should.equal(actual, expected);
    });
  });
}
