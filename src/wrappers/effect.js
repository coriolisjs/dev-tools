import { Subject } from 'rxjs'
import {
  effectAdded,
  effectRemoved,
  withProjectionCalled,
} from '../events/tracking/effect'

import { wrapCommand } from './command'

const createTrackedAddEffect = (trackingSubject, effectAPI) => (effect) => {
  const { tracking$, effect: wrappedEffect } = wrapEffect(effect)
  tracking$.subscribe(trackingSubject)
  return effectAPI.addEffect(wrappedEffect)
}

const createTrackedDispatch = (trackingSubject, effectAPI) => (event) => {
  if (typeof event === 'function') {
    const { tracking$, command } = wrapCommand(event)

    tracking$.subscribe(trackingSubject)

    return effectAPI.dispatch(command)
  }
  return effectAPI.dispatch(event)
}

const createTrackedWithProjection =
  (trackingSubject, effectAPI) =>
  (...args) => {
    const stateFlow = effectAPI.withProjection(...args)

    trackingSubject.next(
      withProjectionCalled({
        projection: args,
        stateFlow: stateFlow,
      }),
    )

    return stateFlow
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
        dispatch: createTrackedDispatch(trackingSubject, effectAPI),
        withProjection: createTrackedWithProjection(trackingSubject, effectAPI),

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
