import { TreeNode } from './tree-node.js';

export interface PolicyInterface<K, V> {
  fetch(n: TreeNode<K, V>): K | V | [K, V];
  copy(dst: TreeNode<K, V>, src: TreeNode<K, V>): void;
  toString(node: TreeNode<K, V>): string;
}

/**
 * Used by sets
 * @private
 */
export class KeyOnlyPolicy<K, V> implements PolicyInterface<K, V> {
  /**
   * Returns key data from the specified node
   * @param {TreeNode} n - Node to inspect
   * @returns {K} node's key
   */
  fetch(n: TreeNode<K, V>): K {
    return n.key as K;
  }

  /**
   * Copies key data from one node to another
   * @param {TreeNode} dst - Destination node
   * @param {TreeNode} src - Source node
   */
  copy(dst: TreeNode<K, V>, src: TreeNode<K, V>): void {
    dst.key = src.key;
  }

  /**
   * Returns string representation of the provided node
   * @param {TreeNode} node - Node to serialize
   * @returns {string} representation of the key
   */
  toString(node: TreeNode<K, V>): string {
    return String(node.key);
  }
}

/**
 * Used by maps
 * @private
 */
export class KeyValuePolicy<K, V> implements PolicyInterface<K, V> {
  /**
   * Returns key-value data from the specified node
   * @param {TreeNode} n - Node to inspect
   * @returns {[K, V]} tuple of key and value
   */
  fetch(n: TreeNode<K, V>): [K, V] {
    return [n.key as K, n.value as V];
  }

  /**
   * Copies key-value data from one node to another
   * @param {TreeNode} dst - Destination node
   * @param {TreeNode} src - Source node
   */
  copy(dst: TreeNode<K, V>, src: TreeNode<K, V>): void {
    dst.key = src.key;
    dst.value = src.value;
  }

  /**
   * Generates string representation of the node
   * @param {TreeNode} node - Node to serialize
   * @returns {string} representation of key-value pair
   */
  toString(node: TreeNode<K, V>): string {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${node.key}:${node.value}`;
  }
}

/**
 * Used for iteration through values of a map
 * @private
 */
export class ValueOnlyPolicy<K, V> implements PolicyInterface<K, V> {
  /**
   * Returns data from the specified node
   * @param {TreeNode} n - Node to inspect
   * @returns {V} node value
   */
  fetch(n: TreeNode<K, V>): V {
    return n.value as V;
  }

  /**
   * Copies value data from one node to another
   * @param {TreeNode} dst - Destination node
   * @param {TreeNode} src - Source node
   */
  copy(dst: TreeNode<K, V>, src: TreeNode<K, V>): void {
    dst.value = src.value;
  }

  /**
   * Returns string representation of the node
   * @param {TreeNode} node - Node to serialize
   * @returns {string} representation of node's value
   */
  toString(node: TreeNode<K, V>): string {
    return String(node.value);
  }
}
