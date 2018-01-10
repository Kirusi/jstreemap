/** An implementation of red-black tree */
const {Tree} = require('../internal/tree');
/** Classes that regulate whether tree nodes hold keys only, or key-value pairs */
const {KeyOnlyPolicy} = require('../internal/policies');
/** Node for a red-black tree */
const {TreeNode} = require('../internal/tree-node');

/**
 * This is an associative container class storing keys in ascending order, allowing duplicate key values.
 * @example
 * let set = new TreeMultiSet();
 * // add few values
 * set.add(1);
 * set.add(2);
 * set.add(2);
 * // check whether key exists
 * let flag = set.has(1); // << true
 * // print all keys
 * for (let key of set) {
 *   console.log(`key: ${key}`); // 1, 2, 2
 * }
 */
class TreeMultiSet {
    /*======================================================
     * Methods of ES6 Set
     *======================================================*/

    /**
     * Creates an empty, or a pre-initialized set.
     * @param {*} [iterable] Another iterable object whose values are added into the newly created set.
     * @example
     * // Create an empty set
     * let set = new TreeMultiSet();
     * // Create and initialize set
     * let set2 = new TreeMultiSet([1, 2, 3]);
     */
    constructor(iterable) {
        /** Internal tree */
        this.__t = new Tree();
        this.__t.valuePolicy = new KeyOnlyPolicy();
        if ((iterable !== undefined)
            && (iterable !== null)) {
            if (iterable[Symbol.iterator] !== undefined) {
                // copy contents
                for (let k of iterable) {
                    this.add(k);
                }
            }
            else {
                throw new Error('TreeMultiSet constructor accepts only iterable objects');
            }
        }
    }

    /**
     * String tag of this class
     * @returns {String}
     * @example
     * Object.prototype.toString.call(new TreeMultiSet()); // "[object TreeMultiSet]"
     */
    get [Symbol.toStringTag]() {
        return 'TreeMultiSet';
    }

    /**
     * Allows to create programmatically an instance of the same class
     * @returns constructor object for this class.
     * @example
     * let set = new TreeMultiSet();
     * let constrFunc = Object.getPrototypeOf(set).constructor[Symbol.species];
     * let set2 = new constrFunc();
     */
    static get [Symbol.species]() {
        return TreeMultiSet;
    }

    /**
     * Removes all key-value pairs.
     * @example
     * let set = new TreeMultiSet([1, 2, 3]);
     * set.clear();
     * console.log(set.size); // 0
     */
    clear() {
        this.__t.clear();
    }

    /**
     * Removes key-value pair with the specified key if such entry exists. Does nothing otherwise.
     * @example
     * let set = new TreeMultiSet([1, 2, 2, 3]);
     * set.delete(2);
     * console.log(set.toString()); // {1,2,3}
     * set.delete(2); / remove the second copy of the key
     * console.log(set.toString()); // {1,3}
     */
    delete(key) {
        let it = this.__t.find(key);
        if (!it.equals(this.__t.end())) {
            this.__t.erase(it.node);
        }
    }

    /**
     * Forward ES6 iterator for all values in ascending order.
     * @returns {JsIterator}
     * @example
     * let set = new TreeMultiSet([1, 2, 3]);
     * for (let key of set.entries()) {
     *   console.log(`key: ${key}`);
     * }
     */
    entries() {
        return this.__t.entries();
    }

    /**
     * Iterates all values using a callback in ascending order.
     * Note that ES6 specifies the order of key parameters in the callback differently from for-of loop.
     * @example
     * let set = new TreeMultiSet([1, 2, 3]);
     * set.forEach(function(value, key, container) {
     *   // value is the same as key
     *   console.log(`key: ${key}, value: ${value}`);
     * });
     */
    forEach(callback) {
        for (let k of this.__t) {
            callback(k, k, this);
        }
    }

    /**
     * A boolean indicator whether set contains the specified key.
     * @returns {Boolean}
     * @param {*} key a value of any type that can be compared with a key
     * @example
     * let set = new TreeMultiSet([1, 2, 3]);
     * let b = set.get(3); // true
     * b = set.get(4); // false
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
     * Forward ES6 iterator for all keys in ascending order.
     * @returns {JsIterator}
     * @example
     * // iterate all keys
     * let set = new TreeMultiSet([1, 2, 3]);
     * for (let k of set.keys()) {
     *   console.log(k); // 1, 2, 3
     * }
     * // iterate all keys in reverse order
     * let set = new TreeMultiSet([1, 2, 3]);
     * for (let k of set.keys().backward()) {
     *   console.log(k); // 3, 2, 1
     * }
     */
    keys() {
        return this.__t.keys();
    }

    /**
     * Adds a key to the set. If the key already exists then another entry with the same value is added.
     * @param {*} key
     * @example
     * let set = new TreeMultiSet();
     * set.add(1);
     * set.add(1);
     * set.add(2);
     * // print all keys
     * for (let key of set) {
     *   console.log(`key: ${key}`); // 1, 1, 2
     * }
     */
    add(key) {
        let n = new TreeNode();
        n.key = key;
        this.__t.insertMulti(n);
    }

