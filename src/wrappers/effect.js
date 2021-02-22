import { Subject } from 'rxjs'
import { effectAdded, effectRemoved } from '../events'

import { wrapCommand } from './command'

export const wrapEffect = (effect) => {
  const trackingSubject = new Subject()

  const createTrackedAddEffect = (effectAPI) => (effect) => {
    const { tracking$, effect: wrappedEffect } = wrapEffect(effect)
    tracking$.subscribe(trackingSubject)
    return effectAPI.addEffect(wrappedEffect)
  }

  const createTrackedDispatch = (effectAPI) => (event) => {
    if (typeof event === 'function') {
      const { tracking$, command } = wrapCommand(event)

      tracking$.subscribe(trackingSubject)

      return effectAPI.dispatch(command)
    }
    return effectAPI.dispatch(event)
  }

  return {
    tracking$: trackingSubject,
    effect: (effectAPI) => {
      trackingSubject.next(effectAdded({ effect }))

      const removeEffect = effect({
        ...effectAPI,
        addEffect: createTrackedAddEffect(effectAPI),
        dispatch: createTrackedDispatch(effectAPI),
        // TODO : Add more tracking types
        // - addSource: () => {},
        // - addLogger: () => {},
        // - addEventEnhancer: () => {},
        // - addPastEventEnhancer: () => {},
        // - addAllEventsEnhancer: () => {},

        // we already track this using stateFow creation tracking
        // - withProjection: () => {},
      })

      return () => {
        removeEffect()
        trackingSubject.next(effectRemoved({ effect }))
      }
    },
  }
}
