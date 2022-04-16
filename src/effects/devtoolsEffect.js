import { Subject } from 'rxjs'

import { storeAdded, storeEnded, storeEvent } from '../events/tracking/store'

export const createDevtoolsEffect = (storeName = 'unnamed') => {
  const trackingSubject = new Subject()
  const devtoolsEffect = ({ event$, pastEvent$, withProjection }) => {
    trackingSubject.next(
      storeAdded({
        storeName,
        snapshot$: withProjection('snapshot'),
      }),
    )

    const pastEventsSubscription = pastEvent$.subscribe((event) =>
      trackingSubject.next(storeEvent({ event, isPastEvent: true })),
    )

    const eventsSubscription = event$.subscribe((event) =>
      trackingSubject.next(storeEvent({ event })),
    )

    return () => {
      trackingSubject.next(storeEnded())
      pastEventsSubscription.unsubscribe()
      eventsSubscription.unsubscribe()
    }
  }

  return {
    tracking$: trackingSubject,
    devtoolsEffect,
  }
}
