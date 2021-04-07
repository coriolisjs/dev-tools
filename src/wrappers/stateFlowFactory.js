import { Subject } from 'rxjs'
import { createStateFlowFactory as defaultCreateStateFlowFactory } from '@coriolis/coriolis'

import { createTrackedStateFlowBuilder } from './stateFlow'

import { stateFlowIndexed } from '../events'

export const createTrackedStateFlowFactoryBuilder = (
  createStateFlowFactory = defaultCreateStateFlowFactory,
) => {
  const trackingSubject = new Subject()

  return {
    tracking$: trackingSubject,
    createStateFlowFactory: (event$, skipUntil) => {
      const { tracking$, createStateFlow } = createTrackedStateFlowBuilder()

      tracking$.subscribe(trackingSubject)

      const stateFlowFactory = createStateFlowFactory(
        event$,
        skipUntil,
        createStateFlow,
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
    },
  }
}
