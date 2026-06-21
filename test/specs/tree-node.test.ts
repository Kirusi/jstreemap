import { TreeNode } from '../../src/tree-node.js';

import should from 'should';
import { describe, it } from 'vitest'

// @ts-ignore: TS2591
if (process.env.DEV_TEST) {

  describe('TreeNode tests', function () {
    it('Node.grandparent; no parent', function () {
      let n = new TreeNode();
      let actual = n.grandparent();
      let expected = null;
      should.strictEqual(expected, actual);
    });

    it('Node.grandparent; no grandparent', function () {
      let p = new TreeNode();
      let n = new TreeNode();
      n.parent = p;
      let actual = n.grandparent();
      let expected = null;
      should.strictEqual(expected, actual);
    });

    it('Node.grandparent; valid grandparent', function () {
      let g = new TreeNode();
      let p = new TreeNode();
      let n = new TreeNode();
      p.parent = g;
      n.parent = p;
      let actual = n.grandparent();
      should.strictEqual(g, actual);
    });

    it('Node.sibling; no parent', function () {
      let n = new TreeNode();
      let actual = n.sibling();
      let expected = null;
      should.strictEqual(expected, actual);
    });

    it('Node.sibling; left sibling', function () {
      let p = new TreeNode();
      let n = new TreeNode();
      let s = new TreeNode();
      p.left = s;
      p.right = n;
      n.parent = p;
      s.parent = p;
      let actual = n.sibling();
      let expected = s;
      should.strictEqual(expected, actual);
    });

    it('Node.sibling; right sibling', function () {
      let p = new TreeNode();
      let n = new TreeNode();
      let s = new TreeNode();
      p.left = n;
      p.right = s;
      n.parent = p;
      s.parent = p;
      let actual = n.sibling();
      let expected = s;
      should.strictEqual(expected, actual);
    });

    it('Node.uncle; no parent', function () {
      let n = new TreeNode();
      let actual = n.uncle();
      let expected = null;
      should.strictEqual(expected, actual);
    });

    it('Node.uncle; no grandparent', function () {
      let p = new TreeNode();
      let n = new TreeNode();
      n.parent = p;
      let actual = n.uncle();
      let expected = null;
      should.strictEqual(expected, actual);
    });

    it('Node.uncle; valid uncle', function () {
      let g = new TreeNode();
      let p = new TreeNode();
      let u = new TreeNode();
      let n = new TreeNode();
      n.parent = p;
      p.left = n;
      p.parent = g;
      u.parent = g;
      g.left = p;
      g.right = u;
      let actual = n.uncle();
      let expected = u;
      should.strictEqual(expected, actual);
    });
  });
}
