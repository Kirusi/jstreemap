import assert from 'node:assert/strict';

import should from 'should';
import { describe, it } from 'vitest';
// ts-expect-error: TS2591

import { ReverseIterator } from '../../src/iterators.js';
import { KeyValuePolicy } from '../../src/policies.js';
import { TreeNode, Head, NodeColors } from '../../src/tree-node.js';
import { Tree } from '../../src/tree.js';

class TestNode extends TreeNode<number, any> {
  public id: string;

  constructor(id: string) {
    super();
    this.id = id;
  }
}

function createNode(id: string): TestNode {
  const n = new TestNode(id);
  return n;
}

function setPointers(
  node: TestNode,
  p: TestNode | null,
  l: TestNode | null,
  r: TestNode | null,
  c?: number
): void {
  node.parent = p;
  node.left = l;
  node.right = r;
  if (c !== undefined) {
    node.color = c;
  }
}

function createErrorMsg(
  node: Head<number, any> | TestNode,
  label: string,
  expected: TestNode,
  actual: TestNode
): string {
  const expectedLabel = expected === null ? 'null' : expected.id;
  const actualLabel = actual === null ? 'null' : actual.id;
  const nodeId = node.id || 'head';
  const msg = `Invalid node '${nodeId}'. Wrong '${label}' member. Expected: '${expectedLabel}'. Actual: '${actualLabel}'.`;
  return msg;
}

function validatePointers(
  node: TestNode,
  p: TestNode | null,
  l: TestNode | null,
  r: TestNode | null,
  k?: any,
  c?: number
): void {
  should.ok(
    node.parent === p,
    createErrorMsg(node, 'parent', p!, node.parent as TestNode)
  );
  should.ok(
    node.left === l,
    createErrorMsg(node, 'left', l!, node.left as TestNode)
  );
  should.ok(
    node.right === r,
    createErrorMsg(node, 'right', r!, node.right as TestNode)
  );
  if (k !== undefined) {
    should.ok(
      node.key === k,
      `Invalid key on node '${node.id}'. expected: '${k}', actual: '${node.key}'`
    );
  }
  if (c !== undefined) {
    should.ok(
      node.color === c,
      `Invalid color on node '${node.id}'. expected: '${c}', actual: '${node.color}'`
    );
  }
}

function validateHead(
  head: Head<number, any>,
  root: TestNode,
  l: TestNode,
  r: TestNode,
  s: number
): void {
  should.ok(
    head.root === root,
    createErrorMsg(head, 'root', root, head.root as TestNode)
  );
  should.ok(
    head.leftmost === l,
    createErrorMsg(head, 'leftmost', l, head.leftmost as TestNode)
  );
  should.ok(
    head.rightmost === r,
    createErrorMsg(head, 'rightmost', r, head.rightmost as TestNode)
  );
  should.ok(
    head.size === s,
    `Invalid size. expected: '${s}', actual: '${head.size}'`
  );
}

function addNodes(t: any, ...keys: any[]): TestNode[] {
  const nodes = [];
  for (const k of keys) {
    const n = createNode(k);
    n.key = k;
    t.insertNode(n);
    nodes.push(n);
  }
  return nodes;
}

function buildTree(...keys: any[]): any[] {
  const t = new Tree();
  const nodes = addNodes(t, ...keys);
  return [t, ...nodes];
}

describe('Compare tests', function () {
  it('numbers', function () {
    should.equal(Tree.compare(5, 6), -1);
    should.equal(Tree.compare(-2, -2), 0);
    should.equal(Tree.compare(6, -5), 1);
  });

  it('strings', function () {
    should.equal(Tree.compare('A', 'a'), -1);
    should.equal(Tree.compare('abc', 'abc'), 0);
    should.equal(Tree.compare('Abcd', 'Abc'), 1);
  });
});

