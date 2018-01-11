/* This is an entry point to the library.
   It collects all public classes and re-exports them */
const {TreeMap} = require('./src/public/tree-map');
const {TreeMultiMap} = require('./src/public/tree-multimap');
const {TreeSet} = require('./src/public/tree-set');
const {TreeMultiSet} = require('../src/public/tree-multiset');
const {Iterator, ReverseIterator} = require('./src/public/iterators');

module.exports = {
    TreeMap: TreeMap,
    TreeMultiMap: TreeMultiMap,
    TreeSet: TreeSet,
    TreeMultiSet: TreeMultiSet,
    Iterator: Iterator,
    ReverseIterator: ReverseIterator
};