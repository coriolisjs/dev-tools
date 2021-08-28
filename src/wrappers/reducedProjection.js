import { Subject } from 'rxjs'
import {
  accessedMemoizedReducedProjection,
  nextReducedProjectionCreated,
} from '../events/tracking/stateFlow'

let count = 0
const getId = () => {
  count += 1
  return count
}

export const wrapReducedProjection = (reducedProjection) => {
  const trackingSubject = new Subject()

  const trackedReducedProjection = {
    ...reducedProjection,
    id: getId(),
    getNextState: (event) => {
      const nextReducedProjection = reducedProjection.getNextState(event)

      if (nextReducedProjection === reducedProjection) {
        trackingSubject.next(
          accessedMemoizedReducedProjection({
            reducedProjection,
            event,
          }),
        )
        return trackedReducedProjection
      }

      trackingSubject.next(
        nextReducedProjectionCreated({
          parentReducedProjection: reducedProjection,
          event,
          reducedProjection: nextReducedProjection,
        }),
      )

      const {
        tracking$: nextReducedProjectionTracking$,
        reducedProjection: trackedNextReducedProjection,
      } = wrapReducedProjection(nextReducedProjection)

      nextReducedProjectionTracking$.subscribe(trackingSubject)
      return trackedNextReducedProjection
    },
  }

  return {
    tracking$: trackingSubject,
    reducedProjection: trackedReducedProjection,
  }
}
