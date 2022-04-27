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

let count = 0
const getId = () => {
  count += 1
  return count
}

export const createTrackedStateFlowBuilder = () => {
  const trackingSubject = new Subject()

  return {
    tracking$: trackingSubject,
    createTrackedStateFlow:
      (event$, skipUntil$, getStateFlow, getStateFlowList) =>
      (...args) => {
        const stateFlowId = getId()

        const stateFlow = createStateFlow(
          event$,
          skipUntil$,
          getStateFlow,
          getStateFlowList,
        )(...args)

        const projection = args[0] === 'reducer' ? args.slice(1) : args[0]

        trackingSubject.next(stateFlowCreated({ stateFlow, projection }))

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

        const trackedStateFlow = stateFlow.state$.pipe(
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
              const disconnect = stateFlow.state$.connect()

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

        const getValue = stateFlow.getValue

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

          return stateFlow.getNextValue(event)
        }

        setValueGetter(trackedStateFlow, externalGetValueTracked)

        // TODO: this is probably not necessary.... should be removed when checked it's not used
        trackedStateFlow.id = stateFlowId
        trackedStateFlow.name = stateFlow.name

        return {
          ...stateFlow,
          getValue: internalGetValueTracked,
          getNextValue: internalGetNextValueTracked,
          state$: trackedStateFlow,
          untracked: stateFlow,
          id: stateFlowId,
        }
      },
  }
}
