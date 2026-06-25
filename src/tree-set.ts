import { InsertionResult } from './insertion-result.js';
import { SetIterator } from './iterators.js';
import { KeyOnlyPolicy } from './policies.js';
import { TreeNode } from './tree-node.js';
import { compareFunctionType, Tree } from './tree.js';

/**
 * TreeSet is a container that stores unique elements following a specific order.
 *
 * In a TreeSet, the value of an element also identifies it (the value is itself the key),
 * and each value must be unique. The value of the elements in a TreeSet cannot be modified
 * once in the container (the elements are immutable), but they can be inserted or removed
 * from the container.
 *
 * ## Container properties
 * **Associative** - Elements in associative containers are referenced by their key and
 * not by their absolute position in the container.</li>
 * **Ordered** - The elements in the container follow a strict order at all times.
 * All inserted elements are given a position in this order.</li>
 * **Set** - The value of an element is also the key used to identify it.</li>
 * **Unique keys** - No two elements in the container can have equivalent keys.</li>
 * @template K - key type
 * @example
 * let set = new TreeSet();
 * // add few values
 * set.add(1);
 * set.add(2);
 * // check whether key exists
 * let flag = set.has(1); // << true
 * // print all keys
 * for (let key of set) {
 *   console.log(`key: ${key}`);
 * }
 */
export class TreeSet<K> {
  private readonly __t: Tree<K, K>;
  /*======================================================
   * Methods of ES6 Set
   *======================================================*/

  /**
   * Creates an empty, or a pre-initialized set.
   * @param {*} [iterable] - Another iterable object whose values are added into the newly created set.
   * @example
   * // Create an empty set
   * let set = new TreeSet();
   * // Create and initialize set
   * let set2 = new TreeSet([1, 2, 3]);
   * @private
   */
  constructor(iterable?: Iterable<K>) {
    /** Internal tree */
    this.__t = new Tree<K, K>();
    this.__t.valuePolicy = new KeyOnlyPolicy();
    if (iterable !== undefined && iterable !== null) {
      if (iterable[Symbol.iterator] === undefined) {
        throw new Error('TreeSet constructor accepts only iterable objects');
      }
      // copy contents
      for (const k of iterable) {
        this.add(k);
      }
    }
  }

  /**
   * String tag of this class
   * @returns {string} class name
   * @example
   * Object.prototype.toString.call(new TreeSet()); // "[object TreeSet]"
   */
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get [Symbol.toStringTag](): string {
    return 'TreeSet';
  }

  /**
   * Allows to create programmatically an instance of the same class
   * @returns {*} constructor object for this class.
   * @example
   * let set = new TreeSet();
   * let constrFunc = Object.getPrototypeOf(set).constructor[Symbol.species];
   * let set2 = new constrFunc();
   */
  static get [Symbol.species](): any {
    return TreeSet;
  }

  /**
   * Removes all key-value pairs.
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * set.clear();
   * console.log(set.size); // 0
   */
  clear(): void {
    this.__t.clear();
  }

  /**
   * Removes key-value pair with the specified key if such entry exists. Does nothing otherwise.
   * @param {K} key - Key to be deleted
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * set.delete(2);
   * console.log(set.toString()); // {1,3}
   */
  delete(key: K): void {
    const it = this.__t.find(key);
    if (!it.equals(this.__t.end())) {
      this.__t.erase(it.node);
    }
  }

  /**
   * Forward ES6 iterator for all values in ascending order.
   * @returns {IterableIterator} forward iterator for all elements
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * for (let key of set.entries()) {
   *   console.log(`key: ${key}`);
   * }
   */
  entries(): IterableIterator<K> {
    return this.__t.entries() as IterableIterator<K>;
  }

  /**
   * Iterates all values using a callback in ascending order.
   * Note that ES6 specifies the order of key parameters in the callback differently from for-of loop.
   * @param {*} callback - The same type of callback as used in `forEach` for regular JS maps
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * set.forEach(function(value, key, container) {
   *   // value is the same as key
   *   console.log(`key: ${key}, value: ${value}`);
   * });
   */
  forEach(callback: any): void {
    for (const k of this.__t) {
      callback(k, k, this);
    }
  }

