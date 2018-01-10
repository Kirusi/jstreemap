/** An implementation of red-black tree */
const {Tree} = require('../internal/tree');
/** Classes that regulate whether tree nodes hold keys only, or key-value pairs */
const {KeyValuePolicy} = require('../internal/policies');
/** Node for a red-black tree */
const {TreeNode} = require('../internal/tree-node');

/**
 * This is an associative container class storing key-value pairs in ascending order. This map permits having identical keys with different values
 * @example
 * let map = new TreeMultiMap();
 * // add few values
 * map.set(1, 'a');
 * map.set(2, 'b');
 * map.set(2, 'c');
 * // find a value by key
 * let v = map.get(1); // << 'a'
 * find all values for a given key
 * // print all key-value pairs
 * let from = map.lowerBound(2);
 * let to = map.upperBound(2);
 * let it = from;
 * while (!it.equals(to)) {
 *   console.log(it.key);
 *   it.next();
 * }
 */
class TreeMultiMap {
    /*======================================================
     * Methods of ES6 Map
     *======================================================*/

    /**
     * Creates an empty, or a pre-initialized map.
     * @param {*} [iterable] Another iterable object whose key-value pairs are added into the newly created map.
     * @example
     * // Create an empty map
     * let map1 = new TreeMultiMap();
     * // Create and initialize map
     * let map2 = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
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
                throw new Error('TreeMultiMap constructor accepts only iterable objects');
            }
        }
    }

    /**
     * String tag of this class
     * @returns {String}
     * @example
     * Object.prototype.toString.call(new TreeMultiMap()); // "[object TreeMultiMap]"
     */
    get [Symbol.toStringTag]() {
        return 'TreeMultiMap';
    }

    /**
     * Allows to create programmatically an instance of the same class
     * @returns constructor object for this class.
     * @example
     * let map = new TreeMultiMap();
     * let constrFunc = Object.getPrototypeOf(map).constructor[Symbol.species];
     * let map2 = new constrFunc();
     */
    static get [Symbol.species]() {
        return TreeMultiMap;
    }

    /**
     * Removes all key-value pairs.
     * @example
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * map.clear();
     * console.log(map.size); // 0
     */
    clear() {
        this.__t.clear();
    }

    /**
     * Removes key-value pair with the specified key if such entry exists. Does nothing otherwise.
     * @example
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * map.delete(2);
     * console.log(map.toString()); // {1:A,3:C}
     */
    delete(key) {
        let it = this.__t.find(key);
        if (!it.equals(this.__t.end())) {
            this.__t.erase(it.node);
        }
    }

    /**
     * Forward ES6 iterator for all key-value pairs in ascending order of the keys.
     * @returns {JsIterator}
     * @example
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * for (let [key,value] of map.entries()) {
     *   console.log(`key: ${key}, value: ${value}`);
     * }
     */
    entries() {
        return this.__t.entries();
    }

    /**
     * Iterates all key-value pairs using a callback in ascending order of the keys.
     * Note that ES6 specifies the order of key value parameters in the callback differently from for-of loop.
     * @example
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * map.forEach(function(value, key, container) {
     *   console.log(`key: ${key}, value: ${value}`);
     * });
     */
    forEach(callback) {
        for (let [k, v] of this.__t) {
            callback(v, k, this);
        }
    }

    /**
     * Finds value associated with the specified key. If specified key does not exist then undefined is returned.
     * @returns {*}
     * @param {*} key a value of any type that can be compared with a key
     * @example
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * let v = map.get(3); // 'C'
     * * let v = map.get(4); // returns undefined
     */
    get(key) {
        let it = this.__t.find(key);
        if (!it.equals(this.__t.end())) {
            return it.value;
        }
        else {
            return undefined;
        }
    }

