/**
 * Used by sets
 * @private
 */
class KeyOnlyPolicy {
  /**
   * Returns key data from the specified node
   * @param {TreeNode} n - Node to inspect
   * @returns {any} node's key
   */
  fetch(n) {
    return n.key;
  }

  /**
   * Copies key data from one node to another
   * @param {TreeNode} dst - Destination node
   * @param {TreeNode} src - Source node
   */
  copy(dst, src) {
    dst.key = src.key;
  }

  /**
   * Returns tring representation of the provided node
   * @param {TreeNode} node - Node to serialize
   * @returns {string} string representation of the key
   */
  toString(node) {
    return String(node.key);
  }
}

/**
 * Used by maps
 * @private
 */
class KeyValuePolicy {
  /**
   * Returns key-value data from the specified node
   * @param {TreeNode} n - Node to inspect
   * @returns {[any, any]} tuple of key and value
   */
  fetch(n) {
    return [n.key, n.value];
  }

  /**
   * Copies key-value data from one node to another
   * @param {TreeNode} dst - Destination node
   * @param {TreeNode} src - Source node
   */
  copy(dst, src) {
    dst.key = src.key;
    dst.value = src.value;
  }

  /**
   * Generates string representation of the node
   * @param {TreeNode} node - Node to serialize
   * @returns {string} string representation of key-value pair
   */
  toString(node) {
    return String(node.key) + ':' + String(node.value);
  }
}

/**
 * Used for iteration through values of a map
 * @private
 */
class ValueOnlyPolicy {
  /**
   * Returns data from the specified node
   * @param {any} n - Node to inspect
   * @returns {any} node value
   */
  fetch(n) {
    return n.value;
  }

  /**
   * Copies value data from one node to another
   * @param {TreeNode} dst - Destination node
   * @param {TreeNode} src - Source node
   */
  copy(dst, src) {
    dst.value = src.value;
  }

  /**
   * Returns string representation of the node
   * @param {TreeNode} node - Node to serialize
   * @returns {string} string representation of node's value
   */
  toString(node) {
    return String(node.value);
  }
}

module.exports = {
  KeyOnlyPolicy: KeyOnlyPolicy,
  ValueOnlyPolicy: ValueOnlyPolicy,
  KeyValuePolicy: KeyValuePolicy,
};
