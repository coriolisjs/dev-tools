import { Subject } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { asObservable } from '../lib/rx/asObservable'

import { commandCompleted, commandExecuted } from '../events'

export const wrapCommand = (command) => {
  const trackingSubject = new Subject()

  return {
    tracking$: trackingSubject,
    command: (commandAPI) => {
      trackingSubject.next(commandExecuted({ command }))

      return asObservable(command(commandAPI)).pipe(
        tap({
          complete: () => trackingSubject.next(commandCompleted({ command })),
        }),
        map((event) => {
          if (typeof event === 'function') {
            return wrapCommand(event)
          }

          const meta = event.meta || {}
          return {
            ...event,
            meta: {
              ...meta,
              fromCommand: [...(meta.fromCommand || []), command],
            },
          }
        }),
      )
    },
  }
}
