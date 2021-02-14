import { identity, EMPTY } from 'rxjs'
import { map } from 'rxjs/operators'

import { produce } from 'immer'

import { createStore, snapshot } from '@coriolis/coriolis'

import { storage } from './effects/storage'
import { createUI } from './effects/ui'
import { storeEvent, storeAdded, storeEnded } from './events'

let destroyDevtoolsStore
const initDevtoolsEventStore = () => {
  let devtoolsDispatch

  destroyDevtoolsStore = createStore(
    { eventEnhancer: map(produce(identity)) },
    createUI(),
    storage,
    ({ dispatch }) => {
      devtoolsDispatch = dispatch
    },
  )

  // TODO: should not receive storeId and trackingEvents$, we should create it here and return a Subject to receive new events
  return (storeId, storeName = 'unnamed', trackingEvents = EMPTY) => ({
    event$,
    pastEvent$,
    withProjection,
  }) => {
    devtoolsDispatch(
      storeAdded({
        storeId,
        storeName,
        snapshot$: withProjection(snapshot),
      }),
    )

    const trackingEventsSubscription = trackingEvents.subscribe((event) =>
      devtoolsDispatch({ ...event, payload: { ...event.payload, storeId } }),
    )
    const pastEventsSubscription = pastEvent$.subscribe((event) =>
      devtoolsDispatch(storeEvent({ storeId, event, isPastEvent: true })),
    )
    const eventsSubscription = event$.subscribe((event) =>
      devtoolsDispatch(storeEvent({ storeId, event })),
    )

    // TODO: should return an object with the effect and the tracking subject
    return () => {
      devtoolsDispatch(storeEnded({ storeId }))
      // unsubscribe this later so we can still catch store error events
      setTimeout(() => trackingEventsSubscription.unsubscribe(), 1000)
      pastEventsSubscription.unsubscribe()
      eventsSubscription.unsubscribe()
    }
  }
}

let createDevtoolsEffect
export const createCoriolisDevToolsEffect = (...args) => {
  if (!createDevtoolsEffect) {
    createDevtoolsEffect = initDevtoolsEventStore()
  }

  return createDevtoolsEffect(...args)
}

export const disableCoriolisDevTools = () =>
  destroyDevtoolsStore && destroyDevtoolsStore()
