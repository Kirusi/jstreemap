import path from 'path';
import { merge } from 'webpack-merge';
import NpmDtsPlugin from 'npm-dts-webpack-plugin';

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
      path: distPath,
      module: true,
      library: {
        type: 'module',
      },
    },
    plugins: [
      new NpmDtsPlugin({
        entry: '../src/main.esm.ts',
        output: path.resolve(import.meta.dirname, '../dist/esm/jstreemap.d.ts'),
      }),
    ],
  }),
];
