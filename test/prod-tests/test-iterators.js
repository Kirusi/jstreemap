'use strict';

const should = require('should');
const assert = require('assert');

const {Iterator, ReverseIterator} = require('../../jstreemap');

const fs = require('fs');
let data = fs.readFileSync('./test/specs/iterators.spec.js', 'utf8');
eval(data);