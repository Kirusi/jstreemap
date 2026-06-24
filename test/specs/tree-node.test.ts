import should from 'should';
import { describe, it } from 'vitest';

import { TreeNode } from '../../src/tree-node.js';

describe('TreeNode tests', function () {
  it('Node.grandparent; no parent', function () {
    const n = new TreeNode();
    const actual = n.grandparent();
    const expected = null;
    should.strictEqual(expected, actual);
  });

  it('Node.grandparent; no grandparent', function () {
    const p = new TreeNode();
    const n = new TreeNode();
    n.parent = p;
    const actual = n.grandparent();
    const expected = null;
    should.strictEqual(expected, actual);
  });

  it('Node.grandparent; valid grandparent', function () {
    const g = new TreeNode();
    const p = new TreeNode();
    const n = new TreeNode();
    p.parent = g;
    n.parent = p;
    const actual = n.grandparent();
    should.strictEqual(g, actual);
  });

  it('Node.sibling; no parent', function () {
    const n = new TreeNode();
    const actual = n.sibling();
    const expected = null;
    should.strictEqual(expected, actual);
  });

  it('Node.sibling; left sibling', function () {
    const p = new TreeNode();
    const n = new TreeNode();
    const s = new TreeNode();
    p.left = s;
    p.right = n;
    n.parent = p;
    s.parent = p;
    const actual = n.sibling();
    const expected = s;
    should.strictEqual(expected, actual);
  });

  it('Node.sibling; right sibling', function () {
    const p = new TreeNode();
    const n = new TreeNode();
    const s = new TreeNode();
    p.left = n;
    p.right = s;
    n.parent = p;
    s.parent = p;
    const actual = n.sibling();
    const expected = s;
    should.strictEqual(expected, actual);
  });

  it('Node.uncle; no parent', function () {
    const n = new TreeNode();
    const actual = n.uncle();
    const expected = null;
    should.strictEqual(expected, actual);
  });

  it('Node.uncle; no grandparent', function () {
    const p = new TreeNode();
    const n = new TreeNode();
    n.parent = p;
    const actual = n.uncle();
    const expected = null;
    should.strictEqual(expected, actual);
  });

  it('Node.uncle; valid uncle', function () {
    const g = new TreeNode();
    const p = new TreeNode();
    const u = new TreeNode();
    const n = new TreeNode();
    n.parent = p;
    p.left = n;
    p.parent = g;
    u.parent = g;
    g.left = p;
    g.right = u;
    const actual = n.uncle();
    const expected = u;
    should.strictEqual(expected, actual);
  });
});
