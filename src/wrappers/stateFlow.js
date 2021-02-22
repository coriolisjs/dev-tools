import { Observable, Subject } from 'rxjs'

import { createStateFlow } from '@coriolis/coriolis'

import {
  initialReducedProjectionCreated,
  subscribedStateFlow,
  unsubscribedStateFlow,
  connectedStateFlow,
  disconnectedStateFlow,
  accessedStateFlowValue,
  requestedNextStateFlowValue,
} from '../events'

import { wrapReducedProjection } from './reducedProjection'

import { setValueGetter } from '../lib/object/valueGetter'
import { simpleUnsub } from '../lib/rx/simpleUnsub'

let stateFlowCount = 0
export const createTrackedStateFlowBuilder = () => {
  const trackingSubject = new Subject()
  return {
    tracking$: trackingSubject,
    createStateFlow: (initialReducedProjection, event$, skipUntil$) => {
      stateFlowCount += 1
      const stateFlowId = stateFlowCount
      const stateFlow = createStateFlow(
        wrapReducedProjection(
          initialReducedProjection,
          stateFlowId,
          trackingSubject,
        ),
        event$,
        skipUntil$,
      )

      trackingSubject.next(
        initialReducedProjectionCreated({
          stateFlowId,
          reducedProjection: initialReducedProjection,
        }),
      )

      const trackedStateFlow = stateFlow.external.pipe(
        (source) =>
          new Observable((observer) => {
            trackingSubject.next(subscribedStateFlow({ stateFlowId }))

            const subscription = source.subscribe(observer)
            return () => {
              trackingSubject.next(unsubscribedStateFlow({ stateFlowId }))

              return subscription.unsubscribe()
            }
          }),
      )

      trackedStateFlow.connect = () => {
        trackingSubject.next(connectedStateFlow({ stateFlowId }))
        const unsub = simpleUnsub(trackedStateFlow.subscribe())

        return () => {
          trackingSubject.next(disconnectedStateFlow({ stateFlowId }))
          return unsub()
        }
      }

      const getValue = stateFlow.internal.getValue

      const internalGetValueTracked = () => {
        trackingSubject.next(
          accessedStateFlowValue({ stateFlowId, internal: true }),
        )
        return getValue()
      }

      const externalGetValueTracked = () => {
        trackingSubject.next(
          accessedStateFlowValue({ stateFlowId, internal: false }),
        )
        return getValue()
      }

      const internalGetNextValueTracked = (event) => {
        trackingSubject.next(
          requestedNextStateFlowValue({ stateFlowId, event, internal: true }),
        )

        return stateFlow.internal.getNextValue(event)
      }

      setValueGetter(trackedStateFlow, externalGetValueTracked)
      trackedStateFlow.id = stateFlowId
      trackedStateFlow.name = stateFlow.name

      return {
        ...stateFlow,
        internal: {
          getValue: internalGetValueTracked,
          getNextValue: internalGetNextValueTracked,
        },
        external: trackedStateFlow,
        untracked: stateFlow,
        id: stateFlowId,
      }
    },
  }
}
