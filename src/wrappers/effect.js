import { Subject } from 'rxjs'
import { effectAdded, effectRemoved } from '../events/tracking/effect'

import { createEventWrapper } from './event'

export const createEffectWrapper = () => {
  const trackingSubject = new Subject()

  const wrapEffect = (effect) => {
    const { tracking$: eventsTracking$, wrapEvent } = createEventWrapper(effect)

    eventsTracking$.subscribe(trackingSubject)

    return (effectAPI) => {
      trackingSubject.next(effectAdded({ effect }))

      const removeEffect = effect({
        ...effectAPI,
        addEffect: (effect) => effectAPI.addEffect(wrapEffect(effect)),
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
    }
  }

  return {
    tracking$: trackingSubject,
    wrapEffect,
  }
}
