'use strict';
const fs = require('fs');
const path = require('path');
const libxmljs = require('libxmljs');
const { BadgeFactory } = require('gh-badges');

let buildDir = path.join(__dirname, '..', 'build');
let testResultsFile = path.join(buildDir, process.argv[2]);
let xmlTxt = fs.readFileSync(testResultsFile, 'utf8');

let xmlDoc = libxmljs.parseXml(xmlTxt);
let allTests = xmlDoc.get('//testsuites');
let tests = parseInt(allTests.attr('tests').value(), 10);
let failed = parseInt(allTests.attr('failures').value(), 10);
let passed = tests - failed;

const bf = new BadgeFactory();
let color = failed === 0 ? 'brightgreen' : 'red';
const format = {
    text: ['tests', `${passed} passed, ${failed} failed`],
    color: color,
    template: 'flat',
    format: 'svg'
};

const svg = bf.create(format);
let svgFile = path.join(__dirname, 'test-badge.svg');
let stream = fs.createWriteStream(svgFile);
try {
    stream.write(svg);
}
finally {
    stream.end();
}
