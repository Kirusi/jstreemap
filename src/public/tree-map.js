/** An implementation of red-black tree */
const {Tree} = require('../internal/tree');
/** Classes that regulate whether tree nodes hold keys only, or key-value pairs */
const {KeyValuePolicy} = require('../internal/policies');
const {TreeNode} = require('../internal/tree-node');

/**
 * This is an associative container class storing key-value pairs in ascending order
 * @example
 * let map = new TreeMap();
 *
 * // add few values
 * map.set(1, 'a');
 * map.set(2, 'b');
 *
 * // find a value by key
 * let v = map.get(1); // << 'a'
 */
class TreeMap {
    /*======================================================
     * Methods of ES6 Map
     *======================================================*/

    /**
     *
     * @param {*} [iterable] Another iterable object whose key-value pairs are added into the newly created map.
     */
    constructor(iterable) {
        /** Internal tree */
        this.__t = new Tree();
        this.__t.valuePolicy = new KeyValuePolicy();
        if ((iterable !== undefined)
            && (iterable !== null)) {
            if (iterable[Symbol.iterator] !== undefined) {
                // copy contents
                for (let [k, v] of iterable) {
                    this.set(k, v);
                }
            }
            else {
                throw new Error('TreeMap constructor accepts only iterable objects');
            }

        }
    }

    get [Symbol.toStringTag]() {
        return 'TreeMap';
    }

    static get [Symbol.species]() {
        return TreeMap;
    }

    clear() {
        this.__t.clear();
    }

    delete(key) {
        let it = this.__t.find(key);
        if (!it.equals(this.__t.end())) {
            this.__t.erase(it.node);
        }
    }

    entries() {
        return this.__t.entries();
    }

    forEach(callback) {
        for (let [k, v] of this.__t) {
            callback(v, k, this);
        }
    }

    get(key) {
        let it = this.__t.find(key);
        if (!it.equals(this.__t.end())) {
            return it.value;
        }
        else {
            return undefined;
        }
    }

    has(key) {
        let it = this.__t.find(key);
        if (!it.equals(this.__t.end())) {
            return true;
        }
        else {
            return false;
        }
    }

    keys() {
        return this.__t.keys();
    }

    set(k, v) {
        let n = new TreeNode();
        n.key = k;
        n.value = v;
        this.__t.insertOrReplace(n);
    }

    /**
     * @returns {Number} number of key-value pairs in the map
     */
    get size() {
        return this.__t.size();
    }

    values() {
        return this.__t.values();
    }

    [Symbol.iterator]() {
        return this.__t[Symbol.iterator]();
    }

    /*======================================================
     * More methods
     *======================================================*/
    backwards() {
        return this.__t.backwards();
    }

    /*======================================================
     * STL-like methods
     *======================================================*/

    begin() {
        return this.__t.begin();
    }

    end() {
        return this.__t.end();
    }

    find(key) {
        return this.__t.find(key);
    }

    insertUnique(key) {
        return this.__t.insertUnique(key);
    }

    insertOrReplace(key) {
        return this.__t.insertOrReplace(key);
    }

    lowerBound(key) {
        return this.__t.lowerBound(key);
    }

    rbegin() {
        return this.__t.rbegin();
    }

    rend() {
        return this.__t.rend();
    }

    upperBound(key) {
        return this.__t.upperBound(key);
    }
}

module.exports = {
    TreeMap: TreeMap,
};