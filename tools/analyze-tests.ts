import fs from 'fs';
import path from 'path';

//@ts-expect-error: TS7016
import { BadgeFactory } from 'gh-badges';

const buildDir = path.join(import.meta.dirname, '..', 'build');
const testResultsFile = path.join(buildDir, process.argv[2]);
const rawData = fs.readFileSync(testResultsFile, 'utf8');

const jsonDoc = JSON.parse(rawData);
const allTests = jsonDoc.numTotalTests;
const passed = jsonDoc.numPassedTests;
const failed = jsonDoc.numFailedTests;

const bf = new BadgeFactory();
const color = allTests === passed ? 'brightgreen' : 'red';
const format = {
  text: ['tests', `${passed} passed, ${failed} failed`],
  color,
  template: 'flat',
  format: 'svg',
};

const svg = bf.create(format);
const svgFile = path.join(import.meta.dirname, 'test-badge.svg');
const stream = fs.createWriteStream(svgFile);
try {
  stream.write(svg);
} finally {
  stream.end();
}
