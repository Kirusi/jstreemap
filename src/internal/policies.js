/**
 * Used by sets
 * @private
 */
class KeyOnlyPolicy {
    /**
     * Returns key data from the specified node
     * @param {*} n
     */
    fetch(n) {
        return n.key;
    }

    /**
     * Copies key data from one node to another
     * @param {*} dst
     * @param {*} src
     */
    copy(dst, src) {
        dst.key = src.key;
    }

    /**
     * @returns string representation of the key
     * @param {*} node
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
     * @param {*} n
     */
    fetch(n) {
        return [n.key, n.value];
    }

    /**
     * Copies key-value data from one node to another
     * @param {*} dst
     * @param {*} src
     */
    copy(dst, src) {
        dst.key = src.key;
        dst.value = src.value;
    }

    /**
     * @returns string representation of key-value pair
     * @param {*} node
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
     * @param {*} n
     */
    fetch(n) {
        return n.value;
    }

    /**
     * Copies value data from one node to another
     * @param {*} dst
     * @param {*} src
     */
    copy(dst, src) {
        dst.value = src.value;
    }

    /**
     * @returns string representation of node's value
     * @param {*} node
     */
    toString(node) {
        return String(node.value);
    }
}

module.exports = {
    KeyOnlyPolicy: KeyOnlyPolicy,
    ValueOnlyPolicy: ValueOnlyPolicy,
    KeyValuePolicy: KeyValuePolicy
};