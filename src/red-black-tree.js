'use strict';

const RED = 1;
const BLACK = 2;

class Node {

    constructor() {
        this.left = null;
        this.right = null;
        this.parent = null;
        this.key = null;
        this.color = RED;
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
}

class Head {
    constructor() {
        this.leftmost = this;
        this.rightmost = this;
        this.root = this;
        this.size = 0;
        this.id = 'HEAD';
    }
}

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

class Tree {
    constructor() {
        this.head = new Head();
        this.compare = compare;
    }

    clear() {
        this.head = new Head();
    }

    get size() {
        return this.head.size;
    }

    compareNodes(lhs, rhs) {
        return this.compare(lhs.key, rhs.key);
    }

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

        if (newNode !== null) {
            newNode.parent = oldNode.parent;
        }
    }

    /*
              X                                           Y
             / \                                         / \
            Y   c         right rotate -->              a   X
           / \            <--  left rotate                 / \
          a   b                                           b   c

    */

    rotateLeft(node) {
        let right = node.right;
        if (this.isLeaf(right)) {
            throw new Error('should not rotate');
        }
        this.replaceNode(node, right);

        node.right = right.left;
        if (right.left !== null) {
            right.left.parent = node;
        }

        right.left = node;
        node.parent = right;
    }

    rotateRight(node) {
        let left = node.left;
        if (this.isLeaf(left)) {
            throw new Error('should not rotate');
        }
        this.replaceNode(node, left);

        node.left = left.right;
        if (left.right !== null) {
            left.right.parent = node;
        }

        left.right = node;
        node.parent = left;
    }

    isLeaf(node) {
        if (node === null || node === this.head) {
            return true;
        }
        return false;
    }

    fetchColor(node) {
        if (this.isLeaf(node)) {
            return BLACK;
        }
        else {
            return node.color;
        }
    }

    isBlack(node) {
        return (this.fetchColor(node) === BLACK);
    }

    isRed(node) {
        return (this.fetchColor(node) === RED);
    }

    /* ===========================
       INSERT
       =========================== */
    insertNode(n) {
        this.insertNodeInternal(this.head.root, n);
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

    insertNodeInternal(root, n) {
        // recursively descend the tree until a leaf is found
        let x = root;
        let y = null;
        let rc = -1;
        while (!this.isLeaf(x)) {
            y = x;
            rc = this.compareNodes(n, y);
            if (rc < 0) {
                x = y.left;
            }
            else {
                x = y.right;
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
    }

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

    repairCase1(n) {
        n.color = BLACK;
    }

    repairCase3(n) {
        n.parent.color = BLACK;
        n.uncle().color = BLACK;
        n.grandparent().color = RED;
        this.insertRepairTree(n.grandparent());
    }

    repairCase4(n) {
        let p = n.parent;
        let g = n.grandparent();

        let nr = null;
        if ((g.left !== null) && (n === g.left.right)) {
            this.rotateLeft(p);
            n = n.left;
        }
        else if ((g.right !== null) && (n === g.right.left)) {
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

    fetchMaximum(node) {
        while (!this.isLeaf(node.right)) {
            node = node.right;
        }

        return node;
    }

    /* ===========================
       ERASE
       =========================== */
    erase(node) {
        if (this.isLeaf(node)) {
            return;
        }

        this.eraseInternal(node);
        let h = this.head;
        h.size = h.size - 1;
    }

    eraseInternal(node) {
        if (!this.isLeaf(node.left) && !this.isLeaf(node.right)) {
            let pred = this.fetchMaximum(node.left);

            // FIXME VK: fix for maps which have values
            node.key = pred.key;
            node = pred;
        }

        let child = (this.isLeaf(node.right)) ? node.left : node.right;

        if (this.isBlack(node)) {
            node.color = this.fetchColor(child);
            this.eraseCase1(node);
        }
        this.replaceNode(node, child);

        let h = this.head;
        if ((this.isLeaf(child)) && (h.leftmost === node)) {
            let p = node.parent;
            if (p !== null) {
                h.leftmost = p;
                p.left = h;
            }
            else {
                h.leftmost = h;
            }
        }
        if ((this.isLeaf(child)) && (h.rightmost === node)) {
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

    eraseCase1(node) {
        if (node.parent === null) {
            return;
        }
        else {
            this.eraseCase2(node);
        }
    }

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

    eraseCase3(node) {
        let s = node.sibling();
        let p = node.parent;
        if (this.isBlack(p) &&
			this.isBlack(s) &&
			this.isBlack(s.left) &&
			this.isBlack(s.right)) {

            s.color = RED;
            this.eraseCase1(p);
        }
        else {
            this.eraseCase4(node);
        }
    }

    eraseCase4(node) {
        let s = node.sibling();
        let p = node.parent;
        if (this.isRed(p) &&
			this.isBlack(s) &&
			this.isBlack(s.left) &&
			this.isBlack(s.right)) {

            s.color = RED;
            p.color = BLACK;
        }
        else {
            this.eraseCase5(node);
        }
    }

    eraseCase5(node) {
        let s = node.sibling();
        let p = node.parent;
        /* The check below is unnecessary
           due to case 2 (even though case 2 changed the sibling to a sibling's child,
           the sibling's child can't be red, since no red parent can have a red child).*/
        /* if ((!this.isLeaf(s)) &&
           this.isBlack(s)) { */

        /* the following statements just force the red to be on the left of the left of the parent,
           or right of the right, so case six will rotate correctly. */
        if (node === p.left &&
				this.isRed(s.left) &&
				this.isBlack(s.right)) {

            s.color = RED;
            s.left.color = BLACK;
            this.rotateRight(s);
        }
        else if (node === p.right &&
				this.isBlack(s.left) &&
				this.isRed(s.right)) {

            s.color = RED;
            s.right.color = BLACK;
            this.rotateLeft(s);
        }
        //}
        this.eraseCase6(node);
    }

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
        return y;
    }

    upperBound(k) {
        let y = this.head;
        let x = y.root;
        while (!this.isLeaf(x)) {
            let rc = this.compare(x.key, k);
            if (rc < 0) {
                y = x;
                x = x.left;
            }
            else {
                x = x.right;
            }
        }
        return y;
    }

}

module.exports = {
    Node: Node,
    Tree: Tree,
    compare: compare,
    BLACK: BLACK,
    RED: RED
};
