/* This is an entry point to the library.
   It collects all public classes and re-exports them */
/**@private */
const {TreeMap} = require('./tree-map');
/**@private */
const {TreeMultiMap} = require('./tree-multimap');
/**@private */
const {TreeSet} = require('./tree-set');
/**@private */
const {TreeMultiSet} = require('./tree-multiset');
/**@private */
const {Iterator, ReverseIterator} = require('./iterators');
/**@private */
const {JsIterator, JsReverseIterator} = require('./js-iterators');

module.exports = {
    Iterator: Iterator,
    ReverseIterator: ReverseIterator,
    JsIterator: JsIterator,
    JsReverseIterator: JsReverseIterator,
    TreeMap: TreeMap,
    TreeMultiMap: TreeMultiMap,
    TreeSet: TreeSet,
    TreeMultiSet: TreeMultiSet,
};