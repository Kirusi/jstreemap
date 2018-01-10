'use strict';
/**
 * Base class for STL-like iterators. It references a node (or index) and a container.
 * Navigation is achieved by calling container's prev() and next() methods.
 */
class BaseIterator {
    /**
     * @param {*} node - current node
     * @param {*} container - container
     */
    constructor(node, container) {
        /**
         * @private
         * __n - internal node reference
         */
        this.__n = node;
        /**
         * @private
         * __c - internal container reference
         */
        this.__c = container;
    }

    /**
     * Two iterators are considered to be equal if they point to the same node of the same container
     * @param {BaseIterator} rhs - object on the 'right-hand side' of .eq. operator
     * @returns {boolean}
     */
    equals(rhs) {
        let lhsClass = this.constructor.name;
        let rhsClass = rhs.constructor.name;
        if (lhsClass !== rhsClass) {
            throw new Error(`Can't compare an instance of ${lhsClass} with an instance of ${rhsClass}`);
        }
        if (this.__c !== rhs.__c) {
            throw new Error('Iterators belong to different containers');
        }
        return this.__n === rhs.__n;
    }

    /**
     * @private
     * @returns current node
     */
    get node() {
        return this.__n;
    }

    /**
     * @private
     * @returns key of the current node
     */
    get key() {
        return this.__n.key;
    }

    /**
     * @private
     * @returns value of the current node
     */
    get value() {
        return this.__n.value;
    }

    /**
     * @private
     * @returns container that holds current node
     */
    get container() {
        return this.__c;
    }
}

/**
 * STL-like forward iterator. It's more verbose than ES6 iterators, but allows iteration over any part of the container
 *
 * @example
 * let m = new TreeMap();
 * ...
 * for (let it = m.begin(); !it.equals(m.end()); it.next()) {
 *   console.log(`key: ${it.key}, value: ${it.value}`);
 * }
 */
class Iterator extends BaseIterator {
    /**
     * There are 3 ways to construct an iterator:
     *
     * 1. Using a node and a container
     * 2. Copy constructor / clone
     * 3. Copy constructor / clone from ReverseIterator instance
     * @param {*} args
     *
     * @example
     * // Using a node and a container
     * let it = new Iterator(node, container);
     *
     * // Copy constructor / clone
     * let it1 = new Iterator(node, container);
     * let it2 = new Iterator(it1);
     *
     * // Copy constructor / clone from ReverseIterator instance
     * let it1 = new ReverseIterator(node, container);
     * let it2 = new Iterator(it1);
     */
    constructor(...args) {
        if (args.length === 2) {
            let [node, container] = args;
            super(node, container);
        }
        else if (args.length === 1) {
            let [obj] = args;
            let className = obj.constructor.name;
            if (className === Iterator.name) {
                super(obj.__n, obj.__c);
            }
            // eslint-disable-next-line no-use-before-define
            else if (className === ReverseIterator.name) {
                let c = obj.__c;
                super(c.next(obj.__n), c);
            }
            else {
                throw new Error(`Can't create an Iterator from ${className}`);
            }
        }
        else {
            throw new Error('Can\'t create an Iterator with provided parameters');
        }
    }

    /**
     * Replaces node reference with the reference of the next node in the container.
     * Can be used for manual iteration over a range of key-value pairs.
     * @example
     * let m = new TreeMap();
     * ... // add key-value pairs., using numbers as keys
     * let from = t.lowerBound(0);
     * let to = t.upperBound(50);
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     */
    next() {
        /**
         * __n and __c are defined in the base class
         */
        this.__n = this.__c.next(this.__n);
    }

    /**
     * Replaces node reference with the reference of the previous node in the container
     * Can be used for manual reverse iteration over a range of key-value pairs.
     * @example
     * let m = new TreeMap();
     * ... // add key-value pairs., using numbers as keys
     * let from = t.lowerBound(0);
     * let to = t.upperBound(50);
     * let it = to;
     * while (!it.equals(from)) {
     *   it.prev();
     *   console.log(it.key);
     * }
     */
    prev() {
        this.__n = this.__c.prev(this.__n);
    }
}

/**
 * STL-like backward iterator. Can be used to traverse container or a range in the reverse order.
 * It's more verbose than ES6 iterators, but allows iteration over any part of the container
 *
 * @example
 * let m = new TreeMap();
 * ...
 * for (let it = m.rbegin(); !it.equals(m.rend()); it.next()) {
 *   console.log(`key: ${it.key}, value: ${it.value}`);
 * }
 */
class ReverseIterator extends BaseIterator {
    /**
     * There are 3 ways to construct a reverse iterator:
     *
     * 1. Using a node and a container
     * 2. Copy constructor / clone
     * 3. Copy constructor / clone from forward Iterator instance
     * @param {*} args
     *
     * @example
     * // Using a node and a container
     * let it = new ReverseIterator(node, container);
     *
     * // Copy constructor / clone
     * let it1 = new ReverseIterator(node, container);
     * let it2 = new ReverseIterator(it1);
     *
     * // Copy constructor / clone from forward Iterator instance
     * let it1 = new Iterator(node, container);
     * let it2 = new ReverseIterator(it1);
     */
    constructor(...args) {
        if (args.length === 2) {
            let [node, container] = args;
            super(node, container);
        }
        else if (args.length === 1) {
            let [obj] = args;
            let className = obj.constructor.name;
            if (className === ReverseIterator.name) {
                super(obj.__n, obj.__c);
            }
            else if (className === Iterator.name) {
                let c = obj.__c;
                super(c.prev(obj.__n), c);
            }
            else {
                throw new Error(`Can't create an ReverseIterator from ${className}`);
            }
        }
        else {
            throw new Error('Can\'t create a Reverse Iterator with provided parameters');
        }
    }

    /**
     *  Replaces node reference with the reference of the previous node in the container, because it works in reverse order
     * Can be used for manual reverse iteration over a range of key-value pairs.
     * @example
     * let m = new TreeMap();
     * ... // add key-value pairs., using numbers as keys
     * let from = new ReverseIterator(t.upperBound(50));
     * let to = new ReverseIterator(t.lowerBound(0));
     * let it = from;
     * while (!it.equals(to)) {
     *   console.log(it.key);
     *   it.next();
     * }
     */
    next() {
        /**
         * __n and __c are defined in the base class
         */
        this.__n = this.__c.prev(this.__n);
    }

    /**
     *  Replaces node reference with the reference of the next node in the container, because it works in reverse order
     * Can be used for manual forward iteration over a range of key-value pairs.
     * @example
     * let m = new TreeMap();
     * ... // add key-value pairs., using numbers as keys
     * let from = new ReverseIterator(t.upperBound(50));
     * let to = new ReverseIterator(t.lowerBound(0));
     * let it = to;
     * while (!it.equals(from)) {
     *   it.prev();
     *   console.log(it.key);
     * }
     */
    prev() {
        this.__n = this.__c.next(this.__n);
    }
}

module.exports = {
    Iterator: Iterator,
    ReverseIterator: ReverseIterator
};