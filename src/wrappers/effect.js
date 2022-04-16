import { Subject } from 'rxjs'
import { effectAdded, effectRemoved } from '../events/tracking/effect'

import { wrapCommand } from './command'

const createTrackedAddEffect = (trackingSubject, effectAPI) => (effect) => {
  const { tracking$, effect: wrappedEffect } = wrapEffect(effect)
  tracking$.subscribe(trackingSubject)
  return effectAPI.addEffect(wrappedEffect)
}

const createTrackedDispatch =
  (trackingSubject, effectAPI, fromEffect) => (event) => {
    if (typeof event === 'function') {
      const { tracking$, command } = wrapCommand(event, fromEffect)

      tracking$.subscribe(trackingSubject)

      return effectAPI.dispatch(command)
    }

    const meta = event.meta || {}

    return effectAPI.dispatch({
      ...event,
      meta: {
        ...meta,
        fromEffect,
      },
    })
  }

export const wrapEffect = (effect) => {
  const trackingSubject = new Subject()

  return {
    tracking$: trackingSubject,
    effect: (effectAPI) => {
      trackingSubject.next(effectAdded({ effect }))

      const removeEffect = effect({
        ...effectAPI,
        addEffect: createTrackedAddEffect(trackingSubject, effectAPI),
        dispatch: createTrackedDispatch(trackingSubject, effectAPI, effect),

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
