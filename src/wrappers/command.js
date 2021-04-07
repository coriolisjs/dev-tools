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
            const { tracking$, command: subCommand } = wrapCommand(event)

            // Here a simple subscription do the job BECAUSE the trackingSubject never completes.
            // If any change makes this subject complete, there would be a problem here when
            // a subcommand emits any tracking event after parent command's tracking subject completed.
            // This could happen because a parent command can complete before its child commands
            tracking$.subscribe(trackingSubject)
            return subCommand
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
