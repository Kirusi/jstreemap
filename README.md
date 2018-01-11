# jstreemap

A JavaScript (ES6) library of tree-based associative containers.
* [**TreeSet**](https://kirusi.github.io/jstreemap/class/src/public/tree-set.js~TreeSet.html) - is a container that stores unique elements following a specific order. In a TreeSet, the value of an element also identifies it (the value is itself the key),and each value must be unique. The value of the elements in a TreeSet cannot be modified once in the container (the elements are immutable), but they can be inserted or removed from the container.
* [**TreeMap**](https://kirusi.github.io/jstreemap/class/src/public/tree-map.js~TreeMap.html) - is an associative container that stores elements formed
by a combination of a key value and a mapped value, following a specific order.
In a TreeMap, the key values are generally used to sort and uniquely identify
the elements, while the mapped values store the content associated to this key.
The types of key and mapped value may differ.
* [**TreeMultiSet**](https://kirusi.github.io/jstreemap/class/src/public/tree-multiset.js~TreeMultiSet.html) - is a container that stores elements following a specific order, and where multiple elements can have equivalent values. In a TreeMultiSet, the value of an element also identifies it (the value is itself the key). The value of the elements in a multiset cannot be modified once in the container (the elements are always immutable), but they can be inserted or removed from the container.
* [**TreeMultiMap**](https://kirusi.github.io/jstreemap/class/src/public/tree-multimap.js~TreeMultiMap.html) - is an associative container that stores elements formed by a combination of a key value and a mapped value, following a specific order, and where multiple elements can have equivalent keys. In a TreeMultiMap, the key values are generally used to sort and uniquely identify the elements, while the mapped values store the content associated to this key. The types of key and mapped value may differ.

All container implementations are using  red-black trees. Detailed library documentation is [here.](https://kirusi.github.io/jstreemap)

## Installation

Using npm:
```shell
$ npm i --save jstreemap
```

In Node.js:
```js
// Load library.
const {TreeSet, TreeMap, TreeMultiSet, TreeMultiMap} = require('jstreemap');

// Create and initialize map.
let map = new TreeMap([[2, 'B'], [1, 'A'], [3, 'C']]);
// Iterate through all key-value pairs
// Note that entries are stored in the ascending order of the keys,
// not in the insertion order as in standard ES6 map
for(let [k,v] of map) {
    console.log(`key: ${k}, value: ${v}`);
}
// Expected output:
// key: 1, value: A
// key: 2, value: B
// key: 3, value: C

// Iterate elements in reverse order
for(let [k,v] of map.backward()) {
    console.log(`key: ${k}, value: ${v}`);
}

// find all elements with keys between 10 and 20 inclusive
for (let it = map.lowerBound(10); !it.equals(map.upperBound(20); it.next()) {
    console.log(`key: ${it.key}, value: ${it.value}`);
}
```
## Why jstreemap?
Ordered associative containers are not provided by default with JavaScript. This library provides an efficient implementation where performance of insert, delete and search operations is O(log(n)).

Unlike standard sets and maps in ES6, this library provides  ordered containers. Iteration through container contents will be done in sorted order without any additional performance overhead.

[Container API](https://kirusi.github.io/jstreemap) implements features of default ES6 maps and sets as well as parts of STL (C++ library) interface.

The library showcases 100% test coverage and 100% documentation coverage.