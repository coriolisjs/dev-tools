const preprocess = require('svelte-preprocess')
const postcssPresetEnv = require('postcss-preset-env')

module.exports = {
  preprocess: preprocess({
    postcss: {
      plugins: [postcssPresetEnv()],
    },
  }),
}
