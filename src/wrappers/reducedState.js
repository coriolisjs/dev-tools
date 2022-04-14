import { Subject } from 'rxjs'
import {
  accessedMemoizedReducedState,
  nextReducedStateCreated,
} from '../events/tracking/stateFlow'

let count = 0
const getId = () => {
  count += 1
  return count
}

export const wrapReducedState = (reducedState) => {
  const trackingSubject = new Subject()

  const trackedReducedState = {
    ...reducedState,
    id: getId(),
    getNextState: (event) => {
      const nextReducedState = reducedState.getNextState(event)

      if (nextReducedState === reducedState) {
        trackingSubject.next(
          accessedMemoizedReducedState({
            reducedState,
            event,
          }),
        )
        return trackedReducedState
      }

      trackingSubject.next(
        nextReducedStateCreated({
          parentReducedState: reducedState,
          event,
          reducedState: nextReducedState,
        }),
      )

      const {
        tracking$: nextReducedStateTracking$,
        reducedState: trackedNextReducedState,
      } = wrapReducedState(nextReducedState)

      nextReducedStateTracking$.subscribe(trackingSubject)
      return trackedNextReducedState
    },
  }

  return {
    tracking$: trackingSubject,
    reducedState: trackedReducedState,
  }
}