  /**
   * A boolean indicator whether set contains the specified key.
   * @param {K} key - a value of any type that can be compared with a key
   * @returns {boolean} `true` if key exists in the container
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * let b = set.get(3); // true
   * b = set.get(4); // false
   */
  has(key: K): boolean {
    const it = this.__t.find(key);
    if (!it.equals(this.__t.end())) {
      return true;
    }
    return false;
  }

  /**
   * Forward ES6 iterator for all keys in ascending order.
   * @returns {IterableIterator} forward iterator for all keys
   * @example
   * // iterate all keys
   * let set = new TreeSet([1, 2, 3]);
   * for (let k of set.keys()) {
   *   console.log(k); // 1, 2, 3
   * }
   * // iterate all keys in reverse order
   * let set = new TreeSet([1, 2, 3]);
   * for (let k of set.keys().backwards()) {
   *   console.log(k); // 3, 2, 1
   * }
   */
  keys(): IterableIterator<K> {
    return this.__t.keys();
  }

  /**
   * Adds a key to the set, unless the key already exists.
   * @param {K} key - Key to be added
   * @example
   * let set = new TreeSet();
   * set.add(1);
   */
  add(key: K): void {
    const n: TreeNode<K, K> = new TreeNode();
    n.key = key;
    this.__t.insertUnique(n);
  }

  /**
   * Number of keys in the set.
   * @returns {number} count of elements in the container
   */
  get size(): number {
    return this.__t.size();
  }

  /**
   * Forward ES6 iterator for all keys in ascending order. It is the same as keys() method
   * @returns {IterableIterator} forward iterator for all values
   * @example
   * // iterate all values
   * let set = new TreeSet([1, 2, 3]);
   * for (let v of set.values()) {
   *   console.log(v); // '1', '2', '3'
   * }
   * // iterate all values in reverse order
   * let set = new TreeSet([1, 2, 3]);
   * for (let v of set.values().backwards()) {
   *   console.log(v); // '3', '2', '1'
   * }
   */
  values(): IterableIterator<K> {
    return this.__t.keys();
  }

  /**
   * Forward ES6 iterator for all keys in ascending order. The same as entries() method
   * @returns {IterableIterator} forward iterator for all elements
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * for (let key of set) {
   *   console.log(`key: ${key}`);
   * }
   */
  [Symbol.iterator](): IterableIterator<K> {
    return this.__t[Symbol.iterator]() as IterableIterator<K>;
  }

  /*======================================================
   * More methods
   *======================================================*/
  /**
   * ES6 reverse iterator for all keys in descending order.
   * @returns {IterableIterator} reverse iterator for all elements
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * for (let key of set.backwards()) {
   *   console.log(`key: ${key}`);
   * }
   */
  backwards(): IterableIterator<K> {
    return this.__t.backwards() as IterableIterator<K>;
  }

  /**
   * Sets custom comparison function if key values are not of primitive types.
   * Callback is a 3-way comparison function accepts two key values (lhs, rhs). It is expected to return
   *      +1 if the value of rhs is greater than lhs
   *      -1 if the value of rhs is less than lhs
   *       0 if values are the same
   */
  set compareFunc(func: compareFunctionType) {
    this.clear();
    this.__t.compare = func;
  }

  /*======================================================
   * STL-like methods
   *======================================================*/

  /**
   * Forward iterator to the first element
   * @returns {SetIterator} iterator pointing at element with the smallest key
   * @example
   * let set = new TreeSet();
   * ...
   * for (let it = set.begin(); !it.equals(set.end()); it.next()) {
   *   console.log(`key: ${it.key}`);
   * }
   */
  begin(): SetIterator<K> {
    return this.__t.begin();
  }

  /**
   * Forward iterator to the element following the last element
   * @returns {SetIterator} iterator pointing at the node after the element with the largest key
   * @example
   * let set = new TreeSet();
   * ...
   * for (let it = set.begin(); !it.equals(set.end()); it.next()) {
   *   console.log(`key: ${it.key}`);
   * }
   */
  end(): SetIterator<K> {
    return this.__t.end();
  }

  /**
   * Finds an element with key equivalent to the specified one. If such key does not exist end() iterator is returned.
   * @param {K} key - Key to search for
   * @returns {SetIterator} iterator pointing at the found node
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * ...
   * let it = set.find(1);
   * if (!it.equals(set.end())) {
   *   console.log(`Found key: ${it.key}`); // 1
   * }
   */
  find(key: K): SetIterator<K> {
    return this.__t.find(key);
  }

