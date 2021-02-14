import { createStateFlowFactory } from '@coriolis/coriolis'

import { createTrackedStateFlow } from './stateFlow'

import { stateFlowIndexed } from '../events'

export const createTrackedStateFlowFactory = (trackingSubject) => (
  event$,
  skipUntil,
) => {
  const stateFlowFactory = createStateFlowFactory(
    event$,
    skipUntil,
    createTrackedStateFlow(trackingSubject),
  )

  return (...args) => {
    // TODO : here we could wrap projection to track.... something about compilation
    const stateFlow = stateFlowFactory(...args)
    trackingSubject.next(
      stateFlowIndexed({
        stateFlowId: stateFlow.id,
        stateFlow: stateFlow,
        args,
      }),
    )

    return stateFlow
  }
}
