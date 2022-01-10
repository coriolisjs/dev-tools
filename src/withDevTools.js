import { parseStoreArgs } from '@coriolis/coriolis'

import { createStoreTrackingEffect } from './effects/storeTrackingEffect'

import { getDevtoolsStore } from './devtoolsStore'

export const wrapCoriolisOptions = (...args) => {
  const devToolsStore = getDevtoolsStore()

  const { storeTrackingEffect, storeOptions } = createStoreTrackingEffect(
    parseStoreArgs(...args),
  )

  devToolsStore.addEffect(storeTrackingEffect)

  return storeOptions
}

export const withDevTools =
  (createStore) =>
  (...args) =>
    createStore(wrapCoriolisOptions(...args))