  /**
   * Adds a key if it doesn't exist
   * @param {K} key - Key to add
   * @returns {InsertionResult} indicates whether a node was added and provides iterator to it.
   * @example
   * let set = new TreeSet();
   * let res = set.insertUnique(1);
   * if (res.wasAdded) {
   *   console.log(`Inserted ${res.iterator.key}`); // prints 1
   * }
   * res = set.insertUnique(1); // this step has no effect on the set
   * if (res.wasAdded) {
   *   console.log(`Inserted ${res.iterator.key}`); // not executed
   * }
   */
  insertUnique(key: K): InsertionResult<SetIterator<K>> {
    const n: TreeNode<K, K> = new TreeNode();
    n.key = key;
    return this.__t.insertUnique(n);
  }

  /**
   * Adds key-value pair if such key does not exist in the map. Replaces value if such key exists
   * @param {K} key - key value
   * @returns {InsertionResult} indicates whether a node was added and provides iterator to it.
   * @example
   * let set = new TreeSet();
   * let res = set.insertOrReplace(1);
   * if (res.wasAdded) {
   *   console.log(`Inserted ${res.iterator.key}`); // prints 1
   * }
   * res = set.insertOrReplace(1) // returns iterator to the previously added node
   * if (res.wasReplaced) {
   *   console.log(`Replaced ${res.iterator.key}`); // prints 1
   * }
   */
  insertOrReplace(key: K): InsertionResult<SetIterator<K>> {
    const n: TreeNode<K, K> = new TreeNode();
    n.key = key;
    return this.__t.insertOrReplace(n);
  }

  /**
   * Removes value for the specified iterator.
   * @param {SetIterator} iterator - pointing to the node to be removed
   * @example
   * let set = new TreeSet([1,2,3]);
   * let it = set.find(2);
   * it.prev();
   * set.erase(it); // removes a node with key 1
   * console.log(set.toString()); // {2,3}
   */
  erase(iterator: SetIterator<K>): void {
    this.__t.erase(iterator.node);
  }

  /**
   * Iterator pointing to the first element that is not less than specified key. If no such element is found, see end() iterator is returned.
   * @param {K} key - Key to search for
   * @returns {SetIterator} iterator pointing at found node
   * @example
   * let set = new TreeSet();
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
   * let set = new TreeSet();
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
  lowerBound(key: K): SetIterator<K> {
    return this.__t.lowerBound(key);
  }

  /**
   * Returns iterator to the first element for reverse iterator
   * @returns {SetIterator} iterator pointing to the node with the highest key
   * @example
   * let set = new TreeSet();
   * ...
   * for (let it = set.rbegin(); !it.equals(set.rend()); it.next()) {
   *   console.log(`key: ${it.key}`);
   * }
   */
  rbegin(): SetIterator<K> {
    return this.__t.rbegin();
  }

  /**
   * Returns `end` iterator for reverse iteration, e.g. pointing to a position after the last element
   * @returns {SetIterator} iterator pointing to the node preceding the node with the lowest key
   * @example
   * let set = new TreeSet();
   * ...
   * for (let it = set.rbegin(); !it.equals(set.rend()); it.next()) {
   *   console.log(`key: ${it.key}`);
   * }
   */
  rend(): SetIterator<K> {
    return this.__t.rend();
  }

  /**
   * Iterator pointing to the first element that is greater than key. If no such element is found end() iterator is returned.
   * @param {k} key - Key to search for
   * @returns {SetIterator} iterator pointing at found node
   * @example
   * let set = new TreeSet();
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
   * let set = new TreeSet();
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
  upperBound(key: K): SetIterator<K> {
    return this.__t.upperBound(key);
  }

  /**
   * Returns first element of the container, or undefined if container is empty
   * @returns {K} first element of the container, or undefined if container is empty
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * let first = set.first(); // 1
   */
  first(): K | undefined {
    return this.__t.first() as K;
  }

  /**
   * Returns last element of the container, or undefined if container is empty
   * @returns {K} last element of the container, or undefined if container is empty
   * @example
   * let set = new TreeSet([1, 2, 3]);
   * let last = set.last(); // 3
   */
  last(): K | undefined {
    return this.__t.last() as K;
  }

  /**
   * Serializes contents of the set in the form {key1,key2,...}
   * @returns {string} string representation of the set
   */
  toString(): string {
    return this.__t.toString();
  }
}
