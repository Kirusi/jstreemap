'use strict';

// Enables you to require modules using relative paths
const amp = require('app-module-path');
const path = require('path');
const srcPath = path.resolve(__dirname, '../src');
amp.addPath(srcPath);
const should = require('should');
const {Node} = require('red-black-tree');

function createNode(id) {
    let n = new Node();
    n.id = id;
    return n;
}
function setPointers(node, p, l, r) {
    node.parent = p;
    node.left = l;
    node.right = r;
}

function createErrorMsg(node, label, expected, actual) {
    let expectedLabel = expected === null ? 'null' : expected.id;
    let actualLabel = actual === null ? 'null' : actual.id;
    let msg = `Invalid node '${node.id}'. Wrong '${label}' member. Expected: '${expectedLabel}'. Actual: '${actualLabel}'.`;
    return msg;
}

function validatePointers(node, p, l, r) {
    should.ok(node.parent === p, createErrorMsg(node, 'parent', p, node.parent));
    should.ok(node.left === l, createErrorMsg(node, 'left', l, node.left));
    should.ok(node.right === r, createErrorMsg(node, 'right', r, node.right));
}

describe('RedBlackTree tests', function() {

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

    it('Node.replaceChild; null pointer', function(done) {
        let p = new Node();
        let n = new Node();
        try {
            p.replaceChild(null, n);
            throw new Error('Failed to detect error');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('null pointer'), msg);
        }

        done();
    });

    it('Node.replaceChild; left child', function(done) {
        let p = createNode('p');
        let l = createNode('l');
        let r = createNode('r');
        let n = createNode('n');
        setPointers(p, null, l, r);
        setPointers(l, p, null, null);
        setPointers(r, p, null, null);
        p.replaceChild(l, n);
        validatePointers(p, null, n, r);

        done();
    });

    it('Node.replaceChild; right child', function(done) {
        let p = createNode('p');
        let l = createNode('l');
        let r = createNode('r');
        let n = createNode('n');
        setPointers(p, null, l, r);
        setPointers(l, p, null, null);
        setPointers(r, p, null, null);
        p.replaceChild(r, n);
        validatePointers(p, null, l, n);

        done();
    });

    it('Node.replaceChild; left child', function(done) {
        let p = createNode('p');
        let l = createNode('l');
        let r = createNode('r');
        let n = createNode('n');
        setPointers(p, null, l, r);
        setPointers(l, p, null, null);
        setPointers(r, p, null, null);
        p.replaceChild(l, n);
        validatePointers(p, null, n, r);

        done();
    });

    it('Node.replaceChild; invalid child', function(done) {
        let p = createNode('p');
        let l = createNode('l');
        let r = createNode('r');
        let n = createNode('n');
        setPointers(p, null, l, r);
        setPointers(l, p, null, null);
        setPointers(r, p, null, null);
        try {
            p.replaceChild(n, l);
            throw new Error('Failed to detect error');
        }
        catch (err) {
            let msg = err.message;
            should.ok(msg.includes('not a child'), msg);
        }
        done();
    });
/*
    it('Node.rotateRight; all nodes', function(done) {
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
        X.rotateRight();
        validatePointers(p, null, Y, n);
        validatePointers(n, p, null, null);
        validatePointers(X, Y, b, c);
        validatePointers(Y, p, a, X);
        validatePointers(a, Y, null, null);
        validatePointers(b, X, null, null);
        validatePointers(b, X, null, null);

        done();
    });
*/
});