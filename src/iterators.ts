import { TreeNode } from './tree-node.js';

export interface IterableContainer {
  next(node: any): TreeNode<unknown, unknown>;
  prev(node: any): TreeNode<unknown, unknown>;
}

/**
 * Interface to traverse element's of set containers.
 * It is implemented by forward iterator - TreeIterator
 * and backward Iterator - ReverseIterator
 * @template K - Key type
 * @template C - Container
 */
export interface SetIterator<
  K,
  C extends IterableContainer = IterableContainer,
> {
  /**
   * Two iterators are considered to be equal if they point to the same node of the same container
   * @param rhs - object on the 'right-hand side' of .eq. operator
   * @returns `true` when both iterators point to the same node of the same container
   */
  equals(rhs: any): boolean;
  /**
   * Current node
   * @private
   */
  get node(): TreeNode<K, any>;
  /**
   * Key of current node
   */
  get key(): K;
  /**
   * Container
   * @private
   */
  get container(): C;
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
  next(): void;
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
  prev(): void;
}

/**
 * Interface to traverse element's of map containers.
 * It is implemented by forward iterator - TreeIterator
 * and backward Iterator - ReverseIterator
 * @template K - Key type
 * @template V - Value type
 * @template C - Container
 */
export interface MapIterator<
  K,
  V,
  C extends IterableContainer = IterableContainer,
> {
  equals(rhs: any): boolean;
  /**
   * @private
   */
  get node(): TreeNode<K, V>;
  /**
   * Current node's key
   * @type {K}
   */
  get key(): K;
  /**
   * Current node's value
   * @type {V}
   */
  get value(): V;
  /**
   * @private
   */
  get container(): C;
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
  next(): void;
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
  prev(): void;
}

/**
 * Base class for STL-like iterators. It references a node (or index) and a container.
 * Navigation is achieved by calling container's prev() and next() methods.
 * @template K - key type
 * @template V - value type
 * @template C - container type
 */
abstract class BaseIterator<K, V, C extends IterableContainer>
  implements SetIterator<K, C>, MapIterator<K, V, C>
{
  /** @private */
  public __n: TreeNode<K, V>;
  /** @private */
  public __c: C;
  /**
   * Constructor to create iterator
   * @param {TreeNode} node - start node
   * @param {*} container - container to traverse
   * @private
   */
  constructor(node: TreeNode<K, V>, container: C) {
    this.__n = node;
    this.__c = container;
  }
  abstract next(): void;
  abstract prev(): void;

  /**
   * Two iterators are considered to be equal if they point to the same node of the same container
   * @param {MapIterator} rhs - object on the 'right-hand side' of .eq. operator
   * @returns {boolean} `true` when both iterators point to the same node of the same container
   */
  equals(rhs: MapIterator<K, V, C> | SetIterator<K, C>): boolean {
    const lhsClass = this.constructor.name;
    const rhsClass = rhs.constructor.name;
    if (!(rhs instanceof this.constructor)) {
      throw new Error(
        `Can't compare an instance of ${lhsClass} with an instance of ${rhsClass}`
      );
    }
    if (this.__c !== rhs.container) {
      throw new Error('Iterators belong to different containers');
    }
    return this.__n === rhs.node;
  }

  /**
   * Current node
   * @private
   */
  get node(): TreeNode<K, V> {
    return this.__n;
  }

  /**
   * Key of the current node
   * @type {K}
   */
  get key(): K {
    return this.__n.key as K;
  }

  /**
   * Value of the current node
   * @type {V}
   */
  get value(): V {
    return this.__n.value as V;
  }

  /**
   * Container that holds current node
   * @private
   */
  get container(): C {
    return this.__c;
  }
}

/**
 * STL-like forward iterator. It's more verbose than ES6 iterators, but allows iteration over any part of the container
 * @template K - key type
 * @template V - value type
 * @template C - container type
 * @example
 * let m = new TreeMap();
 * ...
 * for (let it = m.begin(); !it.equals(m.end()); it.next()) {
 *   console.log(`key: ${it.key}, value: ${it.value}`);
 * }
 */
export class TreeIterator<
  K,
  V,
  C extends IterableContainer = IterableContainer,
> extends BaseIterator<K, V, C> {
  /**
   * There are 3 ways to construct an iterator:
   *
   * 1. Using a node and a container
   * 2. Copy constructor / clone
   * 3. Copy constructor / clone from ReverseIterator instance
   * @param {*} args - One of possible parameter sets
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
   * @private
   */
  constructor(...args: any[]) {
    if (args.length === 2) {
      const [node, container] = args;
      super(node, container);
    } else if (args.length === 1) {
      const [obj] = args;
      const className = obj.constructor.name;
      if (obj instanceof TreeIterator) {
        super(obj.__n, obj.__c);
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
      } else if (obj instanceof ReverseIterator) {
        const c = obj.__c;
        super(c.next(obj.__n), c);
      } else {
        throw new Error(`Can't create an Iterator from ${className}`);
      }
    } else {
      throw new Error("Can't create an Iterator with provided parameters");
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
  next(): void {
    /**
     * __n and __c are defined in the base class
     */
    this.__n = this.__c.next(this.__n) as TreeNode<K, V>;
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
  prev(): void {
    this.__n = this.__c.prev(this.__n) as TreeNode<K, V>;
  }
}

/**
 * STL-like backward iterator. Can be used to traverse container or a range in the reverse order.
 * It's more verbose than ES6 iterators, but allows iteration over any part of the container
 * @template K - key type
 * @template V - value type
 * @template C - container type
 * @example
 * let m = new TreeMap();
 * ...
 * for (let it = m.rbegin(); !it.equals(m.rend()); it.next()) {
 *   console.log(`key: ${it.key}, value: ${it.value}`);
 * }
 */
export class ReverseIterator<
  K,
  V,
  C extends IterableContainer,
> extends BaseIterator<K, V, C> {
  /**
   * There are 3 ways to construct a reverse iterator:
   *
   * 1. Using a node and a container
   * 2. Copy constructor / clone
   * 3. Copy constructor / clone from forward Iterator instance
   * @param {*} args - One of possible sets of constructor parameters
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
   * @private
   */
  constructor(...args: any[]) {
    if (args.length === 2) {
      const [node, container] = args;
      super(node, container);
    } else if (args.length === 1) {
      const [obj] = args;
      const className = obj.constructor.name;
      if (obj instanceof ReverseIterator) {
        super(obj.__n, obj.__c);
      } else if (obj instanceof TreeIterator) {
        const c = obj.__c;
        super(c.prev(obj.__n), c);
      } else {
        throw new Error(`Can't create an ReverseIterator from ${className}`);
      }
    } else {
      throw new Error(
        "Can't create a Reverse Iterator with provided parameters"
      );
    }
  }

  /**
   * Replaces node reference with the reference of the previous node in the container, because it works in reverse order
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
  next(): void {
    /**
     * __n and __c are defined in the base class
     */
    this.__n = this.__c.prev(this.__n) as TreeNode<K, V>;
  }

  /**
   * Replaces node reference with the reference of the next node in the container, because it works in reverse order
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
  prev(): void {
    this.__n = this.__c.next(this.__n) as TreeNode<K, V>;
  }
}
