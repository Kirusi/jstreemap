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

void insert_case1(struct node *n)
{
 if (parent(n) == NULL)
  n->color = BLACK;
}

void insert_case3(struct node *n)
{
 parent(n)->color = BLACK;
 uncle(n)->color = BLACK;
 grandparent(n)->color = RED;
 insert_repair_tree(grandparent(n));
}

void insert_case4(struct node *n)
{
 struct node *p = parent(n);
 struct node *g = grandparent(n);

 if (n == g->left->right) {
  rotate_left(p);
  n = n->left;
 } else if (n == g->right->left) {
  rotate_right(p);
  n = n->right; 
 }

 insert_case4step2(n);
}

void insert_case4step2(struct node *n)
{
 struct node *p = parent(n);
 struct node *g = grandparent(n);

 if (n == p->left)
  rotate_right(g);
 else
  rotate_left(g);
 p->color = BLACK;
 g->color = RED;
}

class RedBlackTree {

    constructor() {
        this.anchor = new SetNode();
        this.anchor.size = 0;
    }
}

void delete_one_child(struct node *n)
{
 
  // Precondition: n has at most one non-leaf child.
  
 struct node *child = is_leaf(n->right) ? n->left : n->right;

 replace_node(n, child);
 if (n->color == BLACK) {
  if (child->color == RED)
   child->color = BLACK;
  else
   delete_case1(child);
 }
 free(n);
}

void delete_case1(struct node *n)
{
 if (n->parent != NULL)
  delete_case2(n);
}

void delete_case2(struct node *n)
{
 struct node *s = sibling(n);

 if (s->color == RED) {
  n->parent->color = RED;
  s->color = BLACK;
  if (n == n->parent->left)
   rotate_left(n->parent);
  else
   rotate_right(n->parent);
 }
 delete_case3(n);
}

void delete_case3(struct node *n)
{
 struct node *s = sibling(n);

 if ((n->parent->color == BLACK) &&
     (s->color == BLACK) &&
     (s->left->color == BLACK) &&
     (s->right->color == BLACK)) {
  s->color = RED;
  delete_case1(n->parent);
 } else
  delete_case4(n);
}

void delete_case4(struct node *n)
{
 struct node *s = sibling(n);

 if ((n->parent->color == RED) &&
     (s->color == BLACK) &&
     (s->left->color == BLACK) &&
     (s->right->color == BLACK)) {
  s->color = RED;
  n->parent->color = BLACK;
 } else
  delete_case5(n);
}

void delete_case5(struct node *n)
{
 struct node *s = sibling(n);

 if  (s->color == BLACK) { 
// this if statement is trivial,
//due to case 2 (even though case 2 changed the sibling to a sibling's child,
//the sibling's child can't be red, since no red parent can have a red child). 
// the following statements just force the red to be on the left of the left of the parent,
//   or right of the right, so case six will rotate correctly. 
  if ((n == n->parent->left) &&
      (s->right->color == BLACK) &&
      (s->left->color == RED)) { // this last test is trivial too due to cases 2-4.
   s->color = RED;
   s->left->color = BLACK;
   rotate_right(s);
  } else if ((n == n->parent->right) &&
             (s->left->color == BLACK) &&
             (s->right->color == RED)) {// this last test is trivial too due to cases 2-4.
   s->color = RED;
   s->right->color = BLACK;
   rotate_left(s);
  }
 }
 delete_case6(n);
}

void delete_case6(struct node *n)
{
 struct node *s = sibling(n);

 s->color = n->parent->color;
 n->parent->color = BLACK;

 if (n == n->parent->left) {
  s->right->color = BLACK;
  rotate_left(n->parent);
 } else {
  s->left->color = BLACK;
  rotate_right(n->parent);
 }
}
*/

module.exports = {
    Node: Node};