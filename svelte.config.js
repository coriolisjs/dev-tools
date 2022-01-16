const preprocess = require('svelte-preprocess')
const postcssPresetEnv = require('postcss-preset-env')

module.exports = {
  preprocess: preprocess({
    scss: {
      prependData: `@import 'src/styles/colors.scss';`,
    },
    postcss: {
      plugins: [postcssPresetEnv()],
    },
  }),
}
