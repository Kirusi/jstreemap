'use strict';

const should = require('should');
const assert = require('assert');

const {TreeMultiMap} = require('../../jstreemap');

const fs = require('fs');
let data = fs.readFileSync('./test/specs/tree-multimap.spec.js', 'utf8');
eval(data);