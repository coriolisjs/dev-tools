import { identity } from 'rxjs'
import { map } from 'rxjs/operators'

import { produce } from 'immer'

import { createStore } from '@coriolis/coriolis'

import { storage } from './effects/storage'
import { createUI } from './effects/ui'

export const createDevtoolsStore = () => {
  const store = createStore(
    { eventEnhancer: map(produce(identity)) },
    createUI(),
    storage,
  )

  return store
}

let devtoolsStore
export const getDevtoolsStore = () => {
  if (!devtoolsStore) {
    devtoolsStore = createDevtoolsStore()
  }

  return devtoolsStore
}
