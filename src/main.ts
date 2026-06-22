/* This is an entry point to the library.
   It collects all public classes and re-exports them */
import { ReverseIterator, TreeIterator } from './iterators.js';
import { JsIterator, JsReverseIterator } from './js-iterators.js';
import { TreeMap } from './tree-map.js';
import { TreeMultiMap } from './tree-multimap.js';
import { TreeMultiSet } from './tree-multiset.js';
import { TreeSet } from './tree-set.js';

export default {
  TreeIterator,
  ReverseIterator,
  JsIterator,
  JsReverseIterator,
  TreeMap,
  TreeMultiMap,
  TreeSet,
  TreeMultiSet,
};
