'use strict';

/** @ignore */
const {TreeNode, RED, BLACK} = require('./tree-node');
/** @ignore */
const {JsIterator, JsReverseIterator} = require('../public/js-iterators');
/** @ignore */
const {Iterator, ReverseIterator} = require('../public/iterators');
/** @ignore */
const {KeyOnlyPolicy, ValueOnlyPolicy, KeyValuePolicy} = require('./policies');
/** @ignore */
const {InsertionResult} = require('../public/insertion-result');

/** insertion mode of a multimap, nodes with the same keys can be added */
const INSERT_MULTI = 1;
/** if a node with the same key already exists then the subsequent attempts are ignored */
const INSERT_UNIQUE = 2;
/** if a node with the same key already exists then it's value is replaced on subsequent attempts */
const INSERT_REPLACE = 3;

/**
 * @private
 * Special node in a tree is created for performance reasons
 */
class Head {
    /** default constructor */
    constructor() {
        /** node with the smallest key */
        this.leftmost = this;
        /** node with the largest key */
        this.rightmost = this;
        /** root node of the tree */
        this.root = this;
        /** number of nodes in the tree */
        this.size = 0;
        /** extra tag used in debuggin of unit tests */
        this.id = 'HEAD';
    }
}

/**
 * @private
 * 3-way comparison, similar to strcmp and memcp in C programming language
 * @returns +1 if the value of rhs is greater than lhs
 *          -1 if the value of rhs is less than lhs
 *           0 if values are the same
 */
function compare(lhs, rhs) {
    if (lhs < rhs) {
        return -1;
    }
    else if (lhs === rhs) {
        return 0;
    }
    else {
        return 1;
    }
}

/**
 * Red-black tree
 * @access private
 */
class Tree {
    /** default constructor of an empty tree */
    constructor() {
        /** head */
        this.head = new Head();
        /** 3-way comparison function */
        this.compare = compare;
        /** must be an instance of KeyOnlyPolicy for sets, or KeyValuePolicy for maps */
        this.valuePolicy = new KeyOnlyPolicy();
    }

    /**
     * Deletes all nodes in the tree
     */
    clear() {
        this.head = new Head();
    }

    /**
     * @returns number of nodes in the tree
     */
    size() {
        return this.head.size;
    }

    /**
     * @private
     * A wrapper that calls 3-way comparison of node keys
     * @param {*} lhs
     * @param {*} rhs
     */
    compareNodes(lhs, rhs) {
        return this.compare(lhs.key, rhs.key);
    }

    /**
     * @private
     * used by rotation operations
     */
    replaceNode(oldNode, newNode) {
        if (oldNode === newNode) {
            return;
        }
        if (oldNode.parent === null) {
            this.head.root = newNode;
        }
        else {
            if (oldNode === oldNode.parent.left) {
                oldNode.parent.left = newNode;
            }
            else {
                oldNode.parent.right = newNode;
            }
        }

        if (!this.isLeaf(newNode)) {
            newNode.parent = oldNode.parent;
        }
    }

    /**
     * Rebalances tree as described below

              X                                           Y
             / \                                         / \
            Y   c         right rotate -->              a   X
           / \            <--  left rotate                 / \
          a   b                                           b   c
     * @private
     */
    rotateLeft(node) {
        let right = node.right;
        if (this.isLeaf(right)) {
            throw new Error('rotateLeft can\'t be performed. The tree is corrupted');
        }
        this.replaceNode(node, right);

        node.right = right.left;
        if (right.left !== null) {
            right.left.parent = node;
        }

        right.left = node;
        node.parent = right;
    }

    /**
     * Rebalances tree as described in rotateLeft
     * @param {*} node - parent node
     */
    rotateRight(node) {
        let left = node.left;
        if (this.isLeaf(left)) {
            throw new Error('rotateRight can\'t be performed. The tree is corrupted');
        }
        this.replaceNode(node, left);

        node.left = left.right;
        if (left.right !== null) {
            left.right.parent = node;
        }

        left.right = node;
        node.parent = left;
    }

