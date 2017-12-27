'use strict';

// Enables you to require modules using relative paths
const amp = require('app-module-path');
const path = require('path');
const srcPath = path.resolve(__dirname, '../src');
amp.addPath(srcPath);
const should = require('should');
const {RED, BLACK, Node, Tree, compare} = require('red-black-tree');

function createNode(id) {
    let n = new Node();
    n.id = id;
    return n;
}

function setPointers(node, p, l, r, c) {
    node.parent = p;
    node.left = l;
    node.right = r;
    if (c !== undefined) {
        node.color = c;
    }
}

function createErrorMsg(node, label, expected, actual) {
    let expectedLabel = expected === null ? 'null' : expected.id;
    let actualLabel = actual === null ? 'null' : actual.id;
    let nodeId = node.id || 'head';
    let msg = `Invalid node '${nodeId}'. Wrong '${label}' member. Expected: '${expectedLabel}'. Actual: '${actualLabel}'.`;
    return msg;
}

function validatePointers(node, p, l, r, k, c) {
    should.ok(node.parent === p, createErrorMsg(node, 'parent', p, node.parent));
    should.ok(node.left === l, createErrorMsg(node, 'left', l, node.left));
    should.ok(node.right === r, createErrorMsg(node, 'right', r, node.right));
    if (k !== undefined) {
        should.ok(node.key === k, `Invalid key on node '${node.id}'. expected: '${k}', actual: '${node.key}'`);
    }
    if (c !== undefined) {
        should.ok(node.color === c, `Invalid color on node '${node.id}'. expected: '${c}', actual: '${node.color}'`);
    }
}

function validateHead(head, root, l, r, s) {
    should.ok(head.root === root, createErrorMsg(head, 'root', root, head.root));
    should.ok(head.leftmost === l, createErrorMsg(head, 'leftmost', l, head.leftmost));
    should.ok(head.rightmost === r, createErrorMsg(head, 'rightmost', r, head.rightmost));
    should.ok(head.size === s, `Invalid size. expected: '${s}', actual: '${head.size}'`);
}

function addNodes(t, ...keys) {
    let nodes = [];
    for (let k of keys) {
        let n = createNode(k);
        n.key = k;
        t.insertNode(n);
        nodes.push(n);
    }
    return nodes;
}

function buildTree(...keys) {
    let t = new Tree();
    let nodes = addNodes(t, ...keys);
    return [t, ...nodes];
}

describe('Tree node tests', function() {

    it('Node.grandparent; no parent', function(done) {
        let n = new Node();
        let actual = n.grandparent();
        let expected = null;
        should.strictEqual(expected, actual);

        done();
    });

    it('Node.grandparent; no grandparent', function(done) {
        let p = new Node();
        let n = new Node();
        n.parent = p;
        let actual = n.grandparent();
        let expected = null;
        should.strictEqual(expected, actual);

        done();
    });

    it('Node.grandparent; valid grandparent', function(done) {
        let g = new Node();
        let p = new Node();
        let n = new Node();
        p.parent = g;
        n.parent = p;
        let actual = n.grandparent();
        should.strictEqual(g, actual);

        done();
    });

    it('Node.sibling; no parent', function(done) {
        let n = new Node();
        let actual = n.sibling();
        let expected = null;
        should.strictEqual(expected, actual);

        done();
    });

    it('Node.sibling; left sibling', function(done) {
        let p = new Node();
        let n = new Node();
        let s = new Node();
        p.left = s;
        p.right = n;
        n.parent = p;
        s.parent = p;
        let actual = n.sibling();
        let expected = s;
        should.strictEqual(expected, actual);

        done();
    });

    it('Node.sibling; right sibling', function(done) {
        let p = new Node();
        let n = new Node();
        let s = new Node();
        p.left = n;
        p.right = s;
        n.parent = p;
        s.parent = p;
        let actual = n.sibling();
        let expected = s;
        should.strictEqual(expected, actual);

        done();
    });

    it('Node.uncle; no parent', function(done) {
        let n = new Node();
        let actual = n.uncle();
        let expected = null;
        should.strictEqual(expected, actual);

        done();
    });

    it('Node.uncle; no grandparent', function(done) {
        let p = new Node();
        let n = new Node();
        n.parent = p;
        let actual = n.uncle();
        let expected = null;
        should.strictEqual(expected, actual);

        done();
    });

    it('Node.uncle; valid uncle', function(done) {
        let g = new Node();
        let p = new Node();
        let u = new Node();
        let n = new Node();
        n.parent = p;
        p.left = n;
        p.parent = g;
        u.parent = g;
        g.left = p;
        g.right = u;
        let actual = n.uncle();
        let expected = u;
        should.strictEqual(expected, actual);

        done();
    });
});

