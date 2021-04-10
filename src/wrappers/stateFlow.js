import { identity, Subject } from 'rxjs'

import { createStateFlow } from '@coriolis/coriolis'

import { setValueGetter } from '../lib/object/valueGetter'
import { trackSubscriptions } from '../lib/rx/operator/trackSubscriptions'

import {
  initialReducedProjectionCreated,
  subscribedStateFlow,
  unsubscribedStateFlow,
  connectedStateFlow,
  disconnectedStateFlow,
  accessedStateFlowValue,
  requestedNextStateFlowValue,
} from '../events/tracking/stateFlow'

import { wrapReducedProjection } from './reducedProjection'

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

      const warnUnconnectedSubscriptions = stateFlow.stateless
        ? identity
        : trackSubscriptions(() => {
            if (stateFlow.isConnected()) {
              return
            }
            console.warn(
              `Subscribing on projection "${stateFlow.name}" while not connected`,
            )
          })

      const trackedStateFlow = stateFlow.external.pipe(
        trackSubscriptions(
          () => trackingSubject.next(subscribedStateFlow({ stateFlowId })),
          () => trackingSubject.next(unsubscribedStateFlow({ stateFlowId })),
        ),
        warnUnconnectedSubscriptions,
      )

      trackedStateFlow.connect = !stateFlow.stateless
        ? () => {
            trackingSubject.next(connectedStateFlow({ stateFlowId }))

            // original connect method must be called because it does not only do a subscription
            const disconnect = stateFlow.external.connect()

            // TODO: maybe we should not do this subscription....
            // const unsub = simpleUnsub(trackedStateFlow.subscribe())

            return () => {
              trackingSubject.next(disconnectedStateFlow({ stateFlowId }))
              return disconnect()
              // return unsub()
            }
          }
        : () => {
            console.warn(
              `Connecting a stateless projection (${
                stateFlow.name || 'unnamed'
              }) is useless.\nMaybe you intended to connect a statefull projection this one depends on ?`,
            )
            return () => {}
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
