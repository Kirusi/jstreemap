'use strict';

const should = require('should');
const assert = require('assert');

const {Iterator, ReverseIterator} = require('../../jstreemap');
const {JsIterator, JsReverseIterator} = require('../../jstreemap');
const {TreeMap} = require('../../jstreemap');
const {TreeMultiMap} = require('../../jstreemap');
const {TreeMultiSet} = require('../../jstreemap');
const {TreeSet} = require('../../jstreemap');

const fs = require('fs');
let specs = [
    './test/specs/iterators.spec.js',
    './test/specs/js-iterators.spec.js',
    './test/specs/tree-map.spec.js',
    './test/specs/tree-multimap.spec.js',
    './test/specs/tree-multiset.spec.js',
    './test/specs/tree-set.spec.js'
];

for (let spec of specs) {
    let data = fs.readFileSync(spec, 'utf8');
    eval(data);
}