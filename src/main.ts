/* This is an entry point to the library.
   It collects all public classes and re-exports them */
/**@private */
import { TreeMap } from './tree-map.js';
/**@private */
import { TreeMultiMap } from './tree-multimap.js';
/**@private */
import { TreeSet } from './tree-set.js';
/**@private */
import { TreeMultiSet } from './tree-multiset.js';
/**@private */
import { TreeIterator, ReverseIterator } from './iterators.js';
/**@private */
import { JsIterator, JsReverseIterator } from './js-iterators.js';

export default {
  TreeIterator: TreeIterator,
  ReverseIterator: ReverseIterator,
  JsIterator: JsIterator,
  JsReverseIterator: JsReverseIterator,
  TreeMap: TreeMap,
  TreeMultiMap: TreeMultiMap,
  TreeSet: TreeSet,
  TreeMultiSet: TreeMultiSet,
};
