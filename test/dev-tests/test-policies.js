'use strict';

const should = require('should');
const assert = require('assert');

const {TreeNode} = require('../../src/internal/tree-node');
const {KeyOnlyPolicy, ValueOnlyPolicy, KeyValuePolicy} = require('../../src/internal/policies');

const fs = require('fs');
let data = fs.readFileSync('./test/specs/policies.spec.js', 'utf8');
eval(data);
