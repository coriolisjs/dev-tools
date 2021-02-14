import { effectAdded, effectRemoved } from '../events'

import { wrapCommand } from './command'

const wrapEffectAPI = (trackingSubject, effectAPI) => {
  const doWrapEffect = wrapEffect(trackingSubject)

  return {
    ...effectAPI,
    addEffect: (effect) => effectAPI.addEffect(doWrapEffect(effect)),
    dispatch: (event) => {
      if (typeof event === 'function') {
        return effectAPI.dispatch(wrapCommand(trackingSubject, event))
      }
      return effectAPI.dispatch(event)
    },
    // TODO : Add more tracking types
    // - addSource: () => {},
    // - addLogger: () => {},
    // - addEventEnhancer: () => {},
    // - addPastEventEnhancer: () => {},
    // - addAllEventsEnhancer: () => {},

    // we already track this using stateFow creation tracking
    // - withProjection: () => {},
  }
}

export const wrapEffect = (trackingSubject) => (effect) => (effectAPI) => {
  const removeEffect = effect(wrapEffectAPI(trackingSubject, effectAPI))

  trackingSubject.next(effectAdded({ effect }))

  return () => {
    removeEffect()
    trackingSubject.next(effectRemoved({ effect }))
  }
}
