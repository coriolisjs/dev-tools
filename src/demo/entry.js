import Demo from './Demo.svelte'

import * as fixtures from './fixtures'

const main = () =>
  new Demo({
    target: document.body,
    props: {
      fixtures,
    },
  })

main()
