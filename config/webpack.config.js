const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    entry: ['./src/public/main.js'],
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
                keep_fnames: true,
                mangle: true
            }
        })],
    },
    output: {
        filename: 'jstreemap.js',
        path: path.resolve(__dirname, '../'),
        libraryTarget: 'umd'
    }
};