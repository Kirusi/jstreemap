import path from 'path';
import { merge } from 'webpack-merge';

const distPath = path.resolve(import.meta.dirname, '../');

const baseConfig = {
  optimization: {
    minimize: false,
  },
  mode: 'production',
  devtool: 'source-map',
};

export default [
  merge(baseConfig, {
    entry: ['./build/compiled/src/main.umd.js'],
    output: {
      filename: 'dist/umd/jstreemap.js',
      sourceMapFilename: 'dist/umd/jstreemap.map',
      path: distPath,
      library: {
        type: 'umd',
        export: 'default',
      },
      globalObject: 'this',
    },
  }),
  merge(baseConfig, {
    experiments: {
      outputModule: true,
    },
    entry: ['./build/compiled/src/main.esm.js'],
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
