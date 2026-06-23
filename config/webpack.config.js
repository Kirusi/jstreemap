import path from 'path';
import { merge } from 'webpack-merge';

const distPath = path.resolve(import.meta.dirname, '../');

const baseConfig = {
  optimization: {
    minimize: false,
  },
  entry: ['./build/compiled/src/main.js'],
  mode: 'production',
  devtool: 'source-map',
};

export default [
  merge(baseConfig, {
    output: {
      filename: 'dist/umd/jstreemap.js',
      sourceMapFilename: 'dist/umd/jstreemap.map',
      path: distPath,
      library: {
        type: 'umd',
      },
    },
  }),
  merge(baseConfig, {
    experiments: {
      outputModule: true,
    },
    output: {
      filename: 'dist/esm/jstreemap.js',
      sourceMapFilename: 'dist/esm/jstreemap.map',
      path: distPath,
      module: true,
      library: {
        type: 'module',
      },
    },
  }),
];
