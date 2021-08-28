import { identity, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { produce } from 'immer'

import { createStore } from '@coriolis/coriolis'

import { storage } from './effects/storage'
import { createUI } from './effects/ui'

export const createDevtoolsStore = () => {
  const trackingSubject = new Subject()
  const destroyDevtoolsStore = createStore(
    { eventEnhancer: map(produce(identity)) },
    createUI(),
    storage,
    ({ dispatch }) => trackingSubject.subscribe(dispatch),
  )

  return {
    trackingObserver: (trackingEvent) => trackingSubject.next(trackingEvent),
    destroyDevtoolsStore,
  }
}

let devtoolsTrackingObserver
export const getDevtoolsTrackingObserver = () => {
  if (!devtoolsTrackingObserver) {
    ;({ trackingObserver: devtoolsTrackingObserver } = createDevtoolsStore())
  }

  return devtoolsTrackingObserver
}
