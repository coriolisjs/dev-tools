import { Subject } from 'rxjs'
import { createStateFlowFactory as defaultCreateStateFlowFactory } from '@coriolis/coriolis'

import { createTrackedStateFlowBuilder } from './stateFlow'
import { getStateFlowCalled } from '../events/tracking/stateFlow'

export const createTrackedStateFlowFactoryBuilder = (
  createStateFlowFactory = defaultCreateStateFlowFactory,
) => {
  const trackingSubject = new Subject()

  return {
    tracking$: trackingSubject,
    createStateFlowFactory: (event$, skipUntil) => {
      const { tracking$: stateFlowTracking$, createTrackedStateFlow } =
        createTrackedStateFlowBuilder()

      stateFlowTracking$.subscribe(trackingSubject)

      const getStateFlow = createStateFlowFactory(
        event$,
        skipUntil,
        createTrackedStateFlow,
      )

      // this function is the "withProjection" function in effect API
      // It will be wrapped and tracked in the effect tracking process
      return (...args) => {
        const stateFlow = getStateFlow(...args)

        trackingSubject.next(
          getStateFlowCalled({
            projection: args,
            stateFlow,
          }),
        )

        return stateFlow
      }
    },
  }
}
