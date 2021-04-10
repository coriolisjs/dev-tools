import { identity, noop } from 'rxjs'
import { map } from 'rxjs/operators'

import { produce } from 'immer'

import { createStore, snapshot } from '@coriolis/coriolis'

import { storage } from './effects/storage'
import { createUI } from './effects/ui'
import { storeEvent, storeAdded, storeEnded } from './events/tracking/store'

let destroyDevtoolsStore
const initDevtoolsEventStore = () => {
  let devtoolsDispatch = noop

  let lastStoreId = 0
  const getStoreId = () => ++lastStoreId

  destroyDevtoolsStore = createStore(
    { eventEnhancer: map(produce(identity)) },
    createUI(),
    storage,
    ({ dispatch }) => {
      devtoolsDispatch = dispatch

      return () => {
        devtoolsDispatch = noop
        createDevtoolsEffect = undefined
      }
    },
  )

  return (storeName = 'unnamed', tracking$) => {
    const storeId = getStoreId()

    const trackingSubjectSubscription = tracking$.subscribe((event) =>
      devtoolsDispatch({
        ...event,
        payload: { ...event.payload, storeId },
      }),
    )

    return ({ event$, pastEvent$, withProjection }) => {
      devtoolsDispatch(
        storeAdded({
          storeId,
          storeName,
          snapshot$: withProjection(snapshot),
        }),
      )

      const pastEventsSubscription = pastEvent$.subscribe((event) =>
        devtoolsDispatch(storeEvent({ storeId, event, isPastEvent: true })),
      )

      const eventsSubscription = event$.subscribe((event) =>
        devtoolsDispatch(storeEvent({ storeId, event })),
      )

      return () => {
        devtoolsDispatch(storeEnded({ storeId }))
        // unsubscribe this later so we can still catch store error events
        setTimeout(() => trackingSubjectSubscription.unsubscribe(), 1000)
        pastEventsSubscription.unsubscribe()
        eventsSubscription.unsubscribe()
      }
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
