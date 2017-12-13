'use strict';

const RED = 1;
const BLACK = 2;

const LEAF = {color: BLACK}; //FIXME VK: figure out what leaf is?
class Node {

    constructor() {
        this.left = null;
        this.right = null;
        this.parent = null;
        this.key = null;
        this.color = BLACK;
    }

    grandparent() {
        let p = this.parent;
        if (p === null) {
            return null;
        } // No parent means no grandparent
        return p.parent;
    }

    sibling() {
        let p = this.parent;
        if (p === null) {
            return null;
        } // No parent means no sibling
        if (this === p.left) {
            return p.right;
        }
        else {
            return p.left;
        }
    }

    uncle() {
        let p = this.parent;
        if (p === null) {
            return null;
        } // No parent means no uncle
        let g = p.parent;
        if (g === null) {
            return null;
        } // No grandparent means no uncle
        return p.sibling();
    }

    replaceChild(oldC, newC) {
        if (oldC === null) {
            throw new Error('Can\'t replace a null pointer');
        }
        if (this.left === oldC) {
            this.left = newC;
        }
        else if (this.right === oldC) {
            this.right = newC;
        }
        else {
            throw new Error('specified node is not a child node');
        }
    }

    /*
              X                                           Y
             / \                                         / \
            Y   c         right rotate -->              a   X
           / \            <--  left rotate                 / \
          a   b                                           b   c

    */
    rotateLeft() {
        let Y = this;
        let X = Y.right;
        let b = X.left;
        let p = Y.parent;
        // FIXME VK: remove next if
        if (X === LEAF) {
            throw new Error('failed assertion');
        }
        Y.right = b;
        X.left = Y;
        X.parent = Y.parent;
        Y.parent = X;
        b.parent = Y;
        if (p !== null) {
            p.replaceChild(Y, X);
        }
        // (the other related parent and child links would also have to be updated)
    }

    rotateRight() {
        let X = this;
        let Y = X.left;
        let b = Y.right;
        let p = Y.parent;
        // FIXME VK: remove next if
        if (Y === LEAF) {
            // since the leaves of a red-black tree are empty, they cannot become internal nodes
            throw new Error('failed assertion');
        }
        X.left = b;
        Y.right = X;
        Y.parent = X.parent;
        X.parent = Y;
        b.parent = X;
        if (p !== null) {
            p.replaceChild(X, Y);
        }
        // (the other related parent and child links would also have to be updated)
    }
}
/*
function insert_recurse(root, n) {
    // recursively descend the tree until a leaf is found
    if (root !== null && n.key < root.key) {
        if (root.left != LEAF) {
            insert_recurse(root.left, n);
            return;
        }
        else {
            root.left = n;
        }
    }
    else if (root !== null) {
        if (root.right !== LEAF) {
            insert_recurse(root.right, n);
            return;
        }
        else {
            root.right = n;
        }
    }

    // insert new node n
    n.parent = root;
    n.left = LEAF;
    n.right = LEAF;
    n.color = RED;
}

function insert_repair_tree(n) {
    if (n.parent === null) {
        insert_case1(n);
    }
    else if (n.parent.color === BLACK) {
        insert_case2(n);
    }
    else if (n.uncle().color === RED) {
        insert_case3(n);
    }
    else {
        insert_case4(n);
    }
}

class RedBlackTree {

    constructor() {
        this.anchor = new SetNode();
        this.anchor.size = 0;
    }
}
*/

module.exports = {
    Node: Node};