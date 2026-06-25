/**
 * @private
 */
export class NodeColors {
  public static RED = 1;
  public static BLACK = 2;
}

export type SomeNode<K, V> = Head<K, V> | TreeNode<K, V> | null;
/**
 * A node for a red-black tree
 * @private
 */
export class TreeNode<K, V> {
  public left: SomeNode<K, V>;
  public right: SomeNode<K, V>;
  public parent: SomeNode<K, V>;
  public key?: K;
  public value?: V;
  public color: number;
  /**
   * Default constructor
   * @private
   */
  constructor() {
    /** left child */
    this.left = null;
    /** right child */
    this.right = null;
    /** parent node */
    this.parent = null;
    /** key object (additional 'value' data member is added in map-like classes) */
    this.key = undefined;
    /** value associated with the key */
    this.value = undefined;
    /** by default new node is red */
    this.color = NodeColors.RED;
  }

  /**
   * Returns parent of parent node
   * @returns {TreeNode} parent node of parent node
   */
  grandparent(): TreeNode<K, V> | null {
    const p = this.parent as TreeNode<K, V>;
    if (p === null) {
      return null;
    } // No parent means no grandparent
    return p.parent as TreeNode<K, V>;
  }

  /**
   * Returns next sibling in the forward iteration order or `undefined`
   * @returns {TreeNode} the other child of the same parent
   */
  sibling(): TreeNode<K, V> | null {
    const p = this.parent as TreeNode<K, V>;
    if (p === null) {
      return null;
    } // No parent means no sibling
    if (this === p.left) {
      return p.right as TreeNode<K, V>;
    }
    return p.left as TreeNode<K, V>;
  }

  /**
   * Returns parent's sibling (in the forward iteration order)
   * @returns {TreeNode} another child of the grandparent
   */
  uncle(): TreeNode<K, V> | null {
    const p = this.parent as TreeNode<K, V>;
    if (p === null) {
      return null;
    } // No parent means no uncle
    const g = p.parent as TreeNode<K, V>;
    if (g === null) {
      return null;
    } // No grandparent means no uncle
    return p.sibling();
  }
}

/**
 * Special node in a tree is created for performance reasons
 * @private
 */
export class Head<K, V> {
  public leftmost: SomeNode<K, V>;
  public rightmost: SomeNode<K, V>;
  public root: SomeNode<K, V>;
  public size: number;
  public id: string;

  /**
   * default constructor
   * @ignore
   */
  constructor() {
    /** node with the smallest key */
    this.leftmost = this;
    /** node with the largest key */
    this.rightmost = this;
    /** root node of the tree */
    this.root = this;
    /** number of nodes in the tree */
    this.size = 0;
    /** extra tag used in debugging of unit tests */
    this.id = 'HEAD';
  }
}
