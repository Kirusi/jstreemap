'use strict';

const should = require('should');
const assert = require('assert');

const {TreeMap} = require('../../src/public/tree-map');

const fs = require('fs');
let data = fs.readFileSync('./test/specs/tree-map.spec.js', 'utf8');
eval(data);