describe('Tree tests', function () {
  it('constructor', function () {
    const t = new Tree();
    // @ts-expect-error: TS2345
    validateHead(t.head, t.head, t.head, t.head, 0);
  });

  it('size', function () {
    const t = new Tree();
    t.head.size = 5;
    should.equal(t.size(), 5);
  });

  it('replaceNode; root', function () {
    const p = new TestNode('1');
    const n = new TestNode('2');
    const t: Tree<number, any> = new Tree();
    t.head.root = p;
    t.head.leftmost = p;
    t.head.rightmost = p;
    t.head.size = 1;
    t.replaceNode(p, n);
    validateHead(t.head, n, p, p, 1);
    validatePointers(p, null, null, null, undefined);
    validatePointers(n, null, null, null, undefined);
  });

  it('replaceNode; left child', function () {
    const p = createNode('p');
    const l = createNode('l');
    const r = createNode('r');
    const n = createNode('n');
    setPointers(p, null, l, r);
    setPointers(l, p, null, null);
    setPointers(r, p, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = p;
    t.head.leftmost = l;
    t.head.rightmost = r;
    t.head.size = 3;
    t.replaceNode(l, n);
    validateHead(t.head, p, l, r, 3);
    validatePointers(p, null, n, r);
    validatePointers(l, p, null, null);
    validatePointers(r, p, null, null);
    validatePointers(n, p, null, null);
  });

  it('replaceNode; right child', function () {
    const p = createNode('p');
    const l = createNode('l');
    const r = createNode('r');
    const n = createNode('n');
    setPointers(p, null, l, r);
    setPointers(l, p, null, null);
    setPointers(r, p, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = p;
    t.head.leftmost = l;
    t.head.rightmost = r;
    t.head.size = 3;
    t.replaceNode(r, n);
    validateHead(t.head, p, l, r, 3);
    validatePointers(p, null, l, n);
    validatePointers(l, p, null, null);
    validatePointers(r, p, null, null);
    validatePointers(n, p, null, null);
  });

  it('replaceNode; itself', function () {
    const p = createNode('p');
    const l = createNode('l');
    const r = createNode('r');
    setPointers(p, null, l, r);
    setPointers(l, p, null, null);
    setPointers(r, p, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = p;
    t.head.leftmost = l;
    t.head.rightmost = r;
    t.head.size = 3;
    t.replaceNode(r, r);
    validateHead(t.head, p, l, r, 3);
    validatePointers(p, null, l, r);
    validatePointers(l, p, null, null);
    validatePointers(r, p, null, null);
  });

  it('replaceNode; null', function () {
    const p = createNode('p');
    const l = createNode('l');
    const r = createNode('r');
    setPointers(p, null, l, r);
    setPointers(l, p, null, null);
    setPointers(r, p, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = p;
    t.head.leftmost = l;
    t.head.rightmost = r;
    t.head.size = 3;
    t.replaceNode(r, null);
    validateHead(t.head, p, l, r, 3);
    validatePointers(p, null, l, null);
    validatePointers(l, p, null, null);
    validatePointers(r, p, null, null);
  });

  it('rotateLeft; all nodes', function () {
    const p = createNode('p');
    const n = createNode('n');
    const X = createNode('X');
    const Y = createNode('Y');
    const a = createNode('a');
    const b = createNode('b');
    const c = createNode('c');
    setPointers(p, null, Y, n);
    setPointers(n, p, null, null);
    setPointers(X, Y, b, c);
    setPointers(Y, p, a, X);
    setPointers(a, Y, null, null);
    setPointers(b, X, null, null);
    setPointers(c, X, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = p;
    t.head.leftmost = a;
    t.head.rightmost = n;
    t.head.size = 7;
    t.rotateLeft(Y);
    validateHead(t.head, p, a, n, 7);
    validatePointers(p, null, X, n);
    validatePointers(n, p, null, null);
    validatePointers(X, p, Y, c);
    validatePointers(Y, X, a, b);
    validatePointers(a, Y, null, null);
    validatePointers(b, Y, null, null);
    validatePointers(c, X, null, null);
  });

  it('rotateLeft; all nodes', function () {
    const p = createNode('p');
    const n = createNode('n');
    const X = createNode('X');
    const Y = createNode('Y');
    const a = createNode('a');
    const b = createNode('b');
    const c = createNode('c');
    setPointers(p, null, n, Y);
    setPointers(n, p, null, null);
    setPointers(X, Y, b, c);
    setPointers(Y, p, a, X);
    setPointers(a, Y, null, null);
    setPointers(b, X, null, null);
    setPointers(c, X, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = p;
    t.head.leftmost = n;
    t.head.rightmost = c;
    t.head.size = 7;
    t.rotateLeft(Y);
    validateHead(t.head, p, n, c, 7);
    validatePointers(p, null, n, X);
    validatePointers(n, p, null, null);
    validatePointers(X, p, Y, c);
    validatePointers(Y, X, a, b);
    validatePointers(a, Y, null, null);
    validatePointers(b, Y, null, null);
    validatePointers(c, X, null, null);
  });

  it('rotateLeft; 2 nodes', function () {
    const X = createNode('X');
    const Y = createNode('Y');
    setPointers(X, Y, null, null);
    setPointers(Y, null, null, X);
    const t: Tree<number, any> = new Tree();
    t.head.root = Y;
    t.head.leftmost = Y;
    t.head.rightmost = X;
    t.head.size = 2;
    t.rotateLeft(Y);
    validateHead(t.head, X, Y, X, 2);
    validatePointers(X, null, Y, null);
    validatePointers(Y, X, null, null);
  });

  it('rotateLeft; single node', function () {
    const X = createNode('X');
    setPointers(X, null, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = X;
    t.head.leftmost = X;
    t.head.rightmost = X;
    t.head.size = 1;
    try {
      t.rotateLeft(X);
      assert(false, 'The error was not detected');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('rotateLeft'));
      should.ok(msg.includes('corrupted'));
    }
  });

  it('rotateRight; all nodes', function () {
    const p = createNode('p');
    const n = createNode('n');
    const X = createNode('X');
    const Y = createNode('Y');
    const a = createNode('a');
    const b = createNode('b');
    const c = createNode('c');
    setPointers(p, null, X, n);
    setPointers(n, p, null, null);
    setPointers(X, p, Y, c);
    setPointers(Y, X, a, b);
    setPointers(a, Y, null, null);
    setPointers(b, Y, null, null);
    setPointers(c, X, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = p;
    t.head.leftmost = a;
    t.head.rightmost = n;
    t.head.size = 7;
    t.rotateRight(X);
    validateHead(t.head, p, a, n, 7);
    validatePointers(p, null, Y, n);
    validatePointers(n, p, null, null);
    validatePointers(X, Y, b, c);
    validatePointers(Y, p, a, X);
    validatePointers(a, Y, null, null);
    validatePointers(b, X, null, null);
    validatePointers(c, X, null, null);
  });

  it('rotateRight; all nodes', function () {
    const p = createNode('p');
    const n = createNode('n');
    const X = createNode('X');
    const Y = createNode('Y');
    const a = createNode('a');
    const b = createNode('b');
    const c = createNode('c');
    setPointers(p, null, n, X);
    setPointers(n, p, null, null);
    setPointers(X, p, Y, c);
    setPointers(Y, X, a, b);
    setPointers(a, Y, null, null);
    setPointers(b, Y, null, null);
    setPointers(c, X, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = p;
    t.head.leftmost = n;
    t.head.rightmost = c;
    t.head.size = 7;
    t.rotateRight(X);
    validateHead(t.head, p, n, c, 7);
    validatePointers(p, null, n, Y);
    validatePointers(n, p, null, null);
    validatePointers(X, Y, b, c);
    validatePointers(Y, p, a, X);
    validatePointers(a, Y, null, null);
    validatePointers(b, X, null, null);
    validatePointers(c, X, null, null);
  });

  it('rotateRight; 2 nodes', function () {
    const X = createNode('X');
    const Y = createNode('Y');
    setPointers(X, null, Y, null);
    setPointers(Y, X, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = X;
    t.head.leftmost = Y;
    t.head.rightmost = X;
    t.head.size = 2;
    t.rotateRight(X);
    validateHead(t.head, Y, Y, X, 2);
    validatePointers(X, Y, null, null);
    validatePointers(Y, null, null, X);
  });

  it('rotateRight; single node', function () {
    const X = createNode('X');
    setPointers(X, null, null, null);
    const t: Tree<number, any> = new Tree();
    t.head.root = X;
    t.head.leftmost = X;
    t.head.rightmost = X;
    t.head.size = 1;
    try {
      t.rotateRight(X);
      assert(false, 'The error was not detected');
    } catch (err) {
      const msg = (err as Error).message;
      should.ok(msg.includes('rotateRight'), msg);
      should.ok(msg.includes('corrupted'), msg);
    }
  });

  it('isLeaf', function () {
    const X = createNode('X');
    setPointers(X, null, null, null, NodeColors.BLACK);
    const t = new Tree();
    t.head.root = X;
    t.head.leftmost = X;
    t.head.rightmost = X;
    t.head.size = 1;
    should.ok(!t.isLeaf(X));
    should.ok(t.isLeaf(t.head));
    should.ok(t.isLeaf(null));
  });

  it('fetchColor', function () {
    const X = createNode('X');
    const Y = createNode('Y');
    setPointers(X, null, Y, null, NodeColors.BLACK);
    setPointers(Y, X, null, null, NodeColors.RED);
    const t = new Tree();
    t.head.root = X;
    t.head.leftmost = Y;
    t.head.rightmost = X;
    t.head.size = 2;
    should.equal(t.fetchColor(X), NodeColors.BLACK);
    should.equal(
      t.fetchColor(t.head as unknown as TreeNode<number, any>),
      NodeColors.BLACK
    );
    should.equal(
      t.fetchColor(null as unknown as TreeNode<number, any>),
      NodeColors.BLACK
    );
    should.equal(t.fetchColor(Y), NodeColors.RED);
    should.ok(t.isBlack(X));
    should.ok(t.isRed(Y));
  });

  it('insertNode; root; case 1', function () {
    const [t, n] = buildTree(2);

    validateHead(t.head, n, n, n, 1);
    validatePointers(n, null, t.head, t.head, 2, NodeColors.BLACK);
  });

  it('insertNode; root & left child; case 2', function () {
    const [t, n2, n1] = buildTree(2, 1);

    validateHead(t.head, n2, n1, n2, 2);
    validatePointers(n2, null, n1, t.head, 2, NodeColors.BLACK);
    validatePointers(n1, n2, t.head, null, 1, NodeColors.RED);
  });

  it('insertNode; root & right child; case 2', function () {
    const [t, n2, n3] = buildTree(2, 3);

    validateHead(t.head, n2, n2, n3, 2);
    validatePointers(n2, null, t.head, n3, 2, NodeColors.BLACK);
    validatePointers(n3, n2, null, t.head, 3, NodeColors.RED);
  });

  it('insertNode; 2,3,1,4; case 3', function () {
    const [t, n2, n3, n1, n4] = buildTree(2, 3, 1, 4);

    validateHead(t.head, n2, n1, n4, 4);
    validatePointers(n2, null, n1, n3, 2, NodeColors.BLACK);
    validatePointers(n3, n2, null, n4, 3, NodeColors.BLACK);
    validatePointers(n1, n2, t.head, null, 1, NodeColors.BLACK);
    validatePointers(n4, n3, null, t.head, 4, NodeColors.RED);
  });

  it('insertNode; 1,2,3; case 4', function () {
    const [t, n1, n2, n3] = buildTree(1, 2, 3);

    validateHead(t.head, n2, n1, n3, 3);
    validatePointers(n1, n2, t.head, null, 1, NodeColors.RED);
    validatePointers(n2, null, n1, n3, 2, NodeColors.BLACK);
    validatePointers(n3, n2, null, t.head, 3, NodeColors.RED);
  });

  it('insertNode; 1,3,2; case 4', function () {
    const [t, n1, n3, n2] = buildTree(1, 3, 2);

    validateHead(t.head, n2, n1, n3, 3);
    validatePointers(n1, n2, t.head, null, 1, NodeColors.RED);
    validatePointers(n2, null, n1, n3, 2, NodeColors.BLACK);
    validatePointers(n3, n2, null, t.head, 3, NodeColors.RED);
  });

  it('insertNode; 6,4,5; case 4', function () {
    const [t, n6, n4, n5] = buildTree(6, 4, 5);

    validateHead(t.head, n5, n4, n6, 3);
    validatePointers(n4, n5, t.head, null, 4, NodeColors.RED);
    validatePointers(n5, null, n4, n6, 5, NodeColors.BLACK);
    validatePointers(n6, n5, null, t.head, 6, NodeColors.RED);
  });

  it('insertNode; 1,2,3,4; case 4', function () {
    const [t, n1, n2, n3, n4] = buildTree(1, 2, 3, 4);

    validateHead(t.head, n2, n1, n4, 4);
    validatePointers(n1, n2, t.head, null, 1, NodeColors.BLACK);
    validatePointers(n2, null, n1, n3, 2, NodeColors.BLACK);
    validatePointers(n3, n2, null, n4, 3, NodeColors.BLACK);
    validatePointers(n4, n3, null, t.head, 4, NodeColors.RED);
  });

  it('insertNode; 1,2,3,4,5; case 4', function () {
    const [t, n1, n2, n3, n4, n5] = buildTree(1, 2, 3, 4, 5);

    validateHead(t.head, n2, n1, n5, 5);
    validatePointers(n1, n2, t.head, null, 1, NodeColors.BLACK);
    validatePointers(n2, null, n1, n4, 2, NodeColors.BLACK);
    validatePointers(n3, n4, null, null, 3, NodeColors.RED);
    validatePointers(n4, n2, n3, n5, 4, NodeColors.BLACK);
    validatePointers(n5, n4, null, t.head, 5, NodeColors.RED);
  });

  it('insertNode; 1,2,3,4,5,6; case 4', function () {
    const [t, n1, n2, n3, n4, n5, n6] = buildTree(1, 2, 3, 4, 5, 6);

    validateHead(t.head, n2, n1, n6, 6);
    validatePointers(n1, n2, t.head, null, 1, NodeColors.BLACK);
    validatePointers(n2, null, n1, n4, 2, NodeColors.BLACK);
    validatePointers(n3, n4, null, null, 3, NodeColors.BLACK);
    validatePointers(n4, n2, n3, n5, 4, NodeColors.RED);
    validatePointers(n5, n4, null, n6, 5, NodeColors.BLACK);
    validatePointers(n6, n5, null, t.head, 6, NodeColors.RED);
  });

  it('insertNode; 6,5,4,3,2,1; case 4', function () {
    const [t, n6, n5, n4, n3, n2, n1] = buildTree(6, 5, 4, 3, 2, 1);

    validateHead(t.head, n5, n1, n6, 6);
    validatePointers(n6, n5, null, t.head, 6, NodeColors.BLACK);
    validatePointers(n5, null, n3, n6, 5, NodeColors.BLACK);
    validatePointers(n4, n3, null, null, 4, NodeColors.BLACK);
    validatePointers(n3, n5, n2, n4, 3, NodeColors.RED);
    validatePointers(n2, n3, n1, null, 2, NodeColors.BLACK);
    validatePointers(n1, n2, t.head, null, 1, NodeColors.RED);
  });

  it('fetchMaximum', function () {
    const [t, n20, _n10, _n30, n15, n40, n17] = buildTree(
      20,
      10,
      30,
      15,
      40,
      17
    );

    should.equal(t.fetchMaximum(n20), n40);
    should.equal(t.fetchMaximum(n15), n17);
  });

  it('fetchMinimum', function () {
    const [t, n20, _n10, n30, n5, _n15, n25, _n35, _n27] = buildTree(
      20,
      10,
      30,
      5,
      15,
      25,
      35,
      27
    );

    should.equal(t.fetchMinimum(n20), n5);
    should.equal(t.fetchMinimum(n30), n25);
  });

  it('clear', function () {
    const [t] = buildTree(1, 2, 3);
    t.clear();
    validateHead(t.head, t.head, t.head, t.head, 0);
  });

  it('erase; null', function () {
    const t: Tree<number, any> = new Tree();
    t.erase(null as unknown as TreeNode<number, any>);
    validateHead(
      t.head,
      t.head as unknown as TestNode,
      t.head as unknown as TestNode,
      t.head as unknown as TestNode,
      0
    );
  });

  it('erase; head', function () {
    const t: Tree<number, any> = new Tree();
    t.erase(t.head as unknown as TestNode);
    validateHead(
      t.head,
      t.head as unknown as TestNode,
      t.head as unknown as TestNode,
      t.head as unknown as TestNode,
      0
    );
  });

  it('erase; case 1', function () {
    const [t, n2] = buildTree(2);
    t.erase(n2);
    validateHead(t.head, t.head, t.head, t.head, 0);
  });

  it('erase; replaced by leftmost child', function () {
    const [t, n2, _n1, n3] = buildTree(2, 1, 3);
    t.erase(n2);
    validateHead(t.head, n2, n2, n3, 2);
    validatePointers(n2, null, t.head, n3, 1, NodeColors.BLACK);
    validatePointers(n3, n2, null, t.head, 3, NodeColors.RED);
  });

  it('erase; delete leftmost child', function () {
    const [t, n2, n1, n3] = buildTree(2, 1, 3);
    t.erase(n1);
    validateHead(t.head, n2, n2, n3, 2);
    validatePointers(n2, null, t.head, n3, 2, NodeColors.BLACK);
    validatePointers(n3, n2, null, t.head, 3, NodeColors.RED);
  });

  it('erase; delete leftmost child 2', function () {
    const [t, n10, n8, n12, n6, n14] = buildTree(10, 8, 12, 6, 14);
    t.erase(n6);
    validateHead(t.head, n10, n8, n14, 4);
    validatePointers(n8, n10, t.head, null, 8, NodeColors.BLACK);
    validatePointers(n10, null, n8, n12, 10, NodeColors.BLACK);
    validatePointers(n12, n10, null, n14, 12, NodeColors.BLACK);
    validatePointers(n14, n12, null, t.head, 14, NodeColors.RED);
  });

  it('erase; delete leftmost and root, then root again', function () {
    const [t, n2, n1, n3] = buildTree(2, 1, 3);
    t.erase(n1);
    t.erase(n2);
    validateHead(t.head, n3, n3, n3, 1);
    validatePointers(n3, null, t.head, t.head, 3, NodeColors.BLACK);
    t.erase(n3);
    validateHead(t.head, t.head, t.head, t.head, 0);
  });

  it('erase; delete 2 nodes, order 1', function () {
    const [t, n1, n3] = buildTree(1, 3);
    t.erase(n1);
    t.erase(n3);
    validateHead(t.head, t.head, t.head, t.head, 0);
  });

  it('erase; delete 2 nodes, order 2', function () {
    const [t, n1, n3] = buildTree(1, 3);
    t.erase(n3);
    t.erase(n1);
    validateHead(t.head, t.head, t.head, t.head, 0);
  });

  it('erase; delete rightmost child', function () {
    const [t, n2, n1, n3] = buildTree(2, 1, 3);
    t.erase(n3);
    validateHead(t.head, n2, n1, n2, 2);
    validatePointers(n1, n2, t.head, null, 1, NodeColors.RED);
    validatePointers(n2, null, n1, t.head, 2, NodeColors.BLACK);
  });

  it('erase; delete rightmost child 2', function () {
    const [t, n10, n8, n12, n6, n14] = buildTree(10, 8, 12, 6, 14);
    t.erase(n14);
    validateHead(t.head, n10, n6, n12, 4);
    validatePointers(n6, n8, t.head, null, 6, NodeColors.RED);
    validatePointers(n8, n10, n6, null, 8, NodeColors.BLACK);
    validatePointers(n10, null, n8, n12, 10, NodeColors.BLACK);
    validatePointers(n12, n10, null, t.head, 12, NodeColors.BLACK);
  });

  it('erase; delete rightmost and root', function () {
    const [t, n2, n1, n3] = buildTree(2, 1, 3);
    t.erase(n3);
    t.erase(n2);
    validateHead(t.head, n1, n1, n1, 1);
    validatePointers(n1, null, t.head, t.head, 1, NodeColors.BLACK);
    t.erase(n1);
    validateHead(t.head, t.head, t.head, t.head, 0);
  });

  it('erase; delete node with a single left child', function () {
    const [t, n20, n10, n30, n25, n35, n22] = buildTree(20, 10, 30, 25, 35, 22);
    t.erase(n25);
    validateHead(t.head, n20, n10, n35, 5);
    validatePointers(n10, n20, t.head, null, 10, NodeColors.BLACK);
    validatePointers(n20, null, n10, n30, 20, NodeColors.BLACK);
    validatePointers(n22, n30, null, null, 22, NodeColors.RED);
    validatePointers(n30, n20, n22, n35, 30, NodeColors.BLACK);
    validatePointers(n35, n30, null, t.head, 35, NodeColors.RED);
  });

  it('erase; delete node with a single right child', function () {
    const [t, n20, n10, n30, n25, n35, n27] = buildTree(20, 10, 30, 25, 35, 27);
    t.erase(n25);
    validateHead(t.head, n20, n10, n35, 5);
    validatePointers(n10, n20, t.head, null, 10, NodeColors.BLACK);
    validatePointers(n20, null, n10, n30, 20, NodeColors.BLACK);
    validatePointers(n27, n30, null, null, 27, NodeColors.RED);
    validatePointers(n30, n20, n27, n35, 30, NodeColors.BLACK);
    validatePointers(n35, n30, null, t.head, 35, NodeColors.RED);
  });

  it('erase; cases 2, 4; left child', function () {
    const [t, n20, n10, n30, n5, n25, n35, n40] = buildTree(
      20,
      10,
      30,
      5,
      25,
      35,
      40
    );
    t.erase(n5);
    t.erase(n40);
    // validate initial state
    validateHead(t.head, n20, n10, n35, 5);
    validatePointers(n10, n20, t.head, null, 10, NodeColors.BLACK);
    validatePointers(n20, null, n10, n30, 20, NodeColors.BLACK);
    validatePointers(n25, n30, null, null, 25, NodeColors.BLACK);
    validatePointers(n30, n20, n25, n35, 30, NodeColors.RED);
    validatePointers(n35, n30, null, t.head, 35, NodeColors.BLACK);

    // case 2, which then becomes case 4
    t.erase(n10);
    validateHead(t.head, n30, n20, n35, 4);
    validatePointers(n20, n30, t.head, n25, 20, NodeColors.BLACK);
    validatePointers(n25, n20, null, null, 25, NodeColors.RED);
    validatePointers(n30, null, n20, n35, 30, NodeColors.BLACK);
    validatePointers(n35, n30, null, t.head, 35, NodeColors.BLACK);
  });

  it('erase; cases 2, 4; right child', function () {
    const [t, n20, n10, n30, n5, n15, n18] = buildTree(20, 10, 30, 5, 15, 18);
    t.erase(n18);
    // validate initial state
    validateHead(t.head, n20, n5, n30, 5);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, n20, n5, n15, 10, NodeColors.RED);
    validatePointers(n15, n10, null, null, 15, NodeColors.BLACK);
    validatePointers(n20, null, n10, n30, 20, NodeColors.BLACK);
    validatePointers(n30, n20, null, t.head, 30, NodeColors.BLACK);

    // case 2, which then becomes case 4
    t.erase(n30);
    validateHead(t.head, n10, n5, n20, 4);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, null, n5, n20, 10, NodeColors.BLACK);
    validatePointers(n15, n20, null, null, 15, NodeColors.RED);
    validatePointers(n20, n10, n15, t.head, 20, NodeColors.BLACK);
  });

  it('erase; cases 3, 5, 6; left child', function () {
    const [t, n20, n10, n30, n5, n15, n25, n35, n40] = buildTree(
      20,
      10,
      30,
      5,
      15,
      25,
      35,
      40
    );
    t.erase(n40);
    const [n12, n17, n16] = addNodes(t, 12, 17, 16);

    // validate initial state
    validateHead(t.head, n20, n5, n35, 10);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, n20, n5, n15, 10, NodeColors.BLACK);
    validatePointers(n12, n15, null, null, 12, NodeColors.BLACK);
    validatePointers(n15, n10, n12, n17, 15, NodeColors.RED);
    validatePointers(n16, n17, null, null, 16, NodeColors.RED);
    validatePointers(n17, n15, n16, null, 17, NodeColors.BLACK);
    validatePointers(n20, null, n10, n30, 20, NodeColors.BLACK);
    validatePointers(n25, n30, null, null, 25, NodeColors.BLACK);
    validatePointers(n30, n20, n25, n35, 30, NodeColors.BLACK);
    validatePointers(n35, n30, null, t.head, 35, NodeColors.BLACK);

    // case 3
    t.erase(n25);
    validateHead(t.head, n15, n5, n35, 9);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, n15, n5, n12, 10, NodeColors.BLACK);
    validatePointers(n12, n10, null, null, 12, NodeColors.BLACK);
    validatePointers(n15, null, n10, n20, 15, NodeColors.BLACK);
    validatePointers(n16, n17, null, null, 16, NodeColors.RED);
    validatePointers(n17, n20, n16, null, 17, NodeColors.BLACK);
    validatePointers(n20, n15, n17, n30, 20, NodeColors.BLACK);
    validatePointers(n30, n20, null, n35, 30, NodeColors.BLACK);
    validatePointers(n35, n30, null, t.head, 35, NodeColors.RED);
  });

  it('erase; cases 3, 5, 6; right child', function () {
    const [t, n20, n10, n30, n5, n15, n25, n35, n40] = buildTree(
      20,
      10,
      30,
      5,
      15,
      25,
      35,
      40
    );
    t.erase(n40);
    const [n12, n17, n16] = addNodes(t, 12, 17, 16);

    // validate initial state
    validateHead(t.head, n20, n5, n35, 10);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, n20, n5, n15, 10, NodeColors.BLACK);
    validatePointers(n12, n15, null, null, 12, NodeColors.BLACK);
    validatePointers(n15, n10, n12, n17, 15, NodeColors.RED);
    validatePointers(n16, n17, null, null, 16, NodeColors.RED);
    validatePointers(n17, n15, n16, null, 17, NodeColors.BLACK);
    validatePointers(n20, null, n10, n30, 20, NodeColors.BLACK);
    validatePointers(n25, n30, null, null, 25, NodeColors.BLACK);
    validatePointers(n30, n20, n25, n35, 30, NodeColors.BLACK);
    validatePointers(n35, n30, null, t.head, 35, NodeColors.BLACK);

    // case 3
    t.erase(n35);
    validateHead(t.head, n15, n5, n30, 9);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, n15, n5, n12, 10, NodeColors.BLACK);
    validatePointers(n12, n10, null, null, 12, NodeColors.BLACK);
    validatePointers(n15, null, n10, n20, 15, NodeColors.BLACK);
    validatePointers(n16, n17, null, null, 16, NodeColors.RED);
    validatePointers(n17, n20, n16, null, 17, NodeColors.BLACK);
    validatePointers(n20, n15, n17, n30, 20, NodeColors.BLACK);
    validatePointers(n25, n30, null, null, 25, NodeColors.RED);
    validatePointers(n30, n20, n25, t.head, 30, NodeColors.BLACK);
  });

  it('erase; cases 5, 6; left child is NodeColors.RED', function () {
    const [t, n20, n10, n30, n5, n15, n25, n35, n40] = buildTree(
      20,
      10,
      30,
      5,
      15,
      25,
      35,
      40
    );
    t.erase(n40);
    const [n12, n17, n16] = addNodes(t, 12, 17, 16);
    t.erase(n35);
    t.erase(n16);

    // validate initial state
    validateHead(t.head, n15, n5, n30, 8);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, n15, n5, n12, 10, NodeColors.BLACK);
    validatePointers(n12, n10, null, null, 12, NodeColors.BLACK);
    validatePointers(n15, null, n10, n20, 15, NodeColors.BLACK);
    validatePointers(n17, n20, null, null, 17, NodeColors.BLACK);
    validatePointers(n20, n15, n17, n30, 20, NodeColors.BLACK);
    validatePointers(n25, n30, null, null, 25, NodeColors.RED);
    validatePointers(n30, n20, n25, t.head, 30, NodeColors.BLACK);

    // case 5
    t.erase(n17);
    validateHead(t.head, n15, n5, n30, 7);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, n15, n5, n12, 10, NodeColors.BLACK);
    validatePointers(n12, n10, null, null, 12, NodeColors.BLACK);
    validatePointers(n15, null, n10, n25, 15, NodeColors.BLACK);
    validatePointers(n20, n25, null, null, 20, NodeColors.BLACK);
    validatePointers(n25, n15, n20, n30, 25, NodeColors.BLACK);
    validatePointers(n30, n25, null, t.head, 30, NodeColors.BLACK);
  });

  it('erase; cases 5, 6; left child is NodeColors.RED 2', function () {
    const [t, n20, n10, n30, n5, n15, n25, n35, n40] = buildTree(
      20,
      10,
      30,
      5,
      15,
      25,
      35,
      40
    );
    t.erase(n40);
    const [n12, n17, n16] = addNodes(t, 12, 17, 16);
    t.erase(n35);
    t.erase(n25);

    // validate initial state
    validateHead(t.head, n15, n5, n30, 8);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, n15, n5, n12, 10, NodeColors.BLACK);
    validatePointers(n12, n10, null, null, 12, NodeColors.BLACK);
    validatePointers(n15, null, n10, n20, 15, NodeColors.BLACK);
    validatePointers(n16, n17, null, null, 16, NodeColors.RED);
    validatePointers(n17, n20, n16, null, 17, NodeColors.BLACK);
    validatePointers(n20, n15, n17, n30, 20, NodeColors.BLACK);
    validatePointers(n30, n20, null, t.head, 30, NodeColors.BLACK);

    // case 5
    t.erase(n30);
    validateHead(t.head, n15, n5, n20, 7);
    validatePointers(n5, n10, t.head, null, 5, NodeColors.BLACK);
    validatePointers(n10, n15, n5, n12, 10, NodeColors.BLACK);
    validatePointers(n12, n10, null, null, 12, NodeColors.BLACK);
    validatePointers(n15, null, n10, n17, 15, NodeColors.BLACK);
    validatePointers(n16, n17, null, null, 16, NodeColors.BLACK);
    validatePointers(n17, n15, n16, n20, 17, NodeColors.BLACK);
    validatePointers(n20, n17, null, t.head, 20, NodeColors.BLACK);
  });

  it('insert / erase; add and remove many random nodes', function () {
    const MAX_KEY_VALUE = 1000;
    const MAX_SIZE = 10; //100;
    const MAX_ITERATIONS = 10; //1000;

    class ValidationResult {
      public isValid: boolean;
      public height: number;
      public size: number;
      public errorMessage: string;

      constructor() {
        this.isValid = true;
        this.height = 0;
        this.size = 0;
        this.errorMessage = '';
      }
    }

    function isValidSubtree(t: any, n: TreeNode<number, any>, res: any): void {
      if (t.isLeaf(n)) {
        return;
      }
      /* parent consistency checked by caller
               check n.left consistency */
      if (!t.isLeaf(n.left) && (n.left as TestNode).parent !== n) {
        const l = n.left as TestNode;
        res.isValid = false;
        res.errorMessage = `Invalid left child node ${l.key}. It must point to parent ${n.key}.`;
      }
      // check n.right consistency
      if (!t.isLeaf(n.right) && (n.right as TestNode).parent !== n) {
        const r = n.right as TestNode;
        res.isValid = false;
        res.errorMessage = `Invalid right child node ${r.key}. It must point to parent ${n.key}.`;
        return;
      }
      // check n.left != n.right unless both are null
      if (n.left === n.right && !t.isLeaf(n.left)) {
        const r = n.right as TestNode;
        res.isValid = false;
        res.errorMessage = `Invalid node ${n.key}. Both children are ${r.key}.`;
        return;
      }
      // If this is NodeColors.RED, neither child can be NodeColors.RED
      if (t.isRed(n)) {
        if (!t.isBlack(n.left)) {
          res.isValid = false;
          res.errorMessage = `Node ${(n.left as TestNode).key} must be NodeColors.BLACK, because it's parent ${n.key} is NodeColors.RED.`;
          return;
        }
        if (!t.isBlack(n.right)) {
          res.isValid = false;
          res.errorMessage = `Node ${(n.right as TestNode).key} must be NodeColors.BLACK, because it's parent ${n.key} is NodeColors.RED.`;
          return;
        }
      }
      const resLeft = new ValidationResult();
      isValidSubtree(t, n.left as TreeNode<number, any>, resLeft);
      if (!resLeft.isValid) {
        // invalid left subtree
        res.isValid = false;
        res.errorMessage = resLeft.errorMessage;
        return;
      }
      const resRight = new ValidationResult();
      isValidSubtree(t, n.right as TreeNode<number, any>, resRight);
      if (!resRight.isValid) {
        // invalid right subtree
        res.isValid = false;
        res.errorMessage = resRight.errorMessage;
        return;
      }
      if (resLeft.height !== resRight.height) {
        // invalid or different height right subtree
        res.isValid = false;

        res.errorMessage = `Invalid node ${n.key}. The NodeColors.BLACK height of the left subtree is ${resLeft.height} and different from the NodeColors.BLACK height of the right subtree ${resRight.height}`;
        return;
      }
      // calculate NodeColors.BLACK height of this node
      res.isValid = true;
      res.height = resLeft.height + (t.isBlack(n) ? 1 : 0);
      res.size = resLeft.size + resRight.size + 1;
    }

    function isValidTree(t: any): ValidationResult {
      const res = new ValidationResult();
      const h = t.head;
      if (h.root === null) {
        res.isValid = true;
        return res;
      }
      // check parent consistency
      if (h.root.parent !== null) {
        res.isValid = false;
        res.errorMessage = 'Root parent must be null';
        return res;
      }
      // root must be NodeColors.BLACK
      if (!t.isBlack(h.root)) {
        res.isValid = false;
        res.errorMessage = 'Root must be NodeColors.BLACK';
        return res;
      }
      // leftmost node should point to the head as it's left child
      if (h.leftmost.left !== h) {
        res.isValid = false;
        res.errorMessage = `Invalid leftmost node ${h.leftmost.key}. It's left child pointer must lead to the head`;
        return res;
      }
      // rightmost node should point to the head as it's right child
      if (h.rightmost.right !== h) {
        res.isValid = false;
        res.errorMessage = `Invalid rightmost node ${h.rightmost.key}. It's right child pointer must lead to the head`;
        return res;
      }
      // do normal node checks
      isValidSubtree(t, h.root, res);
      // verify size
      if (res.size !== h.size) {
        res.isValid = false;
        res.errorMessage = `Invalid size. Head size: ${h.size}. Actual size: ${res.size}`;
        return res;
      }
      return res;
    }

    function randomInt(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    const t = new Tree();
    const keys: any[] = [];
    for (let j = 0; j < MAX_SIZE; ++j) {
      const k = randomInt(0, MAX_KEY_VALUE);
      keys.push(k);
      addNodes(t, k);
      const res = isValidTree(t);
      should.ok(res.isValid, res.errorMessage);
    }

    for (let j = 0; j < MAX_ITERATIONS; ++j) {
      // erase
      const i = randomInt(0, MAX_SIZE);
      let k = keys[i];
      const iter = t.find(k);
      t.erase(iter.node);
      let res = isValidTree(t);
      should.ok(res.isValid, res.errorMessage);
      // insert
      k = randomInt(0, MAX_KEY_VALUE);
      keys[i] = k;
      addNodes(t, k);
      res = isValidTree(t);
      should.ok(res.isValid, res.errorMessage);
    }
  });

  it('lowerBound', function () {
    const [
      t,
      _n2,
      _n4,
      _n6,
      _n8,
      _n10,
      _n12,
      _n14,
      _n16,
      _n18,
      _n20,
      _n22,
      _n24,
      _n26,
      _n28,
      _n30,
      _n32,
    ] = buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
    let n = t.lowerBound(8).node; // n8 - root of the tree
    should.equal(n.key, 8); // matches a node with the same value
    n = t.lowerBound(22).node; // node with no children
    should.equal(n.key, 22); // matches a node with the same value
    n = t.lowerBound(12).node; // node with children
    should.equal(n.key, 12); // matches a node with the same value
    n = t.lowerBound(21).node;
    should.equal(n.key, 22); // matches the nearest larger value
    n = t.lowerBound(2).node; // the smallest value
    should.equal(n.key, 2); // matches the smallest value
    n = t.lowerBound(-1).node; // less than the smallest value
    should.equal(n.key, 2); // matches the smallest value
    n = t.lowerBound(100).node; // larger than the largest value
    should.equal(n, t.head); // matches the head
  });

  it('lowerBound; empty tree', function () {
    const t = new Tree();
    const n = t.lowerBound(22).node;
    should.equal(n, t.head); // matches the head
  });

  it('upperBound', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    let n = t.upperBound(7).node; // n8 - root of the tree
    should.equal(n.key, 8); // matches a node with a larger value
    n = t.upperBound(20).node; // n22 - node with no children
    should.equal(n.key, 22); // matches a node with a larger value
    n = t.upperBound(10).node; // n12 - node with children
    should.equal(n.key, 12); // matches a node with a larger value
    n = t.upperBound(21).node;
    should.equal(n.key, 22); // matches the nearest larger value
    n = t.upperBound(-1).node; // less than the smallest value
    should.equal(n.key, 2); // matches the first node
    n = t.upperBound(32).node; // the largest value
    should.equal(n, t.head); // matches the head
    n = t.upperBound(100).node; // larger than the largest value
    should.equal(n, t.head); // matches the head
  });

  it('upperBound; empty tree', function () {
    const t = new Tree();
    const n = t.upperBound(22).node;
    should.equal(n, t.head); // matches the head
  });

  it('find', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    let iter = t.find(8); // n8 - root of the tree
    should.equal(iter.key, 8); // matches a node with the same value
    iter = t.find(22); // n22 - node with no children
    should.equal(iter.key, 22); // matches a node with the same value
    iter = t.find(12); // n12 - node with children
    should.equal(iter.key, 12); // matches a node with the same value
    iter = t.find(23);
    should.equal(t.head, iter.node); // matches the head
    iter = t.find(-1); // less than the smallest value
    should.equal(t.head, iter.node); // matches the head
    iter = t.find(100); // larger than the largest value
    should.equal(t.head, iter.node); // matches the head
  });

  it('find; empty tree', function () {
    const t = new Tree();
    const iter = t.find(22);
    should.equal(iter.node, t.head); // matches the head
  });

  it('next', function () {
    const [t, ..._ignore] = buildTree(
      32,
      30,
      28,
      26,
      24,
      22,
      20,
      18,
      16,
      14,
      12,
      10,
      8,
      6,
      4,
      2
    );
    let n = t.head.leftmost;
    for (let i = 1; i < 17; ++i) {
      should.equal(n.key, 2 * i);
      n = t.next(n);
    }
    should.equal(n, t.head);
  });

  it('prev', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    let n = t.head.rightmost;
    for (let i = 16; i > 0; --i) {
      should.equal(n.key, 2 * i);
      n = t.prev(n);
    }
    should.equal(n, t.head);
  });

  it('for-of-loop', function () {
    const [t, ..._ignore] = buildTree(
      32,
      30,
      28,
      26,
      24,
      22,
      20,
      18,
      16,
      14,
      12,
      10,
      8,
      6,
      4,
      2
    );
    const actual = [];
    for (const v of t) {
      actual.push(v);
    }
    const expected = [
      2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
    ];
    should.deepEqual(expected, actual);
  });

  it('for-of-loop; empty tree', function () {
    const t = new Tree();
    const actual = [];
    for (const v of t) {
      actual.push(v);
    }
    const expected: any[] = [];
    should.deepEqual(expected, actual);
  });

  it('spread operator', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = [...t];
    const expected = [
      2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
    ];
    should.deepEqual(expected, actual);
  });

  it('backward', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = [];
    for (const v of t.backward()) {
      actual.push(v);
    }
    const expected = [
      32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2,
    ];
    should.deepEqual(expected, actual);
  });

  it('keys', function () {
    const t = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 6; ++i) {
      const n = new TreeNode();
      n.key = i * 2;
      n.value = `N${i}`;
      t.insertUnique(n);
    }

    const actual = [];

    for (const k of t.keys()) {
      actual.push(k);
    }
    const expected = [2, 4, 6, 8, 10];
    should.deepEqual(expected, actual);
  });

  it('values', function () {
    const t = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 6; ++i) {
      const n = new TreeNode();
      n.key = i * 2;
      n.value = `N${i}`;
      t.insertUnique(n);
    }

    const actual = [];

    for (const v of t.values()) {
      actual.push(v);
    }
    const expected = ['N1', 'N2', 'N3', 'N4', 'N5'];
    should.deepEqual(expected, actual);
  });

  it('entries', function () {
    const t: Tree<number, string> = new Tree();
    t.valuePolicy = new KeyValuePolicy<number, string>();
    for (let i = 1; i < 6; ++i) {
      const n: TreeNode<number, string> = new TreeNode();
      n.key = i * 2;
      n.value = `N${i}`;
      t.insertUnique(n);
    }

    const actual = [];

    for (const [k, v] of t.entries()) {
      actual.push([k, v]);
    }
    const expected = [
      [2, 'N1'],
      [4, 'N2'],
      [6, 'N3'],
      [8, 'N4'],
      [10, 'N5'],
    ];
    should.deepEqual(expected, actual);
  });

  it('forward stl-like iterator', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = [];
    for (let iter = t.begin(); !iter.equals(t.end()); iter.next()) {
      actual.push(iter.node.key);
    }
    const expected = [
      2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
    ];
    should.deepEqual(expected, actual);
  });

  it('forward stl-like iterator; empty tree', function () {
    const t: Tree<number, string> = new Tree();
    const actual = [];
    for (let iter = t.begin(); !iter.equals(t.end()); iter.next()) {
      actual.push(iter.node.key);
    }
    const expected: any[] = [];
    should.deepEqual(expected, actual);
  });

  it('backward stl-like iterator', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = [];
    for (let iter = t.rbegin(); !iter.equals(t.rend()); iter.next()) {
      actual.push(iter.node.key);
    }
    const expected = [
      32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2,
    ];
    should.deepEqual(expected, actual);
  });

  it('backward stl-like iterator; empty tree', function () {
    const t: Tree<number, string> = new Tree();
    const actual = [];
    for (let iter = t.rbegin(); !iter.equals(t.rend()); iter.next()) {
      actual.push(iter.node.key);
    }
    const expected: any[] = [];
    should.deepEqual(expected, actual);
  });

  it('tree with keys and values', function () {
    const t: Tree<number, string> = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 6; ++i) {
      const n: TreeNode<number, string> = new TreeNode();
      n.key = i * 2;
      n.value = `N${i}`;
      t.insertUnique(n);
    }

    const actual = [];
    for (const [k, v] of t) {
      actual.push([k, v]);
    }
    const expected = [
      [2, 'N1'],
      [4, 'N2'],
      [6, 'N3'],
      [8, 'N4'],
      [10, 'N5'],
    ];
    should.deepEqual(expected, actual);
  });

  it('insertUnique', function () {
    const t: Tree<number, string> = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 4; ++i) {
      const n: TreeNode<number, string> = new TreeNode();
      n.key = 1;
      n.value = `N${i}`;
      const res = t.insertUnique(n);
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
    should.equal(t.size(), 1);
  });

  it('insertOrUpdate', function () {
    const t: Tree<number, string> = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 4; ++i) {
      const n: TreeNode<number, string> = new TreeNode();
      n.key = 1;
      n.value = `N${i}`;
      const res = t.insertOrReplace(n);
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
    should.equal(t.size(), 1);
  });

  it('insertMulti', function () {
    const t: Tree<number, string> = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 4; ++i) {
      const n: TreeNode<number, string> = new TreeNode();
      n.key = 1;
      n.value = `N${i}`;
      const res = t.insertMulti(n);
      should.ok(res.wasAdded);
      should.ok(!res.wasReplaced);
      should.strictEqual(1, res.iterator!.key);
      should.strictEqual(`N${i}`, res.iterator!.value);
    }
    should.equal(t.size(), 3);
  });

  it('insertMulti; lowerBound/upperBound range; same values', function () {
    const t: Tree<number, string> = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 6; ++i) {
      const n: TreeNode<number, string> = new TreeNode();
      n.key = 12;
      n.value = `N${i}`;
      t.insertMulti(n);
    }

    const from = t.lowerBound(12);
    const to = t.upperBound(12);
    const actual = [];
    for (let iter = from; !iter.equals(to); iter.next()) {
      actual.push(iter.value);
    }
    const expected = ['N1', 'N2', 'N3', 'N4', 'N5'];
    should.deepEqual(expected, actual);
  });

  it('insertMulti; lowerBound/upperBound range; same values', function () {
    const t: Tree<number, string> = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 6; ++i) {
      const n: TreeNode<number, string> = new TreeNode();
      n.key = 12;
      n.value = `N${i}`;
      t.insertUnique(n);
    }

    const from = t.lowerBound(12);
    const to = t.upperBound(12);
    const actual = [];
    for (let iter = from; !iter.equals(to); iter.next()) {
      const n = iter.node;
      actual.push(n.value);
    }
    const expected = ['N1'];
    should.deepEqual(expected, actual);
    should.equal(t.size(), 1);
  });

  it('insertOrReplace; lowerBound/upperBound range; same values', function () {
    const t: Tree<number, string> = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 6; ++i) {
      const n: TreeNode<number, string> = new TreeNode();
      n.key = 12;
      n.value = `N${i}`;
      t.insertOrReplace(n);
    }

    const from = t.lowerBound(12);
    const to = t.upperBound(12);
    const actual = [];
    for (let iter = from; !iter.equals(to); iter.next()) {
      const n = iter.node;
      actual.push(n.value);
    }
    const expected = ['N5'];
    should.deepEqual(expected, actual);
    should.equal(t.size(), 1);
  });

  it('lowerBound/upperBound range; regular iteration with forward iterator', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = [];
    const from = t.lowerBound(0);
    const to = t.upperBound(50);
    const iter = from;
    while (!iter.equals(to)) {
      actual.push(iter.node.key);
      iter.next();
    }
    const expected = [
      2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
    ];
    should.deepEqual(expected, actual);
  });

  it('lowerBound/upperBound range; opposite iteration with forward iterator', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = [];
    const from = t.lowerBound(0);
    const to = t.upperBound(50);
    const iter = to;
    while (!iter.equals(from)) {
      iter.prev();
      actual.push(iter.node.key);
    }
    const expected = [
      32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2,
    ];
    should.deepEqual(expected, actual);
  });

  it('lowerBound/upperBound range; regular iteration with backward iterator', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = [];
    const from = new ReverseIterator(t.upperBound(50));
    const to = new ReverseIterator(t.lowerBound(0));
    const iter = from;
    while (!iter.equals(to)) {
      actual.push(iter.node.key);
      iter.next();
    }
    const expected = [
      32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2,
    ];
    should.deepEqual(expected, actual);
  });

  it('lowerBound/upperBound range; opposite iteration with backward iterator', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = [];
    const from = new ReverseIterator(t.upperBound(50));
    const to = new ReverseIterator(t.lowerBound(0));
    const iter = to;
    while (!iter.equals(from)) {
      iter.prev();
      actual.push(iter.node.key);
    }
    const expected = [
      2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
    ];
    should.deepEqual(expected, actual);
  });

  it('first', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = t.first();
    should.strictEqual(2, actual);
  });

  it('first; empty tree', function () {
    const [t, ..._ignore] = buildTree();
    const actual = t.first();
    should.strictEqual(undefined, actual);
  });

  it('last', function () {
    const [t, ..._ignore] = buildTree(
      2,
      4,
      6,
      8,
      10,
      12,
      14,
      16,
      18,
      20,
      22,
      24,
      26,
      28,
      30,
      32
    );
    const actual = t.last();
    should.strictEqual(32, actual);
  });

  it('last; empty tree', function () {
    const [t, ..._ignore] = buildTree();
    const actual = t.last();
    should.strictEqual(undefined, actual);
  });

  it('tree with custom comparison function', function () {
    /* Test ability to compare alphanumeric structures like ['A',123]
           First string portion is compaNodeColors.RED. If string portions of two objects are equal then numeric portions are compaNodeColors.RED */
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

    const t = new Tree();
    t.compare = compareIds;
    addNodes(
      t,
      new Id('B', 8),
      new Id('A', 340),
      new Id('A', 12),
      new Id('AA', 147)
    );

    const actual = [];
    for (const k of t) {
      actual.push([(k as unknown as Id).alpha, (k as unknown as Id).num]);
    }
    const expected = [
      ['A', 12],
      ['A', 340],
      ['AA', 147],
      ['B', 8],
    ];
    should.deepEqual(expected, actual);
  });

  it('toStringTag; keys only', function () {
    const expected = '[object Tree]';
    const actual = Object.prototype.toString.call(new Tree());
    should.strictEqual(expected, actual);
  });

  it('toString; keys only', function () {
    const t = new Tree();
    t.valuePolicy = new KeyValuePolicy();
    for (let i = 1; i < 6; ++i) {
      const n = new TreeNode();
      n.key = i * 2;
      n.value = `N${i}`;
      t.insertOrReplace(n);
    }
    const expected = '{2:N1,4:N2,6:N3,8:N4,10:N5}';
    const actual = t.toString();
    should.strictEqual(expected, actual);
  });

  it('toString; keys and values', function () {
    const [t, ..._ignore] = buildTree(2, 4, 6);
    const expected = '{2,4,6}';
    const actual = t.toString();
    should.strictEqual(expected, actual);
  });

  it('species; on object', function () {
    const t = new Tree();
    const ctr = Object.getPrototypeOf(t).constructor[Symbol.species];
    const actual = new ctr();
    should.ok(actual instanceof Tree);
  });

  it('species; on class', function () {
    const ctr = Tree[Symbol.species];
    const actual = new ctr();
    should.ok(actual instanceof Tree);
  });
});
