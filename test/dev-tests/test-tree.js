'use strict';

const should = require('should');
const assert = require('assert');

const {TreeNode, RED, BLACK} = require('../../src/internal/tree-node');
const {Tree, compare} = require('../../src/internal/tree');
const {Iterator, ReverseIterator} = require('../../src/public/iterators');
const {KeyOnlyPolicy, KeyValuePolicy} = require('../../src/internal/policies');

const fs = require('fs');
let data = fs.readFileSync('./test/specs/tree.spec.js', 'utf8');
eval(data);