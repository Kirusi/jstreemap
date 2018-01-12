'use strict';

const should = require('should');
const assert = require('assert');

const {TreeNode, RED, BLACK} = require('../../src/internal/tree-node');

const fs = require('fs');
let data = fs.readFileSync('./test/specs/tree-node.spec.js', 'utf8');
eval(data);