import typescript from "@rollup/plugin-typescript"

export default {
  input: "src/index.ts",
  output: {
    dir: "release/dist",
    format: "cjs"
  },
  plugins: [typescript({
    compilerOptions: {
      lib: ["es5", "es6", "dom"],
      target: "es5",
    },
    importHelpers: false,
    allowSyntheticDefaultImports: true
  })]
};
