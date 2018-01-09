'use strict';

/* Containers are expected to support the following methods:
   jsBegin() - returns the very first node
   jsEnd() - returns the node beyond the last one
   next(node) - returns the next node
   prev(node) - returns the previous node
   valuePolicy - an instance of KeyOnlyPolicy, or KeyValuePolicy */
/**
  * ES6-style forward iterator.
  *
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
class JsIterator {
    /**
     * @param {*} container
     */
    constructor(container, valuePolicy = container.valuePolicy) {
        /**
         * @private
         * Internal reference to a container
         */
        this.container = container;
        /**
         * @private
         * valuePolicy implements what members of the node will be returned: key, value, or key and value
         */
        this.valuePolicy = valuePolicy;
        /**
         * @private
         * current node
         */
        this.node = container.jsBegin();
    }

    /**
     * As documented in ES6 iteration protocol. It can be used for manual iteration
     * @returns {{done: boolean, value: [key, [value]]}}
     *
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
    next() {
        let res = {};
        res.done = (this.node === this.container.jsEnd());
        if (!res.done) {
            res.value = this.valuePolicy.fetch(this.node);
            this.node = this.container.next(this.node);
        }
        return res;
    }

    /** Support for ES6 for-of loops */
    [Symbol.iterator]() {
        return this;
    }

    /**
     * @returns {JsReverseIterator} a reverse iterator for the same container
     * @example
     * let m = new TreeMap();
     * ...
     * // iterate all key-value pairs in reverse order
     * for (let [key, value] of m.backwards()) {
     *   console.log(`key: ${key}, value: ${value}`);
     * }
    */
    backwards() {
        // eslint-disable-next-line no-use-before-define
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
class JsReverseIterator {
    /**
     * @param {*} container
     */
    constructor(container, valuePolicy = container.valuePolicy) {
        /**
         * @private
         * Internal reference to a container
         */
        this.container = container;
        /**
         * @private
         * valuePolicy implements what members of the node will be returned: key, value, or key and value
         */
        this.valuePolicy = valuePolicy;
        /**
         * @private
         * current node
         */
        this.node = container.jsRbegin();
    }

    /**
     * As documented in ES6 iteration protocol. It can be used for manual iteration
     * @returns {{done: boolean, value: [key, [value]]}}
     *
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
    next() {
        let res = {};
        res.done = (this.node === this.container.jsRend());
        if (!res.done) {
            res.value = this.valuePolicy.fetch(this.node);
            this.node = this.container.prev(this.node);
        }
        return res;
    }

    /** Support for ES6 for-of loops */
    [Symbol.iterator]() {
        return this;
    }

    /**
     * @returns {JsIterator} a forward iterator for the same container
     * @example
     * let m = new TreeMap();
     * ...
     * // iterate all key-value pairs in direct order
     * for (let [key, value] of m.backwards().backwards()) {
     *   console.log(`key: ${key}, value: ${value}`);
     */
    backwards() {
        return new JsIterator(this.container, this.valuePolicy);
    }
}

module.exports = {
    JsIterator: JsIterator,
    JsReverseIterator: JsReverseIterator
};