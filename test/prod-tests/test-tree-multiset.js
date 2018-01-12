'use strict';

const should = require('should');
const assert = require('assert');

const {TreeMultiSet} = require('../../jstreemap');

const fs = require('fs');
let data = fs.readFileSync('./test/specs/tree-multiset.spec.js', 'utf8');
eval(data);