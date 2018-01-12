const path = require('path');

module.exports = {
    entry: ['./src/public/main.js'],
    output: {
        filename: 'jstreemap.js',
        path: path.resolve(__dirname, '../'),
        libraryTarget: 'umd'
    }
};