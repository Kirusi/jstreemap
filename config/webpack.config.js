const path = require('path');

module.exports = {
    entry: ['src/red-black-tree.js'],
    output: {
        filename: 'setmap.js',
        path: path.resolve(__dirname, '../lib'),
        libraryTarget: 'umd'
    }
};