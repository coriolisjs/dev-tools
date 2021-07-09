import { EMPTY } from 'rxjs'

import { createStore, snapshot } from '@coriolis/coriolis'

import { storage } from './effects/storage'
import { createUI } from './effects/ui'
import { storeEvent, storeAdded, storeEnded } from './events'

let destroyDevtoolsStore
const initDevtoolsEventStore = () => {
  let devtoolsDispatch

  destroyDevtoolsStore = createStore(createUI(), storage, ({ dispatch }) => {
    devtoolsDispatch = dispatch
  })

  return (storeId, storeName = 'unnamed', aggregatorEvents = EMPTY) => ({
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

    const aggregatorEventsSubscription = aggregatorEvents.subscribe((event) =>
      devtoolsDispatch(event),
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
      setTimeout(() => aggregatorEventsSubscription.unsubscribe(), 1000)
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
