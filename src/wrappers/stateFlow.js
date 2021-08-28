import { identity, Subject } from 'rxjs'

import { createStateFlow } from '@coriolis/coriolis'

import { setValueGetter } from '../lib/object/valueGetter'
import { trackSubscriptions } from '../lib/rx/operator/trackSubscriptions'

import {
  subscribedStateFlow,
  unsubscribedStateFlow,
  connectedStateFlow,
  disconnectedStateFlow,
  accessedStateFlowValue,
  requestedNextStateFlowValue,
  stateFlowCreated,
} from '../events/tracking/stateFlow'

import { wrapReducedProjection } from './reducedProjection'

let count = 0
const getId = () => {
  count += 1
  return count
}

export const createTrackedStateFlowBuilder = () => {
  const trackingSubject = new Subject()

  return {
    tracking$: trackingSubject,
    createTrackedStateFlow: (initialReducedProjection, event$, skipUntil$) => {
      const stateFlowId = getId()

      const {
        tracking$: reducedProjectionTracking$,
        reducedProjection: trackedInitialReducedProjection,
      } = wrapReducedProjection(initialReducedProjection)

      reducedProjectionTracking$.subscribe(trackingSubject)

      const stateFlow = createStateFlow(
        trackedInitialReducedProjection,
        event$,
        skipUntil$,
      )

      trackingSubject.next(
        stateFlowCreated({ stateFlow, initialReducedProjection }),
      )

      const warnUnconnectedSubscriptions = stateFlow.stateless
        ? identity
        : trackSubscriptions(() => {
            if (stateFlow.isConnected()) {
              return
            }
            console.warn(
              `Subscribing on projection "${stateFlow.name}" while it is not connected`,
            )
          })

      const trackedStateFlow = stateFlow.external.pipe(
        trackSubscriptions(
          () => trackingSubject.next(subscribedStateFlow({ stateFlow })),
          () => trackingSubject.next(unsubscribedStateFlow({ stateFlow })),
        ),
        warnUnconnectedSubscriptions,
      )

      trackedStateFlow.connect = !stateFlow.stateless
        ? () => {
            trackingSubject.next(connectedStateFlow({ stateFlow }))

            // original connect method must be called because it does not only do a subscription
            const disconnect = stateFlow.external.connect()

            // TODO: maybe we should not do this subscription....
            // const unsub = simpleUnsub(trackedStateFlow.subscribe())

            return () => {
              trackingSubject.next(disconnectedStateFlow({ stateFlow }))
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
          accessedStateFlowValue({ stateFlow, internal: true }),
        )
        return getValue()
      }

      const externalGetValueTracked = () => {
        trackingSubject.next(
          accessedStateFlowValue({ stateFlow, internal: false }),
        )
        return getValue()
      }

      const internalGetNextValueTracked = (event) => {
        trackingSubject.next(
          requestedNextStateFlowValue({ stateFlow, event, internal: true }),
        )

        return stateFlow.internal.getNextValue(event)
      }

      setValueGetter(trackedStateFlow, externalGetValueTracked)

      // TODO: this is probably not necessary.... should be removed when checked it's not used
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