describe('Compare tests', function() {

    it('numbers', function(done) {
        should.equal(-1, compare(5, 6));
        should.equal(0, compare(-2, -2));
        should.equal(1, compare(6, -5));

        done();
    });

    it('strings', function(done) {
        should.equal(-1, compare('A', 'a'));
        should.equal(0, compare('abc', 'abc'));
        should.equal(1, compare('Abcd', 'Abc'));

        done();
    });
});

describe('Tree tests', function() {

    it('constructor', function(done) {
        let t = new Tree();
        validateHead(t.head, t.head, t.head, t.head, 0);

        done();
    });

    it('size', function(done) {
        let t = new Tree();
        t.head.size = 5;
        should.equal(5, t.size);

        done();
    });

    it('replaceNode; root', function(done) {
        let p = new Node();
        let n = new Node();
        let t = new Tree();
        t.head.root = p;
        t.head.leftmost = p;
        t.head.rightmost = p;
        t.head.size = 1;
        t.replaceNode(p, n);
        validateHead(t.head, n, p, p, 1);
        validatePointers(p, null, null, null);
        validatePointers(n, null, null, null);

        done();
    });

    it('replaceNode; left child', function(done) {
        let p = createNode('p');
        let l = createNode('l');
        let r = createNode('r');
        let n = createNode('n');
        setPointers(p, null, l, r);
        setPointers(l, p, null, null);
        setPointers(r, p, null, null);
        let t = new Tree();
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

        done();
    });

    it('replaceNode; right child', function(done) {
        let p = createNode('p');
        let l = createNode('l');
        let r = createNode('r');
        let n = createNode('n');
        setPointers(p, null, l, r);
        setPointers(l, p, null, null);
        setPointers(r, p, null, null);
        let t = new Tree();
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

        done();
    });

    it('replaceNode; itself', function(done) {
        let p = createNode('p');
        let l = createNode('l');
        let r = createNode('r');
        setPointers(p, null, l, r);
        setPointers(l, p, null, null);
        setPointers(r, p, null, null);
        let t = new Tree();
        t.head.root = p;
        t.head.leftmost = l;
        t.head.rightmost = r;
        t.head.size = 3;
        t.replaceNode(r, r);
        validateHead(t.head, p, l, r, 3);
        validatePointers(p, null, l, r);
        validatePointers(l, p, null, null);
        validatePointers(r, p, null, null);

        done();
    });

    it('replaceNode; null', function(done) {
        let p = createNode('p');
        let l = createNode('l');
        let r = createNode('r');
        setPointers(p, null, l, r);
        setPointers(l, p, null, null);
        setPointers(r, p, null, null);
        let t = new Tree();
        t.head.root = p;
        t.head.leftmost = l;
        t.head.rightmost = r;
        t.head.size = 3;
        t.replaceNode(r, null);
        validateHead(t.head, p, l, r, 3);
        validatePointers(p, null, l, null);
        validatePointers(l, p, null, null);
        validatePointers(r, p, null, null);

        done();
    });

    it('rotateLeft; all nodes', function(done) {
        let p = createNode('p');
        let n = createNode('n');
        let X = createNode('X');
        let Y = createNode('Y');
        let a = createNode('a');
        let b = createNode('b');
        let c = createNode('c');
        setPointers(p, null, Y, n);
        setPointers(n, p, null, null);
        setPointers(X, Y, b, c);
        setPointers(Y, p, a, X);
        setPointers(a, Y, null, null);
        setPointers(b, X, null, null);
        setPointers(c, X, null, null);
        let t = new Tree();
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

        done();
    });

    it('rotateLeft; all nodes', function(done) {
        let p = createNode('p');
        let n = createNode('n');
        let X = createNode('X');
        let Y = createNode('Y');
        let a = createNode('a');
        let b = createNode('b');
        let c = createNode('c');
        setPointers(p, null, n, Y);
        setPointers(n, p, null, null);
        setPointers(X, Y, b, c);
        setPointers(Y, p, a, X);
        setPointers(a, Y, null, null);
        setPointers(b, X, null, null);
        setPointers(c, X, null, null);
        let t = new Tree();
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

        done();
    });

    it('rotateLeft; 2 nodes', function(done) {
        let X = createNode('X');
        let Y = createNode('Y');
        setPointers(X, Y, null, null);
        setPointers(Y, null, null, X);
        let t = new Tree();
        t.head.root = Y;
        t.head.leftmost = Y;
        t.head.rightmost = X;
        t.head.size = 2;
        t.rotateLeft(Y);
        validateHead(t.head, X, Y, X, 2);
        validatePointers(X, null, Y, null);
        validatePointers(Y, X, null, null);

        done();
    });

    it('rotateRight; all nodes', function(done) {
        let p = createNode('p');
        let n = createNode('n');
        let X = createNode('X');
        let Y = createNode('Y');
        let a = createNode('a');
        let b = createNode('b');
        let c = createNode('c');
        setPointers(p, null, X, n);
        setPointers(n, p, null, null);
        setPointers(X, p, Y, c);
        setPointers(Y, X, a, b);
        setPointers(a, Y, null, null);
        setPointers(b, Y, null, null);
        setPointers(c, X, null, null);
        let t = new Tree();
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

        done();
    });

    it('rotateRight; all nodes', function(done) {
        let p = createNode('p');
        let n = createNode('n');
        let X = createNode('X');
        let Y = createNode('Y');
        let a = createNode('a');
        let b = createNode('b');
        let c = createNode('c');
        setPointers(p, null, n, X);
        setPointers(n, p, null, null);
        setPointers(X, p, Y, c);
        setPointers(Y, X, a, b);
        setPointers(a, Y, null, null);
        setPointers(b, Y, null, null);
        setPointers(c, X, null, null);
        let t = new Tree();
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

        done();
    });

    it('rotateRight; 2 nodes', function(done) {
        let X = createNode('X');
        let Y = createNode('Y');
        setPointers(X, null, Y, null);
        setPointers(Y, X, null, null);
        let t = new Tree();
        t.head.root = X;
        t.head.leftmost = Y;
        t.head.rightmost = X;
        t.head.size = 2;
        t.rotateRight(X);
        validateHead(t.head, Y, Y, X, 2);
        validatePointers(X, Y, null, null);
        validatePointers(Y, null, null, X);

        done();
    });

    it('isLeaf', function(done) {
        let X = createNode('X');
        setPointers(X, null, null, null, BLACK);
        let t = new Tree();
        t.head.root = X;
        t.head.leftmost = X;
        t.head.rightmost = X;
        t.head.size = 1;
        should.ok(!t.isLeaf(X));
        should.ok(t.isLeaf(t.head));
        should.ok(t.isLeaf(null));

        done();
    });

    it('fetchColor', function(done) {
        let X = createNode('X');
        let Y = createNode('Y');
        setPointers(X, null, Y, null, BLACK);
        setPointers(Y, X, null, null, RED);
        let t = new Tree();
        t.head.root = X;
        t.head.leftmost = Y;
        t.head.rightmost = X;
        t.head.size = 2;
        should.equal(BLACK, t.fetchColor(X));
        should.equal(BLACK, t.fetchColor(t.head));
        should.equal(BLACK, t.fetchColor(null));
        should.equal(RED, t.fetchColor(Y));
        should.ok(t.isBlack(X));
        should.ok(t.isRed(Y));

        done();
    });

    it('insertNode; root; case 1', function(done) {
        let [t, n] = buildTree(2);

        validateHead(t.head, n, n, n, 1);
        validatePointers(n, null, t.head, t.head, 2, BLACK);

        done();
    });

    it('insertNode; root & left child; case 2', function(done) {
        let [t, n2, n1] = buildTree(2, 1);

        validateHead(t.head, n2, n1, n2, 2);
        validatePointers(n2, null, n1, t.head, 2, BLACK);
        validatePointers(n1, n2, t.head, null, 1, RED);

        done();
    });

    it('insertNode; root & right child; case 2', function(done) {
        let [t, n2, n3] = buildTree(2, 3);

        validateHead(t.head, n2, n2, n3, 2);
        validatePointers(n2, null, t.head, n3, 2, BLACK);
        validatePointers(n3, n2, null, t.head, 3, RED);

        done();
    });

    it('insertNode; 2,3,1,4; case 3', function(done) {
        let [t, n2, n3, n1, n4] = buildTree(2, 3, 1, 4);

        validateHead(t.head, n2, n1, n4, 4);
        validatePointers(n2, null, n1, n3, 2, BLACK);
        validatePointers(n3, n2, null, n4, 3, BLACK);
        validatePointers(n1, n2, t.head, null, 1, BLACK);
        validatePointers(n4, n3, null, t.head, 4, RED);

        done();
    });

    it('insertNode; 1,2,3; case 4', function(done) {
        let [t, n1, n2, n3] = buildTree(1, 2, 3);

        validateHead(t.head, n2, n1, n3, 3);
        validatePointers(n1, n2, t.head, null, 1, RED);
        validatePointers(n2, null, n1, n3, 2, BLACK);
        validatePointers(n3, n2, null, t.head, 3, RED);

        done();
    });

    it('insertNode; 1,3,2; case 4', function(done) {
        let [t, n1, n3, n2] = buildTree(1, 3, 2);

        validateHead(t.head, n2, n1, n3, 3);
        validatePointers(n1, n2, t.head, null, 1, RED);
        validatePointers(n2, null, n1, n3, 2, BLACK);
        validatePointers(n3, n2, null, t.head, 3, RED);

        done();
    });

    it('insertNode; 6,4,5; case 4', function(done) {
        let [t, n6, n4, n5] = buildTree(6, 4, 5);

        validateHead(t.head, n5, n4, n6, 3);
        validatePointers(n4, n5, t.head, null, 4, RED);
        validatePointers(n5, null, n4, n6, 5, BLACK);
        validatePointers(n6, n5, null, t.head, 6, RED);

        done();
    });

    it('insertNode; 1,2,3,4; case 4', function(done) {
        let [t, n1, n2, n3, n4] = buildTree(1, 2, 3, 4);

        validateHead(t.head, n2, n1, n4, 4);
        validatePointers(n1, n2, t.head, null, 1, BLACK);
        validatePointers(n2, null, n1, n3, 2, BLACK);
        validatePointers(n3, n2, null, n4, 3, BLACK);
        validatePointers(n4, n3, null, t.head, 4, RED);

        done();
    });

    it('insertNode; 1,2,3,4,5; case 4', function(done) {
        let [t, n1, n2, n3, n4, n5] = buildTree(1, 2, 3, 4, 5);

        validateHead(t.head, n2, n1, n5, 5);
        validatePointers(n1, n2, t.head, null, 1, BLACK);
        validatePointers(n2, null, n1, n4, 2, BLACK);
        validatePointers(n3, n4, null, null, 3, RED);
        validatePointers(n4, n2, n3, n5, 4, BLACK);
        validatePointers(n5, n4, null, t.head, 5, RED);

        done();
    });

    it('insertNode; 1,2,3,4,5,6; case 4', function(done) {
        let [t, n1, n2, n3, n4, n5, n6] = buildTree(1, 2, 3, 4, 5, 6);

        validateHead(t.head, n2, n1, n6, 6);
        validatePointers(n1, n2, t.head, null, 1, BLACK);
        validatePointers(n2, null, n1, n4, 2, BLACK);
        validatePointers(n3, n4, null, null, 3, BLACK);
        validatePointers(n4, n2, n3, n5, 4, RED);
        validatePointers(n5, n4, null, n6, 5, BLACK);
        validatePointers(n6, n5, null, t.head, 6, RED);

        done();
    });

    it('insertNode; 6,5,4,3,2,1; case 4', function(done) {
        let [t, n6, n5, n4, n3, n2, n1] = buildTree(6, 5, 4, 3, 2, 1);

        validateHead(t.head, n5, n1, n6, 6);
        validatePointers(n6, n5, null, t.head, 6, BLACK);
        validatePointers(n5, null, n3, n6, 5, BLACK);
        validatePointers(n4, n3, null, null, 4, BLACK);
        validatePointers(n3, n5, n2, n4, 3, RED);
        validatePointers(n2, n3, n1, null, 2, BLACK);
        validatePointers(n1, n2, t.head, null, 1, RED);

        done();
    });

    it('fetchMaximum', function(done) {
        let [t, n20, n10, n30, n15, n40, n17] = buildTree(20, 10, 30, 15, 40, 17);

        should.equal(n40, t.fetchMaximum(n20));
        should.equal(n17, t.fetchMaximum(n15));

        done();
    });

    it('clear', function(done) {
        let [t] = buildTree(1, 2, 3);
        t.clear();
        validateHead(t.head, t.head, t.head, t.head, 0);

        done();
    });

    it('erase; null', function(done) {
        let t = new Tree();
        t.erase(null);
        validateHead(t.head, t.head, t.head, t.head, 0);

        done();
    });

    it('erase; head', function(done) {
        let t = new Tree();
        t.erase(t.head);
        validateHead(t.head, t.head, t.head, t.head, 0);

        done();
    });

    it('erase; case 1', function(done) {
        let [t, n2] = buildTree(2);
        t.erase(n2);
        validateHead(t.head, t.head, t.head, t.head, 0);

        done();
    });

    it('erase; replaced by leftmost child', function(done) {
        let [t, n2, n1, n3] = buildTree(2, 1, 3);
        t.erase(n2);
        validateHead(t.head, n2, n2, n3, 2);
        validatePointers(n2, null, t.head, n3, 1, BLACK);
        validatePointers(n3, n2, null, t.head, 3, RED);

        done();
    });

    it('erase; delete leftmost child', function(done) {
        let [t, n2, n1, n3] = buildTree(2, 1, 3);
        t.erase(n1);
        validateHead(t.head, n2, n2, n3, 2);
        validatePointers(n2, null, t.head, n3, 2, BLACK);
        validatePointers(n3, n2, null, t.head, 3, RED);

        done();
    });

    it('erase; delete leftmost child 2', function(done) {
        let [t, n10, n8, n12, n6, n14] = buildTree(10, 8, 12, 6, 14);
        t.erase(n6);
        validateHead(t.head, n10, n8, n14, 4);
        validatePointers(n8, n10, t.head, null, 8, BLACK);
        validatePointers(n10, null, n8, n12, 10, BLACK);
        validatePointers(n12, n10, null, n14, 12, BLACK);
        validatePointers(n14, n12, null, t.head, 14, RED);

        done();
    });

    it('erase; delete rightmost child', function(done) {
        let [t, n2, n1, n3] = buildTree(2, 1, 3);
        t.erase(n3);
        validateHead(t.head, n2, n1, n2, 2);
        validatePointers(n1, n2, t.head, null, 1, RED);
        validatePointers(n2, null, n1, t.head, 2, BLACK);

        done();
    });

    it('erase; delete rightmost child 2', function(done) {
        let [t, n10, n8, n12, n6, n14] = buildTree(10, 8, 12, 6, 14);
        t.erase(n14);
        validateHead(t.head, n10, n6, n12, 4);
        validatePointers(n6, n8, t.head, null, 6, RED);
        validatePointers(n8, n10, n6, null, 8, BLACK);
        validatePointers(n10, null, n8, n12, 10, BLACK);
        validatePointers(n12, n10, null, t.head, 12, BLACK);

        done();
    });

    it('erase; cases 2, 4; left child', function(done) {
        let [t, n20, n10, n30, n5, n25, n35, n40] = buildTree(20, 10, 30, 5, 25, 35, 40);
        t.erase(n5);
        t.erase(n40);
        // validate initial state
        validateHead(t.head, n20, n10, n35, 5);
        validatePointers(n10, n20, t.head, null, 10, BLACK);
        validatePointers(n20, null, n10, n30, 20, BLACK);
        validatePointers(n25, n30, null, null, 25, BLACK);
        validatePointers(n30, n20, n25, n35, 30, RED);
        validatePointers(n35, n30, null, t.head, 35, BLACK);

        // case 2, which then becomes case 4
        t.erase(n10);
        validateHead(t.head, n30, n20, n35, 4);
        validatePointers(n20, n30, t.head, n25, 20, BLACK);
        validatePointers(n25, n20, null, null, 25, RED);
        validatePointers(n30, null, n20, n35, 30, BLACK);
        validatePointers(n35, n30, null, t.head, 35, BLACK);

        done();
    });

    it('erase; cases 2, 4; right child', function(done) {
        let [t, n20, n10, n30, n5, n15, n18] = buildTree(20, 10, 30, 5, 15, 18);
        t.erase(n18);
        // validate initial state
        validateHead(t.head, n20, n5, n30, 5);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, n20, n5, n15, 10, RED);
        validatePointers(n15, n10, null, null, 15, BLACK);
        validatePointers(n20, null, n10, n30, 20, BLACK);
        validatePointers(n30, n20, null, t.head, 30, BLACK);

        // case 2, which then becomes case 4
        t.erase(n30);
        validateHead(t.head, n10, n5, n20, 4);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, null, n5, n20, 10, BLACK);
        validatePointers(n15, n20, null, null, 15, RED);
        validatePointers(n20, n10, n15, t.head, 20, BLACK);

        done();
    });

    it('erase; cases 3, 5, 6; left child', function(done) {
        let [t, n20, n10, n30, n5, n15, n25, n35, n40] = buildTree(20, 10, 30, 5, 15, 25, 35, 40);
        t.erase(n40);
        let [n12, n17, n16] = addNodes(t, 12, 17, 16);

        // validate initial state
        validateHead(t.head, n20, n5, n35, 10);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, n20, n5, n15, 10, BLACK);
        validatePointers(n12, n15, null, null, 12, BLACK);
        validatePointers(n15, n10, n12, n17, 15, RED);
        validatePointers(n16, n17, null, null, 16, RED);
        validatePointers(n17, n15, n16, null, 17, BLACK);
        validatePointers(n20, null, n10, n30, 20, BLACK);
        validatePointers(n25, n30, null, null, 25, BLACK);
        validatePointers(n30, n20, n25, n35, 30, BLACK);
        validatePointers(n35, n30, null, t.head, 35, BLACK);

        // case 3
        t.erase(n25);
        validateHead(t.head, n15, n5, n35, 9);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, n15, n5, n12, 10, BLACK);
        validatePointers(n12, n10, null, null, 12, BLACK);
        validatePointers(n15, null, n10, n20, 15, BLACK);
        validatePointers(n16, n17, null, null, 16, RED);
        validatePointers(n17, n20, n16, null, 17, BLACK);
        validatePointers(n20, n15, n17, n30, 20, BLACK);
        validatePointers(n30, n20, null, n35, 30, BLACK);
        validatePointers(n35, n30, null, t.head, 35, RED);

        done();
    });

    it('erase; cases 3, 5, 6; right child', function(done) {
        let [t, n20, n10, n30, n5, n15, n25, n35, n40] = buildTree(20, 10, 30, 5, 15, 25, 35, 40);
        t.erase(n40);
        let [n12, n17, n16] = addNodes(t, 12, 17, 16);

        // validate initial state
        validateHead(t.head, n20, n5, n35, 10);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, n20, n5, n15, 10, BLACK);
        validatePointers(n12, n15, null, null, 12, BLACK);
        validatePointers(n15, n10, n12, n17, 15, RED);
        validatePointers(n16, n17, null, null, 16, RED);
        validatePointers(n17, n15, n16, null, 17, BLACK);
        validatePointers(n20, null, n10, n30, 20, BLACK);
        validatePointers(n25, n30, null, null, 25, BLACK);
        validatePointers(n30, n20, n25, n35, 30, BLACK);
        validatePointers(n35, n30, null, t.head, 35, BLACK);

        // case 3
        t.erase(n35);
        validateHead(t.head, n15, n5, n30, 9);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, n15, n5, n12, 10, BLACK);
        validatePointers(n12, n10, null, null, 12, BLACK);
        validatePointers(n15, null, n10, n20, 15, BLACK);
        validatePointers(n16, n17, null, null, 16, RED);
        validatePointers(n17, n20, n16, null, 17, BLACK);
        validatePointers(n20, n15, n17, n30, 20, BLACK);
        validatePointers(n25, n30, null, null, 25, RED);
        validatePointers(n30, n20, n25, t.head, 30, BLACK);

        done();
    });

    it('erase; cases 5, 6; left child is red', function(done) {
        let [t, n20, n10, n30, n5, n15, n25, n35, n40] = buildTree(20, 10, 30, 5, 15, 25, 35, 40);
        t.erase(n40);
        let [n12, n17, n16] = addNodes(t, 12, 17, 16);
        t.erase(n35);
        t.erase(n16);

        // validate initial state
        validateHead(t.head, n15, n5, n30, 8);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, n15, n5, n12, 10, BLACK);
        validatePointers(n12, n10, null, null, 12, BLACK);
        validatePointers(n15, null, n10, n20, 15, BLACK);
        validatePointers(n17, n20, null, null, 17, BLACK);
        validatePointers(n20, n15, n17, n30, 20, BLACK);
        validatePointers(n25, n30, null, null, 25, RED);
        validatePointers(n30, n20, n25, t.head, 30, BLACK);

        // case 5
        t.erase(n17);
        validateHead(t.head, n15, n5, n30, 7);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, n15, n5, n12, 10, BLACK);
        validatePointers(n12, n10, null, null, 12, BLACK);
        validatePointers(n15, null, n10, n25, 15, BLACK);
        validatePointers(n20, n25, null, null, 20, BLACK);
        validatePointers(n25, n15, n20, n30, 25, BLACK);
        validatePointers(n30, n25, null, t.head, 30, BLACK);

        done();
    });

    it('erase; cases 5, 6; left child is red 2', function(done) {
        let [t, n20, n10, n30, n5, n15, n25, n35, n40] = buildTree(20, 10, 30, 5, 15, 25, 35, 40);
        t.erase(n40);
        let [n12, n17, n16] = addNodes(t, 12, 17, 16);
        t.erase(n35);
        t.erase(n25);

        // validate initial state
        validateHead(t.head, n15, n5, n30, 8);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, n15, n5, n12, 10, BLACK);
        validatePointers(n12, n10, null, null, 12, BLACK);
        validatePointers(n15, null, n10, n20, 15, BLACK);
        validatePointers(n16, n17, null, null, 16, RED);
        validatePointers(n17, n20, n16, null, 17, BLACK);
        validatePointers(n20, n15, n17, n30, 20, BLACK);
        validatePointers(n30, n20, null, t.head, 30, BLACK);

        // case 5
        t.erase(n30);
        validateHead(t.head, n15, n5, n20, 7);
        validatePointers(n5, n10, t.head, null, 5, BLACK);
        validatePointers(n10, n15, n5, n12, 10, BLACK);
        validatePointers(n12, n10, null, null, 12, BLACK);
        validatePointers(n15, null, n10, n17, 15, BLACK);
        validatePointers(n16, n17, null, null, 16, BLACK);
        validatePointers(n17, n15, n16, n20, 17, BLACK);
        validatePointers(n20, n17, null, t.head, 20, BLACK);

        done();
    });

});
