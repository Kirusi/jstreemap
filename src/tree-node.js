'use strict';

const RED = 1;
const BLACK = 2;

class TreeNode {

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

module.exports = {
    TreeNode: TreeNode,
    BLACK: BLACK,
    RED: RED
};