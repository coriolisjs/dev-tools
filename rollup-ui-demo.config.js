import babel from 'rollup-plugin-babel'
import svelte from 'rollup-plugin-svelte'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import preprocess from 'svelte-preprocess'
import postcssPresetEnv from 'postcss-preset-env'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/demo/entry.js',
  output: [
    {
      sourcemap: true,
      format: 'esm',
      dir: 'dist/ui-demo',
    },
  ],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },

      preprocess: preprocess({
        postcss: {
          plugins: [postcssPresetEnv()],
        },
      }),
      emitCss: false,
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      // browser: true,
      dedupe: (importee) =>
        importee === 'svelte' || importee.startsWith('svelte/'),
    }),
    commonjs(),
  ],
  watch: {
    clearScreen: false,
  },
}