    /**
     * @returns true - for null pointers and head node; false - for all other nodes
     * @param {*} node
     */
    isLeaf(node) {
        if (node === null || node === this.head) {
            return true;
        }
        return false;
    }

    /**
     * Leaf nodes are considered 'black'. All real nodes contain 'color' data member
     * @param {*} node
     */
    fetchColor(node) {
        if (this.isLeaf(node)) {
            return BLACK;
        }
        else {
            return node.color;
        }
    }

    /**
     * Tests a node for 'blackness'.
     * @param {*} node
     */
    isBlack(node) {
        return (this.fetchColor(node) === BLACK);
    }

    /**
     * Tests node for 'redness'.
     * @param {*} node
     */
    isRed(node) {
        return (this.fetchColor(node) === RED);
    }

    /* ===========================
       INSERT
       =========================== */
    /**
     * A node will be inserted into the tree even if nodes with the same key already exist
     * @param {*} node
     * @returns {InsertionResult} - indicates whether a node was added and provides iterator to it.
     */
    insertMulti(node) {
        return this.insertNode(node, INSERT_MULTI);
    }

    /**
     * The node is inserted into the tree only if nodes with the same key do not exist there
     * @param {*} node
     * @returns {InsertionResult} - indicates whether a node was added and provides iterator to it.
     */
    insertUnique(node) {
        return this.insertNode(node, INSERT_UNIQUE);
    }

    /**
     * The node is inserted. If a node with the same key exists it's value will be replaced by the value of the new node
     * @param {*} node
     * @returns {InsertionResult} - indicates whether a node was added and provides iterator to it.
     */
    insertOrReplace(node) {
        return this.insertNode(node, INSERT_REPLACE);
    }

    /**
     * @private
     * Inserts node. Updates head node. Rebalances tree.
     * @param {*} n - node
     * @param {*} mode - one of INSERT_MULTI, INSERT_UNIQUE, INSERT_REPLACE
     * @returns {InsertionResult} - indicates whether a node was added and provides iterator to it.
     */
    insertNode(n, mode = INSERT_MULTI) {
        let res = this.insertNodeInternal(this.head.root, n, mode);
        if (res.wasAdded) {
            if (this.head.size === 0) {
                this.head.root = n;
                this.head.leftmost = n;
                this.head.rightmost = n;

                n.left = this.head;
                n.right = this.head;
            }
            else if (this.head.leftmost.left === n) {
                this.head.leftmost = n;
                n.left = this.head;
            }
            else if (this.head.rightmost.right === n) {
                this.head.rightmost = n;
                n.right = this.head;
            }
            this.insertRepairTree(n);
            this.head.size = this.head.size + 1;
        }
        return res;
    }

