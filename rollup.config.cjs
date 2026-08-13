'use strict';

const { libraryPreset } = require('rollup-presets');
const { dts } = require('rollup-plugin-dts');

async function allOptions() {
  let res = await libraryPreset({
    formats: ['esm', 'cjs'],
    preserveModules: false,
    sourcemap: false,
  });
  res = [
    ...res,
    {
      input: 'src/index.ts', // Points to your entry point; the plugin resolves the types
      output: [{ file: 'dist/types/index.d.ts', format: 'es' }],
      plugins: [dts()],
    },
  ];
  return res;
}

module.exports = allOptions();
