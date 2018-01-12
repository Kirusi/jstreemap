'use strict';

const should = require('should');
const assert = require('assert');

const {TreeMultiSet} = require('../../src/public/tree-multiset');

const fs = require('fs');
let data = fs.readFileSync('./test/specs/tree-multiset.spec.js', 'utf8');
eval(data);