    /**
     * A boolean indicator whether map contains a key-value pair with the specified key
     * @returns {Boolean}
     * @param {*} key a value of any type that can be compared with a key
     * @example
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * let b = map.get(3); // true
     */
    has(key) {
        let it = this.__t.find(key);
        if (!it.equals(this.__t.end())) {
            return true;
        }
        else {
            return false;
        }
    }

    /**
     * Forward ES6 iterator for all keys in ascending order of the keys.
     * @returns {JsIterator}
     * @example
     * // iterate all keys
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * for (let k of map.keys()) {
     *   console.log(k); // 1, 2, 3
     * }
     * // iterate all keys in reverse order
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * for (let k of map.keys().backward()) {
     *   console.log(k); // 3, 2, 1
     * }
     */
    keys() {
        return this.__t.keys();
    }

    /**
     * Adds a key-value pair to the map. Multiple key-value pairs with the same key are allowed in TreeMultiMap.
     * @param {*} key
     * @param {*} value
     * @example
     * let map = new TreeMultiMap();
     * map.set(1, 'A');
     * map.set(1, 'B');
     * map.set(2, 'C');
     * for (let k of map.values()) {
     *   console.log(k); // A, B, C
     * }
     */
    set(key, value) {
        let n = new TreeNode();
        n.key = key;
        n.value = value;
        this.__t.insertMulti(n);
    }

    /**
     * Number of key-value pairs in the map.
     * @returns {Number}
     */
    get size() {
        return this.__t.size();
    }

    /**
     * Forward ES6 iterator for all values in ascending order of the keys.
     * @returns {JsITerator}
     * @example
     * // iterate all values
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * for (let v of map.values()) {
     *   console.log(v); // 'A', 'B', 'C'
     * }
     * // iterate all values in reverse order
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * for (let v of map.values().backward()) {
     *   console.log(v); // 'C', 'B', 'A'
     * }
     */
    values() {
        return this.__t.values();
    }

    /**
     * Forward ES6 iterator for all key-value pairs in ascending order of the keys. The same as entries() method
     * @returns {JsIterator}
     * @example
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * for (let [key,value] of map) {
     *   console.log(`key: ${key}, value: ${value}`);
     * }
     */
    [Symbol.iterator]() {
        return this.__t[Symbol.iterator]();
    }

    /*======================================================
     * More methods
     *======================================================*/
    /**
     * ES6 reverse iterator for all key-value pairs in descending order of the keys.
     * @returns {JsReverseIterator}
     * @example
     * let map = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * for (let [key,value] of map.backwards()) {
     *   console.log(`key: ${key}, value: ${value}`);
     * }
     */
    backward() {
        return this.__t.backward();
    }

    /**
     * Sets custom comparison function if key values are not of primitive types.
     * Callback is a 3-way comparison function accepts two key values (lhs, rhs). It is expected to return
     *      +1 if the value of rhs is greater than lhs
     *      -1 if the value of rhs is less than lhs
     *       0 if values are the same
     */
    set compareFunc(func) {
        this.clear();
        this.__t.compare = func;
    }

    /*======================================================
     * STL-like methods
     *======================================================*/

    /**
     * Forward iterator to the first element
     * @returns {Iterator}
     * @example
     * let m = new TreeMultiMap();
     * ...
     * for (let it = m.begin(); !it.equals(m.end()); it.next()) {
     *   console.log(`key: ${it.key}, value: ${it.value}`);
     * }
     */
    begin() {
        return this.__t.begin();
    }

    /**
     * Forward iterator to the element following the last element
     * @returns {Iterator}
     * @example
     * let m = new TreeMultiMap();
     * ...
     * for (let it = m.begin(); !it.equals(m.end()); it.next()) {
     *   console.log(`key: ${it.key}, value: ${it.value}`);
     * }
     */
    end() {
        return this.__t.end();
    }

    /**
     * Finds an element with key equivalent to the specified one. If such key does not exist end() iterator is returned.
     * @param {*} key
     * @returns {Iterator}
     * @example
     * let m = new TreeMultiMap([[1, 'A'], [2, 'B'], [3, 'C']]);
     * ...
     * let it = m.find(1);
     * if (!it.equals(m.end())) {
     *   console.log(`key: ${it.key}, value: ${it.value}`); // 1, 'A'
     * }
     */
    find(key) {
        return this.__t.find(key);
    }

