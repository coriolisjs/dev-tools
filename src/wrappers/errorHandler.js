import { Subject } from 'rxjs'

import { storeError } from '../events'

const defaultErrorHandler = (error) => {
  throw error
}

export const wrapErrorHandler = (
  originalErrorHandler = defaultErrorHandler,
) => {
  const trackingSubject = new Subject()

  return {
    tracking$: trackingSubject,
    errorHandler: (error) => {
      trackingSubject.next(storeError({ error }))
      originalErrorHandler(error)
    },
  }
}
