'use strict';

const should = require('should');
const assert = require('assert');

const {JsIterator, JsReverseIterator} = require('../../jstreemap');

const fs = require('fs');
let data = fs.readFileSync('./test/specs/js-iterators.spec.js', 'utf8');
eval(data);