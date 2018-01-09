'use strict';

/**
 * @private
 */
const RED = 1;
/**
 * @private
 */
const BLACK = 2;

/**
 * @private
 * A node for a red-black tree
 */
class TreeNode {

    /**
     * Default constructor
     */
    constructor() {
        /** left child */
        this.left = null;
        /** right child */
        this.right = null;
        /** parent node */
        this.parent = null;
        /** key object (additional 'value' data member is added in map-like classes) */
        this.key = null;
        /** by default new node is red */
        this.color = RED;
    }

    /**
     * @returns parent of parent
     */
    grandparent() {
        let p = this.parent;
        if (p === null) {
            return null;
        } // No parent means no grandparent
        return p.parent;
    }

    /**
     * @returns the other child of the same parent
     */
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

    /**
     * @returns another child of the grandparent
     */
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