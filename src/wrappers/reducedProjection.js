import {
  accessedMemoizedReducedProjection,
  nextReducedProjectionCreated,
} from '../events'

let reducedProjectionCount = 0
export const wrapReducedProjection = (
  reducedProjection,
  stateFlowId,
  trackingSubject,
) => {
  reducedProjectionCount += 1

  const wrappedReducedProjection = {
    ...reducedProjection,
    id: reducedProjectionCount,
    getNextState: (event) => {
      const nextReducedProjection = reducedProjection.getNextState(event)

      if (nextReducedProjection === reducedProjection) {
        trackingSubject.next(
          accessedMemoizedReducedProjection({
            stateFlowId,
            reducedProjection,
            event,
          }),
        )
        return wrappedReducedProjection
      }

      trackingSubject.next(
        nextReducedProjectionCreated({
          parentReducedProjection: reducedProjection,
          event,
          reducedProjection: nextReducedProjection,
        }),
      )

      return wrapReducedProjection(
        nextReducedProjection,
        stateFlowId,
        trackingSubject,
      )
    },
  }

  return wrappedReducedProjection
}