    /**
     * @private
     * Inserts node according to the mode
     * @param {*} root - root node of the tree
     * @param {*} n - node to be inserted
     * @param {*} mode - one of INSERT_MULTI, INSERT_UNIQUE, INSERT_REPLACE
     * @returns {InsertionResult} - indicates whether a node was added and provides iterator to it.
     */
    insertNodeInternal(root, n, mode) {
        // recursively descend the tree until a leaf is found
        let x = root;
        let y = null;
        let rc = -1;
        // find matching node
        while (!this.isLeaf(x)) {
            y = x;
            rc = this.compareNodes(n, y);
            if (rc < 0) {
                x = y.left;
            }
            else if (rc > 0) {
                x = y.right;
            }
            else {
                // node with the same key value
                switch (mode) {
                    case INSERT_UNIQUE:
                        // it's a duplicate
                        return new InsertionResult(false, false, undefined);
                    case INSERT_REPLACE:
                        this.valuePolicy.copy(y, n);
                        return new InsertionResult(false, true, new Iterator(y, this));
                    default:
                        // INSERT_MULTI
                        x = y.right;
                }
            }
        }
        if (this.isLeaf(y)) {
            n.parent = null;
            n.left = this.head;
            n.right = this.head;
        }
        else {
            n.parent = y;
            if (rc < 0) {
                y.left = n;
            }
            else {
                y.right = n;
            }
        }
        return new InsertionResult(true, false, new Iterator(n, this));
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
     * @param {*} n - node
     */
    insertRepairTree(n) {
        if (n.parent === null) {
            this.repairCase1(n);
        }
        else if (this.isBlack(n.parent)) {
        /* insert_case2(n);
           // do nothing */
        }
        else if (this.isRed(n.uncle())) {
            this.repairCase3(n);
        }
        else {
            this.repairCase4(n);
        }
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
     * @param {*} n - node
     */
    repairCase1(n) {
        n.color = BLACK;
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
     * @param {*} n - node
     */
    repairCase3(n) {
        n.parent.color = BLACK;
        n.uncle().color = BLACK;
        n.grandparent().color = RED;
        this.insertRepairTree(n.grandparent());
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
     * @param {*} n - node
     */
    repairCase4(n) {
        let p = n.parent;
        let g = n.grandparent();

        let nr = null;
        if ((g.left !== null)
            && (n === g.left.right)) {
            this.rotateLeft(p);
            n = n.left;
        }
        else if ((g.right !== null)
            && (n === g.right.left)) {
            this.rotateRight(p);
            n = n.right;
        }

        p = n.parent;
        g = n.grandparent();
        if (n === p.left) {
            this.rotateRight(g);
        }
        else {
            this.rotateLeft(g);
        }

        p.color = BLACK;
        g.color = RED;
    }

    /**
     * @returns the node with the highest key for the subtree of the specified root node
     * @param {*} node - root node of the subtree to be evaluated
     */
    fetchMaximum(node) {
        while (!this.isLeaf(node.right)) {
            node = node.right;
        }

        return node;
    }

    /**
     * @returns the node with the lowest key for the subtree of the specified root node
     * @param {*} node - root node of the subtree to be evaluated
     */
    fetchMinimum(node) {
        while (!this.isLeaf(node.left)) {
            node = node.left;
        }

        return node;
    }

    /* ===========================
       ERASE
       =========================== */
    /**
     * Removes node from the tree
     * @param {*} node
     */
    erase(node) {
        if (this.isLeaf(node)) {
            return;
        }

        this.eraseInternal(node);
        let h = this.head;
        h.size = h.size - 1;
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
     * @param {*} node - node
     */
    eraseInternal(node) {
        if (!this.isLeaf(node.left)
            && !this.isLeaf(node.right)) {
            let pred = this.fetchMaximum(node.left);

            this.valuePolicy.copy(node, pred);
            node = pred;
        }

        let child = (this.isLeaf(node.right)) ? node.left : node.right;

        if (this.isBlack(node)) {
            this.eraseCase1(node);
        }
        this.replaceNode(node, child);
        if (this.head.size === 2) {
            if (!this.isLeaf(child)) {
                // Root node must be BLACK
                child.color = BLACK;
            }
        }

        let h = this.head;
        if (this.isLeaf(child)) {
            /* The node didn't have children and it was removed
               the head needs to update leftmost, rightmost pointers */
            if (h.leftmost === node) {
                let p = node.parent;
                if (p !== null) {
                    h.leftmost = p;
                    p.left = h;
                }
                else {
                    h.leftmost = h;
                }
            }
            if (h.rightmost === node) {
                let p = node.parent;
                if (p !== null) {
                    h.rightmost = p;
                    p.right = h;
                }
                else {
                    h.rightmost = h;
                }
            }
        }
        else {
            // the node had a child. Now node is removed. Any references should point to the child now
            if (h.leftmost === node) {
                h.leftmost = child;
                child.left = h;
            }
            if (h.rightmost === node) {
                h.rightmost = child;
                child.right = h;
            }
        }
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
     * @param {*} node
     */
    eraseCase1(node) {
        if (node.parent === null) {
            return;
        }
        else {
            this.eraseCase2(node);
        }
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
     * @param {*} node
     */
    eraseCase2(node) {
        let s = node.sibling();

        if (this.isRed(s)) {
            node.parent.color = RED;
            s.color = BLACK;

            if (node === node.parent.left) {
                this.rotateLeft(node.parent);
            }
            else {
                this.rotateRight(node.parent);
            }
        }
        this.eraseCase3(node);
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
     * @param {*} node
     */
    eraseCase3(node) {
        let s = node.sibling();
        let p = node.parent;
        if (this.isBlack(p)
            && this.isBlack(s)
            && this.isBlack(s.left)
            && this.isBlack(s.right)) {

            s.color = RED;
            this.eraseCase1(p);
        }
        else {
            this.eraseCase4(node);
        }
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
     * @param {*} node
     */
    eraseCase4(node) {
        let s = node.sibling();
        let p = node.parent;
        if (this.isRed(p)
            && this.isBlack(s)
            && this.isBlack(s.left)
            && this.isBlack(s.right)) {

            s.color = RED;
            p.color = BLACK;
        }
        else {
            this.eraseCase5(node);
        }
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
     * @param {*} node
     */
    eraseCase5(node) {
        let s = node.sibling();
        let p = node.parent;
        /* The check below is unnecessary
           due to case 2 (even though case 2 changed the sibling to a sibling's child,
           the sibling's child can't be red, since no red parent can have a red child). */
        /* if ((!this.isLeaf(s))
               && this.isBlack(s)) { */

        /* the following statements just force the red to be on the left of the left of the parent,
           or right of the right, so case six will rotate correctly. */
        if (node === p.left
            && this.isRed(s.left)
			&& this.isBlack(s.right)) {

            s.color = RED;
            s.left.color = BLACK;
            this.rotateRight(s);
        }
        else if (node === p.right
            && this.isBlack(s.left)
            && this.isRed(s.right)) {

            s.color = RED;
            s.right.color = BLACK;
            this.rotateLeft(s);
        }
        //}
        this.eraseCase6(node);
    }

    /**
     * @private
     * The method is decribed at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
     * @param {*} node
     */
    eraseCase6(node) {
        let s = node.sibling();
        let p = node.parent;
        s.color = this.fetchColor(p);
        p.color = BLACK;

        if (node === p.left) {
            s.right.color = BLACK;
            this.rotateLeft(p);
        }
        else {
            s.left.color = BLACK;
            this.rotateRight(p);
        }
    }

    /* ===========================
       SEARCH BY KEY
       =========================== */
    /**
    * @returns an iterator pointin to a node with matching key value. If node is not found then end() iterator is returned.
    * @param {*} k - key value
    */
    find(k) {
        let y = this.head;
        let x = y.root;
        while (!this.isLeaf(x)) {
            let rc = this.compare(x.key, k);
            if (rc > 0) {
                y = x;
                x = x.left;
            }
            else if (rc < 0) {
                y = x;
                x = x.right;
            }
            else {
                return new Iterator(x, this);
            }
        }
        return new Iterator(this.head, this);
    }

    /**
     * @returns an iterator pointing to the first node in the tree that is not less than
     * (i.e. greater or equal to) the specified key value, or end() if no such node is found.
     * @param {*} k - key value
     */
    lowerBound(k) {
        let y = this.head;
        let x = y.root;
        while (!this.isLeaf(x)) {
            let rc = this.compare(x.key, k);
            if (rc >= 0) {
                y = x;
                x = x.left;
            }
            else {
                x = x.right;
            }
        }
        return new Iterator(y, this);
    }

    /**
     * @returns an iterator pointing to the first node in the tree that is greater than
     * the specified key value, or end() if no such node is found.
     * @param {*} k - key value
     */
    upperBound(k) {
        let y = this.head;
        let x = y.root;
        while (!this.isLeaf(x)) {
            let rc = this.compare(x.key, k);
            if (rc > 0) {
                y = x;
                x = x.left;
            }
            else {
                x = x.right;
            }
        }
        return new Iterator(y, this);
    }

    /* ===========================
       ITERATORS
       =========================== */

    /**
     * @returns iterator pointing to the node with the lowest key
     */
    begin() {
        return new Iterator(this.head.leftmost, this);
    }

    /**
     * @returns iterator pointing to the node following the node with the highest key
     */
    end() {
        return new Iterator(this.head, this);
    }

    /**
     * @returns iterator pointing to the node with the highest key
     */
    rbegin() {
        return new ReverseIterator(this.head.rightmost, this);
    }

    /**
     * @returns iterator pointing to the node preceding the node with the lowest key
     */
    rend() {
        return new ReverseIterator(this.head, this);
    }

    /**
     * @private
     * provides support for ES6 forward iteration
     */
    jsBegin() {
        return this.head.leftmost;
    }

    /**
     * @private
     * provides support for ES6 forward iteration
     */
    jsEnd() {
        return this.head;
    }

    /**
     * @private
     * provides support for ES6 reverse iteration
     */
    jsRbegin() {
        return this.head.rightmost;
    }

    /**
     * @private
     * provides support for ES6 forward iteration
     */
    jsRend() {
        return this.head;
    }

    /**
     * @returns node following the specified node in ascending order of their keys
     * @param {*} n - node
     */
    next(n) {
        if (n === this.head) {
            return this.head.leftmost;
        }
        if (n.right === this.head) {
            return this.head;
        }
        if (n.right !== null) {
            let res = this.fetchMinimum(n.right);
            return res;
        }
        else {
            while (n.parent.left !== n) {
                n = n.parent;
            }
            return n.parent;
        }
    }

    /**
     * @returns node preceding the specified node in ascending order of their keys
     * @param {*} n - node
     */
    prev(n) {
        if (n === this.head) {
            return this.head.rightmost;
        }
        if (n.left === this.head) {
            return this.head;
        }
        if (n.left !== null) {
            let res = this.fetchMaximum(n.left);
            return res;
        }
        else {
            while (n.parent.right !== n) {
                n = n.parent;
            }
            return n.parent;
        }
    }

    /**
     * ES6 forward iteration
     */
    [Symbol.iterator]() {
        return new JsIterator(this);
    }

    /**
     * ES6 reverse iteration
     */
    backward() {
        return new JsReverseIterator(this);
    }

    /**
     * @returns a new JsIterator object that contains the [key, value] pairs for each element in the order of the keys.
     */
    entries() {
        return new JsIterator(this);
    }

    /**
     * @returns a new JsIterator object that contains the keys for each element in the order of the keys.
     */
    keys() {
        return new JsIterator(this, new KeyOnlyPolicy());
    }

    /**
     * @returns a new JsIterator object that contains the values for each element in the order of the keys.
     */
    values() {
        return new JsIterator(this, new ValueOnlyPolicy());
    }

    /**
     * @returns first element of the container, or undefined if container is empty
     */
    first() {
        if (this.size() === 0) {
            return undefined;
        }
        else {
            let it = this.begin();
            return this.valuePolicy.fetch(it.node);
        }
    }

    /**
     * @returns last element of the container, or undefined if container is empty
     */
    last() {
        if (this.size() === 0) {
            return undefined;
        }
        else {
            let it = this.rbegin();
            return this.valuePolicy.fetch(it.node);
        }
    }

    /**
     * @returns String representation of the container
     */
    toString() {
        let parts = [];
        for (let it = this.begin(); !it.equals(this.end()); it.next()) {
            // convert each key-value pair
            parts.push(this.valuePolicy.toString(it.node));
        }
        return '{' + parts.join(',') + '}';
    }

    /**
     * @returns String tag of this class
     */
    get [Symbol.toStringTag]() {
        return 'Tree';
    }

    /**
     * @returns constructor object for this class
     */
    static get [Symbol.species]() {
        return Tree;
    }

}

module.exports = {
    Tree: Tree,
    compare: compare
};
