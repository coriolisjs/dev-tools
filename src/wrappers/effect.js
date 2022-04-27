import { Subject } from 'rxjs'
import { effectAdded, effectRemoved } from '../events/tracking/effect'

import { createEventWrapper } from './event'

const createTrackedAddEffect = (trackingSubject, effectAPI) => (effect) => {
  const { tracking$, effect: wrappedEffect } = wrapEffect(effect)
  tracking$.subscribe(trackingSubject)
  return effectAPI.addEffect(wrappedEffect)
}

export const wrapEffect = (effect) => {
  const trackingSubject = new Subject()

  const { tracking$: eventsTracking$, wrapEvent } = createEventWrapper(effect)

  eventsTracking$.subscribe(trackingSubject)

  return {
    tracking$: trackingSubject,
    effect: (effectAPI) => {
      trackingSubject.next(effectAdded({ effect }))

      const removeEffect = effect({
        ...effectAPI,
        addEffect: createTrackedAddEffect(trackingSubject, effectAPI),
        dispatch: (event) => effectAPI.dispatch(wrapEvent(event)),

        // withProjection is already tracked with trackedStateFlowFactory

        // TODO : Add more tracking types
        // - addSource: () => {},
        // - addLogger: () => {},
        // - addEventEnhancer: () => {},
        // - addPastEventEnhancer: () => {},
        // - addAllEventsEnhancer: () => {},
      })

      return () => {
        removeEffect()
        trackingSubject.next(effectRemoved({ effect }))
      }
    },
  }
}