    /**
     * Adds key-value pair if such key does not exist in the map
     * @param {*} key
     * @param {*} value
     * @example
     * let m = new TreeMultiMap();
     * m.insertUnique(1, 'A');
     * m.insertUnique(1, 'B'); // this step has no effect on the map
     * let v = m.get(1); // 'A'
     */
    insertUnique(key, value) {
        let n = new TreeNode();
        n.key = key;
        n.value = value;
        return this.__t.insertUnique(n);
    }

    /**
     * Adds key-value pair if such key does not exist in the map. Replaces value if such key exists
     * @param {*} key
     * @param {*} value
     * @example
     * let m = new TreeMultiMap();
     * m.insertOrReplace(1, 'A');
     * m.insertOrReplace(1, 'B'); // replaces the value for key 1
     * let v = m.get(1); // 'B'
     */
    insertOrReplace(key, value) {
        let n = new TreeNode();
        n.key = key;
        n.value = value;
        return this.__t.insertOrReplace(n);
    }

    /**
     * Adds key-value pair. If such key already exists in the map then adds another node with the same key and a new value.
     * @param {*} key
     * @param {*} value
     * @example
     * let m = new TreeMultiMap();
     * m.insertMulti(1, 'A');
     * m.insertMulti(1, 'B'); // this step has no effect on the map
     * let v = m.get(1); // undefined
     */
    insertMulti(key, value) {
        let n = new TreeNode();
        n.key = key;
        n.value = value;
        return this.__t.insertMulti(n);
    }

    /**
     * Iterator pointing to the first element that is not less than specified key. If no such element is found, see end() iterator is returned.
     * @param {*} key
     * @returns {Iterator}
     * @example
     * let m = new TreeMultiMap();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive
     * let from = m.lowerBound(0);
     * let to = m.upperBound(50);
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     *
     * let m = new TreeMultiMap();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive in reverse order
     * let from = new ReverseIterator(m.upperBound(50));
     * let to = new ReverseIterator(m.lowerBound(0));
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     */
    lowerBound(key) {
        return this.__t.lowerBound(key);
    }

    /**
     * Reverse iterator to the last element.
     * @returns {ReverseIterator}
     * @example
     * let m = new TreeMultiMap();
     * ...
     * for (let it = m.rbegin(); !it.equals(m.rend()); it.next()) {
     *   console.log(`key: ${it.key}, value: ${it.value}`);
     * }
     */
    rbegin() {
        return this.__t.rbegin();
    }

    /**
     * Reverse iterator pointing to before the first element.
     * @returns {ReverseIterator}
     * @example
     * let m = new TreeMultiMap();
     * ...
     * for (let it = m.rbegin(); !it.equals(m.rend()); it.next()) {
     *   console.log(`key: ${it.key}, value: ${it.value}`);
     * }
     */
    rend() {
        return this.__t.rend();
    }

    /**
     * Iterator pointing to the first element that is greater than key. If no such element is found end() iterator is returned.
     * @param {*} key
     * @returns {Iterator}
     * @example
     * let m = new TreeMultiMap();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive
     * let from = m.lowerBound(0);
     * let to = m.upperBound(50);
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     *
     * let m = new TreeMultiMap();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive in reverse order
     * let from = new ReverseIterator(m.upperBound(50));
     * let to = new ReverseIterator(m.lowerBound(0));
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     */
    upperBound(key) {
        return this.__t.upperBound(key);
    }

    /**
     * Serializes contents of the map in the form {key1:value1,key2:value2,...}
     * @returns {String}
     */
    toString() {
        return this.__t.toString();
    }
}

module.exports = {
    TreeMultiMap: TreeMultiMap,
};