    /**
     * Number of keys in the set.
     * @returns {Number}
     */
    get size() {
        return this.__t.size();
    }

    /**
     * Forward ES6 iterator for all keys in ascending order. It is the same as keys() method
     * @returns {JsITerator}
     * @example
     * // iterate all values
     * let set = new TreeMultiSet([1, 2, 3]);
     * for (let v of set.values()) {
     *   console.log(v); // '1', '2', '3'
     * }
     * // iterate all values in reverse order
     * let set = new TreeMultiSet([1, 2, 3]);
     * for (let v of set.values().backward()) {
     *   console.log(v); // '3', '2', '1'
     * }
     */
    values() {
        return this.__t.keys();
    }

    /**
     * Forward ES6 iterator for all keys in ascending order. The same as entries() method
     * @returns {JsIterator}
     * @example
     * let set = new TreeMultiSet([1, 2, 3]);
     * for (let key of set) {
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
     * ES6 reverse iterator for all keys in descending order.
     * @returns {JsReverseIterator}
     * @example
     * let set = new TreeMultiSet([1, 2, 3]);
     * for (let key of set.backwards()) {
     *   console.log(`key: ${key}`);
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
     * let set = new TreeMultiSet();
     * ...
     * for (let it = set.begin(); !it.equals(set.end()); it.next()) {
     *   console.log(`key: ${it.key}`);
     * }
     */
    begin() {
        return this.__t.begin();
    }

    /**
     * Forward iterator to the element following the last element
     * @returns {Iterator}
     * @example
     * let set = new TreeMultiSet();
     * ...
     * for (let it = set.begin(); !it.equals(set.end()); it.next()) {
     *   console.log(`key: ${it.key}`);
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
     * let set = new TreeMultiSet([1, 2, 3]);
     * ...
     * let it = set.find(1);
     * if (!it.equals(set.end())) {
     *   console.log(`Found key: ${it.key}`); // 1
     * }
     */
    find(key) {
        return this.__t.find(key);
    }

    /**
     * Adds key if such key does not exist in the set.
     * @param {*} key
     * @example
     * let set = new TreeMultiSet();
     * set.insertUnique(1);
     * set.insertUnique(1); // this step has no effect on the set
     * let flag = set.has(1); // true
     * let size = set.size; // 1
     */
    insertUnique(key) {
        let n = new TreeNode();
        n.key = key;
        return this.__t.insertUnique(n);
    }

    /**
     * Adds key if such key does not exist in the set. Same as insertUnique()
     * @param {*} key
     * @example
     * let set = new TreeMultiSet();
     * set.insertOrReplace(1);
     * set.insertOrReplace(1); // this step has no effect on the set
     * let flag = set.has(1); // true
     * let size = set.size; // 1
     */
    insertOrReplace(key) {
        let n = new TreeNode();
        n.key = key;
        return this.__t.insertOrReplace(n);
    }

    /**
     * Adds key whether it exists or not in the set.
     * @param {*} key
     * @example
     * let set = new TreeMultiSet();
     * set.insertMulti(1);
     * set.insertMulti(1); // this step has no effect on the map
     * let flag = set.has(1); // true
     * let size = set.size; // 2
     */
    insertMulti(key) {
        let n = new TreeNode();
        n.key = key;
        return this.__t.insertMulti(n);
    }

    /**
     * Iterator pointing to the first element that is not less than specified key. If no such element is found, see end() iterator is returned.
     * @param {*} key
     * @returns {Iterator}
     * @example
     * let set = new TreeMultiSet();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive
     * let from = set.lowerBound(0);
     * let to = set.upperBound(50);
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     *
     * let set = new TreeMultiSet();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive in reverse order
     * let from = new ReverseIterator(set.upperBound(50));
     * let to = new ReverseIterator(set.lowerBound(0));
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
     * let set = new TreeMultiSet();
     * ...
     * for (let it = set.rbegin(); !it.equals(set.rend()); it.next()) {
     *   console.log(`key: ${it.key}`);
     * }
     */
    rbegin() {
        return this.__t.rbegin();
    }

    /**
     * Reverse iterator pointing to before the first element.
     * @returns {ReverseIterator}
     * @example
     * let set = new TreeMultiSet();
     * ...
     * for (let it = set.rbegin(); !it.equals(set.rend()); it.next()) {
     *   console.log(`key: ${it.key}`);
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
     * let set = new TreeMultiSet();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive
     * let from = set.lowerBound(0);
     * let to = set.upperBound(50);
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     *
     * let set = new TreeMultiSet();
     * ... // add key-value pairs., using numbers as keys
     * // iterate through all key-value pairs with keys between 0 and 50 inclusive in reverse order
     * let from = new ReverseIterator(set.upperBound(50));
     * let to = new ReverseIterator(set.lowerBound(0));
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
     * Serializes contents of the set in the form {key1,key2,...}
     * @returns {String}
     */
    toString() {
        return this.__t.toString();
    }
}

module.exports = {
    TreeMultiSet: TreeMultiSet,
};