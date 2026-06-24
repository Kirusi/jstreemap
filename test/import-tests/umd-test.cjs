'use strict';

const { TreeMap } = require('../../dist/umd/jstreemap.cjs');

function compareArraysInOrder(actual, expected) {
  const maxLength = Math.max(actual.length, expected.length);
  const differences = [];

  for (let i = 0; i < maxLength; i++) {
    if (actual[i] !== expected[i]) {
      differences.push({
        index: i,
        array1Value:
          actual[i] === undefined ? '(missing in array 1)' : actual[i],
        array2Value:
          expected[i] === undefined ? '(missing in array 2)' : expected[i],
      });
    }
  }

  return differences;
}

function main() {
  const map = new TreeMap([
    [2, 'B'],
    [1, 'A'],
    [3, 'C'],
  ]);
  map.set(5, 'E');
  map.set(4, 'D');

  const res = [];

  // Expected output:
  // key: 5, value: E
  // key: 4, value: D
  // key: 3, value: C
  // key: 2, value: B
  // key: 1, value: A
  for (const [k, v] of map) {
    res.push(`${k}, ${v}`);
  }
  // Expected output:
  // key: 1, value: A
  // key: 2, value: B
  // key: 3, value: C
  // key: 4, value: D
  // key: 5, value: E

  // Iterate elements in reverse order
  for (const [k, v] of map.backward()) {
    res.push(`${k}, ${v}`);
  }

  // find all elements with keys between 1 and 2 inclusive
  // key: 1, value: A
  // key: 2, value: B
  for (let it = map.lowerBound(1); !it.equals(map.upperBound(2)); it.next()) {
    res.push(`${it.key}, ${it.value}`);
  }

  const diffs = compareArraysInOrder(res, [
    '1, A',
    '2, B',
    '3, C',
    '4, D',
    '5, E',
    '5, E',
    '4, D',
    '3, C',
    '2, B',
    '1, A',
    '1, A',
    '2, B',
  ]);
  if (diffs.length > 0) {
    // eslint-disable-next-line no-console
    console.log(diffs);
    process.exit(1);
  }
}

main();
