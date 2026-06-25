import { InsertionResult } from './insertion-result.js';
import {
  IterableContainer,
  ReverseIterator,
  TreeIterator,
} from './iterators.js';
import { JsIterator, JsReverseIterator } from './js-iterators.js';
import { KeyOnlyPolicy, PolicyInterface, ValueOnlyPolicy } from './policies.js';
import { Head, NodeColors, SomeNode, TreeNode } from './tree-node.js';

/** insertion mode of a multimap, nodes with the same keys can be added */
const INSERT_MULTI = 1;
/** if a node with the same key already exists then the subsequent attempts are ignored */
const INSERT_UNIQUE = 2;
/** if a node with the same key already exists then it's value is replaced on subsequent attempts */
const INSERT_REPLACE = 3;

export type compareFunctionType = (lhs: any, rhs: any) => number;

/**
 * NodeColors.RED-black tree
 * @access private
 */
export class Tree<
  K,
  V,
  C extends IterableContainer = IterableContainer,
> implements IterableContainer {
  /** Special head node */
  public head: Head<K, V>;
  /** 3-way comparison function */
  public compare: compareFunctionType;
  /** must be an instance of KeyOnlyPolicy for sets, or KeyValuePolicy for maps */
  public valuePolicy: PolicyInterface<K, V>;
  /** default constructor of an empty tree */
  constructor() {
    this.head = new Head();
    this.compare = Tree.compare;
    this.valuePolicy = new KeyOnlyPolicy();
  }

  /**
   * @param lhs
   * @param rhs
   * @private
   * 3-way comparison, similar to strcmp and memcp in C programming language
   * @returns +1 if the value of rhs is greater than lhs
   *          -1 if the value of rhs is less than lhs
   *           0 if values are the same
   */
  static compare(lhs: any, rhs: any): number {
    if (lhs < rhs) {
      return -1;
    } else if (lhs === rhs) {
      return 0;
    }
    return 1;
  }

  /**
   * Deletes all nodes in the tree
   */
  clear(): void {
    this.head = new Head();
  }

  /**
   * Returns tree size
   * @returns {number} number of nodes in the tree
   */
  size(): number {
    return this.head.size;
  }

  /**
   * @private
   * A wrapper that calls 3-way comparison of node keys
   * @param {*} lhs
   * @param {*} rhs
   */
  compareNodes(lhs: TreeNode<K, V>, rhs: TreeNode<K, V>): number {
    return this.compare(lhs.key, rhs.key);
  }

  /**
   * @param oldNode
   * @param newNode
   * @private
   * used by rotation operations
   */
  replaceNode(oldNode: TreeNode<K, V>, newNode: TreeNode<K, V> | null): void {
    if (oldNode === newNode) {
      return;
    }
    if (oldNode.parent === null) {
      this.head.root = newNode;
    } else if (oldNode === (oldNode.parent as TreeNode<K, V>).left) {
      (oldNode.parent as TreeNode<K, V>).left = newNode;
    } else {
      (oldNode.parent as TreeNode<K, V>).right = newNode;
    }

    if (!this.isLeaf(newNode)) {
      newNode!.parent = oldNode.parent;
    }
  }

  /**
   * Rebalances tree as described below
   *
   * X                                           Y
   * / \                                         / \
   * Y   c         right rotate -->              a   X
   * / \            <--  left rotate                 / \
   * a   b                                           b   c
   * @param node
   * @private
   */
  rotateLeft(node: TreeNode<K, V>): void {
    const right = node.right as TreeNode<K, V>;
    if (this.isLeaf(right)) {
      throw new Error("rotateLeft can't be performed. The tree is corrupted");
    }
    this.replaceNode(node, right);

    node.right = right.left;
    if (right.left !== null) {
      (right.left as TreeNode<K, V>).parent = node;
    }

    right.left = node;
    node.parent = right;
  }

  /**
   * Rebalances tree as described in rotateLeft
   * @param {TreeNode} node - parent node
   */
  rotateRight(node: TreeNode<K, V>): void {
    const left = node.left as TreeNode<K, V>;
    if (this.isLeaf(left)) {
      throw new Error("rotateRight can't be performed. The tree is corrupted");
    }
    this.replaceNode(node, left);

    node.left = left.right;
    if (left.right !== null) {
      (left.right as TreeNode<K, V>).parent = node;
    }

    left.right = node;
    node.parent = left;
  }

  /**
   * Returns a boolean indicating whether the given node should not be traversed (head or null)
   * @param {TreeNode} node - node to inspect
   * @returns {boolean} true - for null pointers and head node; false - for all other nodes
   */
  isLeaf(node: SomeNode<K, V>): boolean {
    if (node === null || node === this.head) {
      return true;
    }
    return false;
  }

  /**
   * Leaf nodes are considered 'black'. All real nodes contain 'color' data member
   * @param {TreeNode} node - node to inspect
   * @returns {number} node color
   */
  fetchColor(node: TreeNode<K, V>): number {
    if (this.isLeaf(node)) {
      return NodeColors.BLACK;
    }
    return node.color;
  }

  /**
   * Tests a node for 'blackness'.
   * @param {TreeNode} node - node to inspect
   * @returns {boolean} - true when node color is NodeColors.BLACK
   */
  isBlack(node: TreeNode<K, V>): boolean {
    return this.fetchColor(node) === NodeColors.BLACK;
  }

  /**
   * Tests node for 'redness'.
   * @param {TreeNode} node - node to inspect
   * @returns {boolean} - true when node color is NodeColors.RED
   */
  isRed(node: TreeNode<K, V>): boolean {
    return this.fetchColor(node) === NodeColors.RED;
  }

  /* ===========================
       INSERT
       =========================== */
  /**
   * A node will be inserted into the tree even if nodes with the same key already exist
   * @param {TreeNode} node - node to use
   * @returns {InsertionResult} indicates whether a node was added and provides iterator to it.
   */
  insertMulti(node: TreeNode<K, V>): InsertionResult<TreeIterator<K, V>> {
    return this.insertNode(node, INSERT_MULTI);
  }

  /**
   * The node is inserted into the tree only if nodes with the same key do not exist there
   * @param {TreeNode} node - node to use
   * @returns {InsertionResult} indicates whether a node was added and provides iterator to it.
   */
  insertUnique(node: TreeNode<K, V>): InsertionResult<TreeIterator<K, V>> {
    return this.insertNode(node, INSERT_UNIQUE);
  }

  /**
   * The node is inserted. If a node with the same key exists it's value will be replaced by the value of the new node
   * @param {TreeNode} node - node to use
   * @returns {InsertionResult} indicates whether a node was added and provides iterator to it.
   */
  insertOrReplace(node: TreeNode<K, V>): InsertionResult<TreeIterator<K, V>> {
    return this.insertNode(node, INSERT_REPLACE);
  }

  /**
   * @private
   * Inserts node. Updates head node. Rebalances tree.
   * @param {TreeNode} n - node
   * @param {number} mode - one of INSERT_MULTI, INSERT_UNIQUE, INSERT_REPLACE
   * @returns {InsertionResult} - indicates whether a node was added and provides iterator to it.
   */
  insertNode(
    n: TreeNode<K, V>,
    mode = INSERT_MULTI
  ): InsertionResult<TreeIterator<K, V>> {
    const res = this.insertNodeInternal(
      this.head.root as TreeNode<K, V>,
      n,
      mode
    );
    if (res.wasAdded) {
      if (this.head.size === 0) {
        this.head.root = n;
        this.head.leftmost = n;
        this.head.rightmost = n;

        n.left = this.head;
        n.right = this.head;
      } else if ((this.head.leftmost as TreeNode<K, V>).left === n) {
        this.head.leftmost = n;
        n.left = this.head;
      } else if ((this.head.rightmost as TreeNode<K, V>).right === n) {
        this.head.rightmost = n;
        n.right = this.head;
      }
      this.insertRepairTree(n);
      this.head.size += 1;
    }
    return res;
  }

  /**
   * @private
   * Inserts node according to the mode
   * @param {TreeNode} root - root node of the tree
   * @param {TreeNode} n - node to be inserted
   * @param {number} mode - one of INSERT_MULTI, INSERT_UNIQUE, INSERT_REPLACE
   * @returns {InsertionResult} - indicates whether a node was added and provides iterator to it.
   */
  insertNodeInternal(
    root: TreeNode<K, V>,
    n: TreeNode<K, V>,
    mode: number
  ): InsertionResult<TreeIterator<K, V>> {
    // recursively descend the tree until a leaf is found
    let x = root;
    let y = null;
    let rc = -1;
    // find matching node
    while (!this.isLeaf(x)) {
      y = x;
      rc = this.compareNodes(n, y);
      if (rc < 0) {
        x = y.left as TreeNode<K, V>;
      } else if (rc > 0) {
        x = y.right as TreeNode<K, V>;
      } else {
        // node with the same key value
        switch (mode) {
          case INSERT_UNIQUE:
            // it's a duplicate
            return new InsertionResult<TreeIterator<K, V>>(
              false,
              false,
              undefined
            );
          case INSERT_REPLACE:
            this.valuePolicy.copy(y, n);
            return new InsertionResult(false, true, new TreeIterator(y, this));
          default:
            // INSERT_MULTI
            x = y.right as TreeNode<K, V>;
        }
      }
    }
    if (this.isLeaf(y)) {
      n.parent = null;
      n.left = this.head;
      n.right = this.head;
    } else {
      n.parent = y;
      if (rc < 0) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        y!.left = n;
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        y!.right = n;
      }
    }
    return new InsertionResult(true, false, new TreeIterator<K, V, C>(n, this));
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
   * @param {TreeNode} n - node
   */
  insertRepairTree(n: TreeNode<K, V>): void {
    if (n.parent === null) {
      this.repairCase1(n);
    } else if (this.isBlack(n.parent as TreeNode<K, V>)) {
      /* insert_case2(n);
           // do nothing */
    } else if (this.isRed(n.uncle()!)) {
      this.repairCase3(n);
    } else {
      this.repairCase4(n);
    }
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
   * @param {TreeNode} n - node
   */
  repairCase1(n: TreeNode<K, V>): void {
    n.color = NodeColors.BLACK;
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
   * @param {TreeNode} n - node
   */
  repairCase3(n: TreeNode<K, V>): void {
    (n.parent as TreeNode<K, V>).color = NodeColors.BLACK;
    n.uncle()!.color = NodeColors.BLACK;
    n.grandparent()!.color = NodeColors.RED;
    this.insertRepairTree(n.grandparent()!);
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Insertion
   * @param {TreeNode} n - node
   */
  repairCase4(node: TreeNode<K, V>): void {
    let n = node;
    let p = n.parent as TreeNode<K, V>;
    let g = n.grandparent()!;

    if (g.left !== null && n === (g.left as TreeNode<K, V>).right) {
      this.rotateLeft(p);
      n = n.left as TreeNode<K, V>;
    } else if (g.right !== null && n === (g.right as TreeNode<K, V>).left) {
      this.rotateRight(p);
      n = n.right as TreeNode<K, V>;
    }

    p = n.parent as TreeNode<K, V>;
    g = n.grandparent()!;
    if (n === p.left) {
      this.rotateRight(g);
    } else {
      this.rotateLeft(g);
    }

    p.color = NodeColors.BLACK;
    g.color = NodeColors.RED;
  }

  /**
   * Fetch a node with the largest key value, i.e. right-most
   * @param {TreeNode} node - root node of the subtree to be evaluated
   * @returns {TreeNode} the node with the highest key for the subtree of the specified root node
   */
  fetchMaximum(node: TreeNode<K, V>): TreeNode<K, V> {
    let res = node;
    while (!this.isLeaf(res.right)) {
      res = res.right as TreeNode<K, V>;
    }

    return res;
  }

  /**
   * Returns node with the lowest key value, i.e. left-most
   * @param {TreeNode} node - root node of the subtree to be evaluated
   * @returns {TreeNode} the node with the lowest key for the subtree of the specified root node
   */
  fetchMinimum(node: TreeNode<K, V>): TreeNode<K, V> {
    let res = node;
    while (!this.isLeaf(res.left)) {
      res = res.left as TreeNode<K, V>;
    }

    return res;
  }

  /* ===========================
       ERASE
       =========================== */
  /**
   * Removes node from the tree
   * @param {TreeNode} node - node to be removed
   */
  erase(node: TreeNode<K, V>): void {
    if (this.isLeaf(node)) {
      return;
    }

    this.eraseInternal(node);
    const h = this.head;
    h.size -= 1;
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param {TreeNode} node - node
   */
  eraseInternal(nodeParam: TreeNode<K, V>): void {
    let node = nodeParam;
    if (!this.isLeaf(node.left) && !this.isLeaf(node.right)) {
      const pred = this.fetchMaximum(node.left as TreeNode<K, V>);

      this.valuePolicy.copy(node, pred);
      node = pred;
    }

    const child = (
      this.isLeaf(node.right) ? node.left : node.right
    ) as TreeNode<K, V>;

    if (this.isBlack(node)) {
      this.eraseCase1(node);
    }
    this.replaceNode(node, child);
    if (this.head.size === 2) {
      if (!this.isLeaf(child)) {
        // Root node must be NodeColors.BLACK
        child.color = NodeColors.BLACK;
      }
    }

    const h = this.head;
    if (this.isLeaf(child)) {
      /* The node didn't have children and it was removed
               the head needs to update leftmost, rightmost pointers */
      if (h.leftmost === node) {
        const p = node.parent as TreeNode<K, V>;
        if (p === null) {
          h.leftmost = h;
        } else {
          h.leftmost = p;
          p.left = h;
        }
      }
      if (h.rightmost === node) {
        const p = node.parent as TreeNode<K, V>;
        if (p === null) {
          h.rightmost = h;
        } else {
          h.rightmost = p;
          p.right = h;
        }
      }
    } else {
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
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param {*} node
   */
  eraseCase1(node: TreeNode<K, V>): void {
    if (node.parent !== null) {
      this.eraseCase2(node);
    }
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param {*} node
   */
  eraseCase2(node: TreeNode<K, V>): void {
    const s = node.sibling()!;

    if (this.isRed(s)) {
      (node.parent as TreeNode<K, V>).color = NodeColors.RED;
      s.color = NodeColors.BLACK;

      if (node === (node.parent as TreeNode<K, V>).left) {
        this.rotateLeft(node.parent as TreeNode<K, V>);
      } else {
        this.rotateRight(node.parent as TreeNode<K, V>);
      }
    }
    this.eraseCase3(node);
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param {*} node
   */
  eraseCase3(node: TreeNode<K, V>): void {
    const s = node.sibling()!;
    const p = node.parent as TreeNode<K, V>;
    if (
      this.isBlack(p) &&
      this.isBlack(s) &&
      this.isBlack(s.left as TreeNode<K, V>) &&
      this.isBlack(s.right as TreeNode<K, V>)
    ) {
      s.color = NodeColors.RED;
      this.eraseCase1(p);
    } else {
      this.eraseCase4(node);
    }
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param {*} node
   */
  eraseCase4(node: TreeNode<K, V>): void {
    const s = node.sibling()!;
    const p = node.parent as TreeNode<K, V>;
    if (
      this.isRed(p) &&
      this.isBlack(s) &&
      this.isBlack(s.left as TreeNode<K, V>) &&
      this.isBlack(s.right as TreeNode<K, V>)
    ) {
      s.color = NodeColors.RED;
      p.color = NodeColors.BLACK;
    } else {
      this.eraseCase5(node);
    }
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param {*} node
   */
  eraseCase5(node: TreeNode<K, V>): void {
    const s = node.sibling()!;
    const p = node.parent as TreeNode<K, V>;
    /* The check below is unnecessary
           due to case 2 (even though case 2 changed the sibling to a sibling's child,
           the sibling's child can't be NodeColors.RED, since no NodeColors.RED parent can have a NodeColors.RED child). */
    /* if ((!this.isLeaf(s))
               && this.isBlack(s)) { */

    /* the following statements just force the NodeColors.RED to be on the left of the left of the parent,
           or right of the right, so case six will rotate correctly. */
    if (
      node === p.left &&
      this.isRed(s.left as TreeNode<K, V>) &&
      this.isBlack(s.right as TreeNode<K, V>)
    ) {
      s.color = NodeColors.RED;
      (s.left as TreeNode<K, V>).color = NodeColors.BLACK;
      this.rotateRight(s);
    } else if (
      node === p.right &&
      this.isBlack(s.left as TreeNode<K, V>) &&
      this.isRed(s.right as TreeNode<K, V>)
    ) {
      s.color = NodeColors.RED;
      (s.right as TreeNode<K, V>).color = NodeColors.BLACK;
      this.rotateLeft(s);
    }
    //}
    this.eraseCase6(node);
  }

  /**
   * @private
   * The method is described at: https://en.wikipedia.org/wiki/Red%E2%80%93black_tree#Removal
   * @param {*} node
   */
  eraseCase6(node: TreeNode<K, V>): void {
    const s = node.sibling()!;
    const p = node.parent as TreeNode<K, V>;
    s.color = this.fetchColor(p);
    p.color = NodeColors.BLACK;

    if (node === p.left) {
      (s.right as TreeNode<K, V>).color = NodeColors.BLACK;
      this.rotateLeft(p);
    } else {
      (s.left as TreeNode<K, V>).color = NodeColors.BLACK;
      this.rotateRight(p);
    }
  }

  /* ===========================
       SEARCH BY KEY
       =========================== */
  /**
   * Returns an iterator for a given key
   * @param {K} k - key value
   * @returns {TreeIterator} an iterator pointing to a node with matching key value. If node is not found then end() iterator is returned.
   */
  find(k: K): TreeIterator<K, V, C> {
    let x = this.head.root as TreeNode<K, V>;
    while (!this.isLeaf(x)) {
      const rc = this.compare(x.key, k);
      if (rc > 0) {
        x = x.left as TreeNode<K, V>;
      } else if (rc < 0) {
        x = x.right as TreeNode<K, V>;
      } else {
        return new TreeIterator<K, V, C>(x, this);
      }
    }
    return new TreeIterator<K, V, C>(this.head, this);
  }

  /**
   * Returns an iterator for a node that has a key of equal or less value
   * @param {K} k - key value
   * @returns {TreeIterator} an iterator pointing to the first node in the tree that is not less than
   * (i.e. greater or equal to) the specified key value, or end() if no such node is found.
   */
  lowerBound(k: K): TreeIterator<K, V, C> {
    let y: any = this.head;
    let x = y.root as TreeNode<K, V>;
    while (!this.isLeaf(x)) {
      const rc = this.compare(x.key, k);
      if (rc >= 0) {
        y = x;
        x = x.left as TreeNode<K, V>;
      } else {
        x = x.right as TreeNode<K, V>;
      }
    }
    return new TreeIterator<K, V, C>(y, this);
  }

  /**
   * Returns an iterator for a node of a value greater than provided key
   * @param {K} k - key value
   * @returns {TreeIterator} an iterator pointing to the first node in the tree that is greater than
   * the specified key value, or end() if no such node is found.
   */
  upperBound(k: K): TreeIterator<K, V, C> {
    let y: any = this.head;
    let x = y.root;
    while (!this.isLeaf(x)) {
      const rc = this.compare(x.key, k);
      if (rc > 0) {
        y = x;
        x = x.left;
      } else {
        x = x.right;
      }
    }
    return new TreeIterator<K, V, C>(y, this);
  }

  /* ===========================
       ITERATORS
       =========================== */

  /**
   * Returns iterator to the first element or END
   * @returns {TreeIterator} iterator pointing to the node with the lowest key
   */
  begin(): TreeIterator<K, V, C> {
    return new TreeIterator(this.head.leftmost, this);
  }

  /**
   * Returns iterator to a position after the last element
   * @returns {TreeIterator} iterator pointing to the node following the node with the highest key
   */
  end(): TreeIterator<K, V, C> {
    return new TreeIterator(this.head, this);
  }

  /**
   * Returns iterator to the first element for reverse iterator
   * @returns {ReverseIterator} iterator pointing to the node with the highest key
   */
  rbegin(): ReverseIterator<K, V, C> {
    return new ReverseIterator(this.head.rightmost, this);
  }

  /**
   * Returns `end` iterator for reverse iteration, e.g. pointing to a position after the last element
   * @returns {ReverseIterator} iterator pointing to the node preceding the node with the lowest key
   */
  rend(): ReverseIterator<K, V, C> {
    return new ReverseIterator(this.head, this);
  }

  /**
   * @private
   * provides support for ES6 forward iteration
   */
  jsBegin(): TreeNode<K, V> {
    return this.head.leftmost as TreeNode<K, V>;
  }

  /**
   * @private
   * provides support for ES6 forward iteration
   */
  jsEnd(): TreeNode<K, V> {
    return this.head as unknown as TreeNode<K, V>;
  }

  /**
   * @private
   * provides support for ES6 reverse iteration
   */
  jsRbegin(): TreeNode<K, V> {
    return this.head.rightmost as TreeNode<K, V>;
  }

  /**
   * @private
   * provides support for ES6 forward iteration
   */
  jsRend(): TreeNode<K, V> {
    return this.head as unknown as TreeNode<K, V>;
  }

  /**
   * Returns the next node with the larger key value
   * @param {TreeNode} node - node to iterate from
   * @returns {TreeNode} node following the specified node in ascending order of their keys
   */
  next(node: TreeNode<K, V>): TreeNode<K, V> {
    let n = node;
    if (n === (this.head as unknown as TreeNode<K, V>)) {
      return this.head.leftmost as TreeNode<K, V>;
    }
    if (n.right === this.head) {
      return this.head as unknown as TreeNode<K, V>;
    }
    if (n.right !== null) {
      const res = this.fetchMinimum(n.right as TreeNode<K, V>);
      return res;
    }
    while ((n.parent as TreeNode<K, V>).left !== n) {
      n = n.parent as TreeNode<K, V>;
    }
    return n.parent as TreeNode<K, V>;
  }

  /**
   * Returns previous node
   * @param {TreeNode} node - node to iterate from
   * @returns {TreeNode} node preceding the specified node in ascending order of their keys
   */
  prev(node: TreeNode<K, V>): TreeNode<K, V> {
    let n = node;
    if (n === (this.head as unknown as TreeNode<K, V>)) {
      return this.head.rightmost as TreeNode<K, V>;
    }
    if (n.left === this.head) {
      return this.head as unknown as TreeNode<K, V>;
    }
    if (n.left !== null) {
      const res = this.fetchMaximum(n.left as TreeNode<K, V>);
      return res;
    }
    while ((n.parent! as TreeNode<K, V>).right !== n) {
      n = n.parent as TreeNode<K, V>;
    }
    return n.parent as TreeNode<K, V>;
  }

  /**
   * ES6 forward iteration
   * @returns {JsIterator} returns forward iterator for all elements in the tree
   */
  [Symbol.iterator](): JsIterator<[K, V]> {
    return new JsIterator(this);
  }

  /**
   * ES6 reverse iteration
   * @returns {JsReverseIterator} returns reverse iterator for all elements in the tree
   */
  backwards(): JsReverseIterator<[K, V]> {
    return new JsReverseIterator(this);
  }

  /**
   * Method mirrors behaviour of standard maps in JS
   * @returns {JsIterator} a new iterator that contains the [key, value] pairs for each element in the order of the keys
   */
  entries(): JsIterator<[K, V]> {
    return new JsIterator(this);
  }

  /**
   * Method mirrors behaviour of standard maps in JS
   * @returns {JsIterator} a new iterator that contains the keys for each element in the order of the keys
   */
  keys(): JsIterator<K> {
    return new JsIterator(this, new KeyOnlyPolicy());
  }

  /**
   * Method mirrors behaviour of standard maps in JS
   * @returns {JsIterator} a new iterator that contains the values for each element in the order of the keys.
   */
  values(): JsIterator<V> {
    return new JsIterator(this, new ValueOnlyPolicy());
  }

  /**
   * First element
   * @returns {[K, V] | undefined} first element of the container, or undefined if container is empty
   */
  first(): [K, V] | undefined {
    if (this.size() === 0) {
      return undefined;
    }
    const it = this.begin();
    return this.valuePolicy.fetch(it.node) as [K, V];
  }

  /**
   * Last element
   * @returns {[K, V] | undefined} last element of the container, or undefined if container is empty
   */
  last(): [K, V] | undefined {
    if (this.size() === 0) {
      return undefined;
    }
    const it = this.rbegin();
    return this.valuePolicy.fetch(it.node) as [K, V];
  }

  /**
   * String representation of the container
   * @returns {string} container's contents converted to text
   */
  toString(): string {
    const parts = [];
    for (let it = this.begin(); !it.equals(this.end()); it.next()) {
      // convert each key-value pair
      parts.push(this.valuePolicy.toString(it.node));
    }
    return `{${parts.join(',')}}`;
  }

  /**
   * Tag of object's class
   * @returns {string} String tag of this class
   */
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get [Symbol.toStringTag](): string {
    return 'Tree';
  }

  /**
   * Returns class/constructor to create a new instance
   * @returns {*} constructor object for this class
   */
  static get [Symbol.species](): any {
    return Tree;
  }
}
