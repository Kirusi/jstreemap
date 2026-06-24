import { TreeNode } from './tree-node.js';

/* Containers are expected to support the following methods:
   jsBegin() - returns the very first node
   jsEnd() - returns the node beyond the last one
   next(node) - returns the next node
   prev(node) - returns the previous node
   valuePolicy - an instance of KeyOnlyPolicy, or KeyValuePolicy */
/**
 * ES6-style forward iterator.
 * @template T - iterator's value type
 * @example
 * let m = new TreeMap();
 * ...
 * for (let [key, value] of m) {
 *   console.log(`key: ${key}, value: ${value}`);
 * }
 * // iterate values
 * for (let value of m.values()) {
 *   console.log(`value: ${value}`);
 * }
 */
export class JsIterator<T> implements IterableIterator<T> {
  /**
   * Internal reference to a container
   * @private
   */
  public container: any;
  /**
   * valuePolicy implements what members of the node will be returned: key, value, or key and value
   * @private
   */
  public valuePolicy: any;
  /**
   * current node
   * @private
   */
  public node: TreeNode<any, any>;

  /**
   * Constructor for JSIterator
   * @param {*} container - Container to be traversed
   * @param {*} valuePolicy - policy object that specifies whether nodes have just keys or keys & values
   * @private
   */
  constructor(container: any, valuePolicy = container.valuePolicy) {
    this.container = container;
    this.valuePolicy = valuePolicy;
    this.node = container.jsBegin();
  }
  /**
   * As documented in ES6 iteration protocol. It can be used for manual iteration.
   * Iterators are documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
   * @returns {IteratorResult} returns object that specifies an indicator whether the node was fetched and node itself
   * @example
   * let m = new TreeMap();
   * ...
   * let jsIt = m.entries();
   * while (true) {
   *   let res = it.next();
   *   if (res.done) {
   *     break;
   *   }
   *   console.log(`key: ${res.value[0]}, value: ${res.value[1]`});
   * }
   */
  next(): IteratorResult<T> {
    const res = {
      done: true,
      value: undefined as T,
    };
    res.done = this.node === this.container.jsEnd();
    if (!res.done) {
      res.value = this.valuePolicy.fetch(this.node);
      this.node = this.container.next(this.node);
    }
    return res;
  }

  /**
   * Support for ES6 for-of loops.
   * @returns {IterableIterator} iterator to traverse all elements in forward order
   */
  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  /**
   * A reverse iterator for the same container.
   * @returns {JsReverseIterator} iterator to traverse all elements in reverse order
   * @example
   * let m = new TreeMap();
   * ...
   * // iterate all key-value pairs in reverse order
   * for (let [key, value] of m.backwards()) {
   *   console.log(`key: ${key}, value: ${value}`);
   * }
   */
  backwards(): JsReverseIterator<T> {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    return new JsReverseIterator(this.container, this.valuePolicy);
  }
}

/* Containers are expected to support the following methods:
   jsRbegin() - returns the very first node in reverse order (e.g. the very last node)
   jsrEnd() - returns the node beyond the last one in reverse order (e.g. the node before the first one)
   next(node) - returns the next node
   prev(node) - returns the previous node
   valuePolicy - an instance of KeyOnlyPolicy, or KeyValuePolicy */
/**
 * ES6-style backward iterator
 * @template T - iterator's value type
 * @example
 * let m = new TreeMap();
 * ...
 * // iterate all key-value pairs in reverse order
 * for (let [key, value] of m.backwards()) {
 *   console.log(`key: ${key}, value: ${value}`);
 * }
 * // iterate keys in reverse order
 * for (let key of m.keys().backwards()) {
 *   console.log(`key: ${key}`);
 * }
 */
export class JsReverseIterator<T> {
  /**
   * Internal reference to a container
   * @private
   */
  public container: any;
  /**
   * valuePolicy implements what members of the node will be returned: key, value, or key and value
   * @private
   */
  public valuePolicy: any;
  /**
   * current node
   * @private
   */
  public node: TreeNode<any, any>;
  /**
   * Constructor for reverse iterator
   * @param {*} container - Container reference
   * @param {*} valuePolicy - policy object that specifies whether nodes contain just keys or keys & values
   * @private
   */
  constructor(container: any, valuePolicy = container.valuePolicy) {
    this.container = container;
    this.valuePolicy = valuePolicy;
    this.node = container.jsRbegin();
  }

  /**
   * As documented in ES6 iteration protocol. It can be used for manual iteration.
   * Iterators are documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators
   * @returns {IteratorResult} returns object that specifies an indicator whether the node was fetched and node itself
   * @example
   * let m = new TreeMap();
   * ...
   * let jsIt = m.entries().backwards();
   * while (true) {
   *   let res = it.next();
   *   if (res.done) {
   *     break;
   *   }
   *   console.log(`key: ${res.value[0]}, value: ${res.value[1]`});
   * }
   */
  next(): IteratorResult<T> {
    const res = { done: false, value: undefined as T };
    res.done = this.node === this.container.jsRend();
    if (!res.done) {
      res.value = this.valuePolicy.fetch(this.node);
      this.node = this.container.prev(this.node);
    }
    return res;
  }

  /**
   * Support for ES6 for-of loops.
   * @returns {*} iterator to traverse all elements in reverse order
   */
  [Symbol.iterator](): any {
    return this;
  }

  /**
   * A forward iterator for the same container
   * @returns {JsIterator} iterator to traverse all elements in forward order
   * @example
   * let m = new TreeMap();
   * ...
   * // iterate all key-value pairs in direct order
   * for (let [key, value] of m.backwards().backwards()) {
   *   console.log(`key: ${key}, value: ${value}`);
   */
  backwards(): JsIterator<T> {
    return new JsIterator(this.container, this.valuePolicy);
  }
}
