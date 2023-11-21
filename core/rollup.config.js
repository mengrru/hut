import typescript from "@rollup/plugin-typescript"
import json from "@rollup/plugin-json"
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
  input: "core/src/index.ts",
  output: {
    file: "core/bundle.js",
    format: "iife"
  },
  plugins: [
    typescript({
      compilerOptions: {
        lib: ["es5", "es6", "dom"],
        target: "es5",
      },
      importHelpers: false,
      allowSyntheticDefaultImports: true
    }),
    json(),
    resolve({ perferBuiltins: false }),
    commonjs(),
    terser()
  ]
};
