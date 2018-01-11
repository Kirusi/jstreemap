'use strict';

const should = require('should');
const assert = require('assert');

const {TreeNode, RED, BLACK} = require('../src/internal/tree-node');
const {Tree, compare} = require('../src/internal/tree');
const {Iterator, ReverseIterator} = require('../src/public/iterators');
const {KeyOnlyPolicy, KeyValuePolicy} = require('../src/internal/policies');

function createNode(id) {
    let n = new TreeNode();
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
        should.equal(5, t.size());

        done();
    });

    it('replaceNode; root', function(done) {
        let p = new TreeNode();
        let n = new TreeNode();
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

    it('rotateLeft; single node', function(done) {
        let X = createNode('X');
        setPointers(X, null, null, null);
        let t = new Tree();
        t.head.root = X;
        t.head.leftmost = X;
        t.head.rightmost = X;
        t.head.size = 1;
        try {
            t.rotateLeft(X);
            assert(false, 'The error was not detected');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('rotateLeft'));
            should.ok(msg.includes('corrupted'));
        }

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

    it('rotateRight; single node', function(done) {
        let X = createNode('X');
        setPointers(X, null, null, null);
        let t = new Tree();
        t.head.root = X;
        t.head.leftmost = X;
        t.head.rightmost = X;
        t.head.size = 1;
        try {
            t.rotateRight(X);
            assert(false, 'The error was not detected');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('rotateRight'), msg);
            should.ok(msg.includes('corrupted'), msg);
        }

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

    it('fetchMinimum', function(done) {
        let [t, n20, n10, n30, n5, n15, n25, n35, n27] = buildTree(20, 10, 30, 5, 15, 25, 35, 27);

        should.equal(n5, t.fetchMinimum(n20));
        should.equal(n25, t.fetchMinimum(n30));

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

    it('erase; delete node with a single left child', function(done) {
        let [t, n20, n10, n30, n25, n35, n22] = buildTree(20, 10, 30, 25, 35, 22);
        t.erase(n25);
        validateHead(t.head, n20, n10, n35, 5);
        validatePointers(n10, n20, t.head, null, 10, BLACK);
        validatePointers(n20, null, n10, n30, 20, BLACK);
        validatePointers(n22, n30, null, null, 22, RED);
        validatePointers(n30, n20, n22, n35, 30, BLACK);
        validatePointers(n35, n30, null, t.head, 35, RED);
        done();
    });

    it('erase; delete node with a single right child', function(done) {
        let [t, n20, n10, n30, n25, n35, n27] = buildTree(20, 10, 30, 25, 35, 27);
        t.erase(n25);
        validateHead(t.head, n20, n10, n35, 5);
        validatePointers(n10, n20, t.head, null, 10, BLACK);
        validatePointers(n20, null, n10, n30, 20, BLACK);
        validatePointers(n27, n30, null, null, 27, RED);
        validatePointers(n30, n20, n27, n35, 30, BLACK);
        validatePointers(n35, n30, null, t.head, 35, RED);

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

    it('insert / erase; add and remove many random nodes', function(done) {
        const MAX_KEY_VALUE = 1000;
        const MAX_SIZE = 10; //100;
        const MAX_ITERATIONS = 10; //1000;

        class ValidationResult {
            constructor() {
                this.isValid = true;
                this.height = 0;
                this.size = 0;
                this.errorMessage = '';
            }
        }

        function isValidSubtree(t, n, res) {
            if (t.isLeaf(n)) {
                return;
            }
            /* parent consistency checked by caller
               check n.left consistency */
            if (!t.isLeaf(n.left) && n.left.parent !== n) {
                let l = n.left;
                res.isValid = false;
                res.errorMessage = `Invalid left child node ${l.key}. It must point to parent ${n.key}.`;
            }
            // check n.right consistency
            if (!t.isLeaf(n.right) && n.right.parent !== n) {
                let r = n.right;
                res.isValid = false;
                res.errorMessage = `Invalid right child node ${r.key}. It must point to parent ${n.key}.`;
                return;
            }
            // check n.left != n.right unless both are null
            if (n.left === n.right && !t.isLeaf(n.left)) {
                let r = n.right;
                res.isValid = false;
                res.errorMessage = `Invalid node ${n.key}. Both children are ${r.key}.`;
                return;
            }
            // If this is red, neither child can be red
            if (t.isRed(n)) {
                if (!t.isBlack(n.left)) {
                    res.isValid = false;
                    res.errorMessage = `Node ${n.left.key} must be black, because it's parent ${n.key} is red.`;
                    return;
                }
                if (!t.isBlack(n.right)) {
                    res.isValid = false;
                    res.errorMessage = `Node ${n.right.key} must be black, because it's parent ${n.key} is red.`;
                    return;
                }
            }
            let resLeft = new ValidationResult();
            isValidSubtree(t, n.left, resLeft);
            if (!resLeft.isValid) {
                // invalid left subtree
                res.isValid = false;
                res.errorMessage = resLeft.errorMessage;
                return;
            }
            let resRight = new ValidationResult();
            isValidSubtree(t, n.right, resRight);
            if (!resRight.isValid) {
                // invalid right subtree
                res.isValid = false;
                res.errorMessage = resRight.errorMessage;
                return;
            }
            if (resLeft.height !== resRight.height) {
                // invalid or different height right subtree
                res.isValid = false;
                // eslint-disable-next-line max-len
                res.errorMessage = `Invalid node ${n.key}. The black height of the left subtree is ${resLeft.height} and different from the black height of the right subtree ${resRight.height}`;
                return;
            }
            // calculate black height of this node
            res.isValid = true;
            res.height = resLeft.height + (t.isBlack(n) ? 1 : 0);
            res.size = resLeft.size + resRight.size + 1;
        }

        function isValidTree(t) {
            let res = new ValidationResult();
            let h = t.head;
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
            // root must be black
            if (!t.isBlack(h.root)) {
                res.isValid = false;
                res.errorMessage = 'Root must be black';
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

        function randomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

        let t = new Tree();
        let keys = [];
        for (let j = 0; j < MAX_SIZE; ++j) {
            let k = randomInt(0, MAX_KEY_VALUE);
            keys.push(k);
            addNodes(t, k);
            let res = isValidTree(t);
            should.ok(res.isValid, res.errorMessage);
        }

        for (let j = 0; j < MAX_ITERATIONS; ++j) {
            // erase
            let i = randomInt(0, MAX_SIZE);
            let k = keys[i];
            let it = t.find(k);
            t.erase(it.node);
            let res = isValidTree(t);
            should.ok(res.isValid, res.errorMessage);
            // insert
            k = randomInt(0, MAX_KEY_VALUE);
            keys[i] = k;
            addNodes(t, k);
            res = isValidTree(t);
            should.ok(res.isValid, res.errorMessage);
        }

        done();
    });

    it('lowerBound', function(done) {
        let [t, n2, n4, n6, n8, n10, n12, n14, n16, n18, n20, n22, n24, n26, n28, n30, n32] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let n = t.lowerBound(8).node; // n8 - root of the tree
        should.equal(8, n.key); // matches a node with the same value
        n = t.lowerBound(22).node; // node with no children
        should.equal(22, n.key); // matches a node with the same value
        n = t.lowerBound(12).node; // node with children
        should.equal(12, n.key); // matches a node with the same value
        n = t.lowerBound(21).node;
        should.equal(22, n.key); // matches the nearest larger value
        n = t.lowerBound(2).node; // the smallest value
        should.equal(2, n.key); // matches the smallest value
        n = t.lowerBound(-1).node; // less than the smallest value
        should.equal(2, n.key); // matches the smallest value
        n = t.lowerBound(100).node; // larger than the largest value
        should.equal(t.head, n); // matches the head

        done();
    });

    it('lowerBound; empty tree', function(done) {
        let t = new Tree();
        let n = t.lowerBound(22).node;
        should.equal(t.head, n); // matches the head

        done();
    });

    it('upperBound', function(done) {
        let [t, n2, n4, n6, n8, n10, n12, n14, n16, n18, n20, n22, n24, n26, n28, n30, n32] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let n = t.upperBound(7).node; // n8 - root of the tree
        should.equal(8, n.key); // matches a node with a larger value
        n = t.upperBound(20).node; // n22 - node with no children
        should.equal(22, n.key); // matches a node with a larger value
        n = t.upperBound(10).node; // n12 - node with children
        should.equal(12, n.key); // matches a node with a larger value
        n = t.upperBound(21).node;
        should.equal(22, n.key); // matches the nearest larger value
        n = t.upperBound(-1).node; // less than the smallest value
        should.equal(2, n.key); // matches the first node
        n = t.upperBound(32).node; // the largest value
        should.equal(t.head, n); // matches the head
        n = t.upperBound(100).node; // larger than the largest value
        should.equal(t.head, n); // matches the head

        done();
    });

    it('upperBound; empty tree', function(done) {
        let t = new Tree();
        let n = t.upperBound(22).node;
        should.equal(t.head, n); // matches the head

        done();
    });

    it('find', function(done) {
        let [t, n2, n4, n6, n8, n10, n12, n14, n16, n18, n20, n22, n24, n26, n28, n30, n32] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let it = t.find(8); // n8 - root of the tree
        should.equal(8, it.key); // matches a node with the same value
        it = t.find(22); // n22 - node with no children
        should.equal(22, it.key); // matches a node with the same value
        it = t.find(12); // n12 - node with children
        should.equal(12, it.key); // matches a node with the same value
        it = t.find(23);
        should.equal(t.head, it.node); // matches the head
        it = t.find(-1); // less than the smallest value
        should.equal(t.head, it.node); // matches the head
        it = t.find(100); // larger than the largest value
        should.equal(t.head, it.node); // matches the head

        done();
    });

    it('find; empty tree', function(done) {
        let t = new Tree();
        let it = t.find(22);
        should.equal(t.head, it.node); // matches the head

        done();
    });

    it('next', function(done) {
        let [t, ...ignore] =
            buildTree(32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2);
        let n = t.head.leftmost;
        for (let i = 1; i < 17; ++i) {
            should.equal(2 * i, n.key);
            n = t.next(n);
        }
        should.equal(t.head, n);

        done();
    });

    it('prev', function(done) {
        let [t, ...ignore] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let n = t.head.rightmost;
        for (let i = 16; i > 0; --i) {
            should.equal(2 * i, n.key);
            n = t.prev(n);
        }
        should.equal(t.head, n);

        done();
    });

    it('for-of-loop', function(done) {
        let [t, ...ignore] =
            buildTree(32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2);
        let actual = [];
        for (let v of t) {
            actual.push(v);
        }
        let expected = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
        should.deepEqual(expected, actual);

        done();
    });

    it('for-of-loop; empty tree', function(done) {
        let t = new Tree();
        let actual = [];
        for (let v of t) {
            actual.push(v);
        }
        let expected = [];
        should.deepEqual(expected, actual);

        done();
    });

    it('spread operator', function(done) {
        let [t, n2, n4, n6, n8, n10, n12, n14, n16, n18, n20, n22, n24, n26, n28, n30, n32] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let actual = [...t];
        let expected = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
        should.deepEqual(expected, actual);

        done();
    });

    it('backward', function(done) {
        let [t, ...ignore] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let actual = [];
        for (let v of t.backward()) {
            actual.push(v);
        }
        let expected = [32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
        should.deepEqual(expected, actual);

        done();
    });

    it('keys', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 6; ++i) {
            let n = new TreeNode();
            n.key = i * 2;
            n.value = `N${i}`;
            t.insertUnique(n);
        }

        let actual = [];

        for (let k of t.keys()) {
            actual.push(k);
        }
        let expected = [2, 4, 6, 8, 10];
        should.deepEqual(expected, actual);

        done();
    });

    it('values', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 6; ++i) {
            let n = new TreeNode();
            n.key = i * 2;
            n.value = `N${i}`;
            t.insertUnique(n);
        }

        let actual = [];

        for (let v of t.values()) {
            actual.push(v);
        }
        let expected = ['N1', 'N2', 'N3', 'N4', 'N5'];
        should.deepEqual(expected, actual);

        done();
    });

    it('entries', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 6; ++i) {
            let n = new TreeNode();
            n.key = i * 2;
            n.value = `N${i}`;
            t.insertUnique(n);
        }

        let actual = [];

        for (let [k, v] of t.entries()) {
            actual.push([k, v]);
        }
        let expected = [[2, 'N1'], [4, 'N2'], [6, 'N3'], [8, 'N4'], [10, 'N5']];
        should.deepEqual(expected, actual);

        done();
    });

    it('forward stl-like iterator', function(done) {
        let [t, ...ignore] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let actual = [];
        for (let it = t.begin(); !it.equals(t.end()); it.next()) {
            actual.push(it.node.key);
        }
        let expected = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
        should.deepEqual(expected, actual);

        done();
    });

    it('forward stl-like iterator; empty tree', function(done) {
        let t = new Tree();
        let actual = [];
        for (let it = t.begin(); !it.equals(t.end()); it.next()) {
            actual.push(it.node.key);
        }
        let expected = [];
        should.deepEqual(expected, actual);

        done();
    });

    it('backward stl-like iterator', function(done) {
        let [t, ...ignore] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let actual = [];
        for (let it = t.rbegin(); !it.equals(t.rend()); it.next()) {
            actual.push(it.node.key);
        }
        let expected = [32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
        should.deepEqual(expected, actual);

        done();
    });

    it('backward stl-like iterator; empty tree', function(done) {
        let t = new Tree();
        let actual = [];
        for (let it = t.rbegin(); !it.equals(t.rend()); it.next()) {
            actual.push(it.node.key);
        }
        let expected = [];
        should.deepEqual(expected, actual);

        done();
    });

    it('tree with keys and values', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 6; ++i) {
            let n = new TreeNode();
            n.key = i * 2;
            n.value = `N${i}`;
            t.insertUnique(n);
        }

        let actual = [];
        for (let [k, v] of t) {
            actual.push([k, v]);
        }
        let expected = [[2, 'N1'], [4, 'N2'], [6, 'N3'], [8, 'N4'], [10, 'N5']];
        should.deepEqual(expected, actual);

        done();
    });

    it('insertUnique', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 4; ++i) {
            let n = new TreeNode();
            n.key = 1;
            n.value = `N${i}`;
            let res = t.insertUnique(n);
            if (i === 1) {
                should.ok(res.wasAdded);
                should.ok(!res.wasReplaced);
                should.strictEqual(1, res.iterator.key);
                should.strictEqual('N1', res.iterator.value);
            }
            else {
                should.ok(!res.wasAdded);
                should.ok(!res.wasReplaced);
            }
        }
        should.equal(1, t.size());

        done();
    });

    it('insertOrUpdate', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 4; ++i) {
            let n = new TreeNode();
            n.key = 1;
            n.value = `N${i}`;
            let res = t.insertOrReplace(n);
            if (i === 1) {
                should.ok(res.wasAdded);
                should.ok(!res.wasReplaced);
                should.strictEqual(1, res.iterator.key);
                should.strictEqual(`N${i}`, res.iterator.value);
            }
            else {
                should.ok(!res.wasAdded);
                should.ok(res.wasReplaced);
                should.strictEqual(1, res.iterator.key);
                should.strictEqual(`N${i}`, res.iterator.value);
            }
        }
        should.equal(1, t.size());

        done();
    });

    it('insertMulti', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 4; ++i) {
            let n = new TreeNode();
            n.key = 1;
            n.value = `N${i}`;
            let res = t.insertMulti(n);
            should.ok(res.wasAdded);
            should.ok(!res.wasReplaced);
            should.strictEqual(1, res.iterator.key);
            should.strictEqual(`N${i}`, res.iterator.value);
        }
        should.equal(3, t.size());

        done();
    });

    it('insertMulti; lowerBound/upperBound range; same values', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 6; ++i) {
            let n = new TreeNode();
            n.key = 12;
            n.value = `N${i}`;
            t.insertMulti(n);
        }

        let from = t.lowerBound(12);
        let to = t.upperBound(12);
        let actual = [];
        for (let it = from; !it.equals(to); it.next()) {
            actual.push(it.value);
        }
        let expected = ['N1', 'N2', 'N3', 'N4', 'N5'];
        should.deepEqual(expected, actual);

        done();
    });

    it('insertMulti; lowerBound/upperBound range; same values', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 6; ++i) {
            let n = new TreeNode();
            n.key = 12;
            n.value = `N${i}`;
            t.insertUnique(n);
        }

        let from = t.lowerBound(12);
        let to = t.upperBound(12);
        let actual = [];
        for (let it = from; !it.equals(to); it.next()) {
            let n = it.node;
            actual.push(n.value);
        }
        let expected = ['N1'];
        should.deepEqual(expected, actual);
        should.equal(1, t.size());

        done();
    });

    it('insertOrReplace; lowerBound/upperBound range; same values', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 6; ++i) {
            let n = new TreeNode();
            n.key = 12;
            n.value = `N${i}`;
            t.insertOrReplace(n);
        }

        let from = t.lowerBound(12);
        let to = t.upperBound(12);
        let actual = [];
        for (let it = from; !it.equals(to); it.next()) {
            let n = it.node;
            actual.push(n.value);
        }
        let expected = ['N5'];
        should.deepEqual(expected, actual);
        should.equal(1, t.size());

        done();
    });

    it('lowerBound/upperBound range; regular iteration with forward iterator', function(done) {
        let [t, ...ignore] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let actual = [];
        let from = t.lowerBound(0);
        let to = t.upperBound(50);
        let it = from;
        while (!it.equals(to)) {
            actual.push(it.node.key);
            it.next();
        }
        let expected = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
        should.deepEqual(expected, actual);

        done();
    });

    it('lowerBound/upperBound range; opposite iteration with forward iterator', function(done) {
        let [t, ...ignore] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let actual = [];
        let from = t.lowerBound(0);
        let to = t.upperBound(50);
        let it = to;
        while (!it.equals(from)) {
            it.prev();
            actual.push(it.node.key);
        }
        let expected = [32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
        should.deepEqual(expected, actual);

        done();
    });

    it('lowerBound/upperBound range; regular iteration with backward iterator', function(done) {
        let [t, ...ignore] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let actual = [];
        let from = new ReverseIterator(t.upperBound(50));
        let to = new ReverseIterator(t.lowerBound(0));
        let it = from;
        while (!it.equals(to)) {
            actual.push(it.node.key);
            it.next();
        }
        let expected = [32, 30, 28, 26, 24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
        should.deepEqual(expected, actual);

        done();
    });

    it('lowerBound/upperBound range; opposite iteration with backward iterator', function(done) {
        let [t, ...ignore] =
            buildTree(2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32);
        let actual = [];
        let from = new ReverseIterator(t.upperBound(50));
        let to = new ReverseIterator(t.lowerBound(0));
        let it = to;
        while (!it.equals(from)) {
            it.prev();
            actual.push(it.node.key);
        }
        let expected = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
        should.deepEqual(expected, actual);

        done();
    });

    it('tree with custom comparison function', function(done) {
        /* Test ability to compare alphanumeric structures like ['A',123]
           First string portion is compared. If string portions of two objects are equal then numeric portions are compared */
        class Id {
            constructor(a, n) {
                this.alpha = a;
                this.num = n;
            }
        }

        function compareIds(idLhs, idRhs) {
            if (idLhs.alpha < idRhs.alpha) {
                return -1;
            }
            else if (idLhs.alpha > idRhs.alpha) {
                return 1;
            }
            else {
                if (idLhs.num < idRhs.num) {
                    return -1;
                }
                else if (idLhs.num > idRhs.num) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        }

        let t = new Tree();
        t.compare = compareIds;
        addNodes(t, new Id('B', 8), new Id('A', 340), new Id('A', 12), new Id('AA', 147));

        let actual = [];
        for (let k of t) {
            actual.push([k.alpha, k.num]);
        }
        let expected = [['A', 12], ['A', 340], ['AA', 147], ['B', 8]];
        should.deepEqual(expected, actual);

        done();
    });

    it('toStringTag; keys only', function(done) {
        let expected = '[object Tree]';
        let actual = Object.prototype.toString.call(new Tree());
        should.strictEqual(expected, actual);

        done();
    });

    it('toString; keys only', function(done) {
        let t = new Tree();
        t.valuePolicy = new KeyValuePolicy();
        for (let i = 1; i < 6; ++i) {
            let n = new TreeNode();
            n.key = i * 2;
            n.value = `N${i}`;
            t.insertOrReplace(n);
        }
        let expected = '{2:N1,4:N2,6:N3,8:N4,10:N5}';
        let actual = t.toString();
        should.strictEqual(expected, actual);

        done();
    });

    it('toString; keys and values', function(done) {
        let [t, ...ignore] =
            buildTree(2, 4, 6);
        let expected = '{2,4,6}';
        let actual = t.toString();
        should.strictEqual(expected, actual);

        done();
    });

    it('species; on object', function(done) {
        let t = new Tree();
        let ctr = Object.getPrototypeOf(t).constructor[Symbol.species];
        let actual = new ctr();
        should.ok(actual instanceof Tree);

        done();
    });

    it('species; on class', function(done) {
        let ctr = Tree[Symbol.species];
        let actual = new ctr();
        should.ok(actual instanceof Tree);

        done();
    });

});
