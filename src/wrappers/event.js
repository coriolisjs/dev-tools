import { Subject } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import { asObservable } from '../lib/rx/asObservable'

import { commandCompleted, commandExecuted } from '../events/tracking/command'

export const createEventWrapper = (fromEffect) => {
  const trackingSubject = new Subject()

  const wrapEvent = (fromCommand) => (eventOrCommand) => {
    if (typeof eventOrCommand === 'function') {
      return wrapCommand(eventOrCommand)
    }

    const meta = eventOrCommand.meta || {}
    return {
      ...eventOrCommand,
      meta: {
        ...meta,
        ...(fromCommand && {
          fromCommand: [...(meta.fromCommand || []), fromCommand],
        }),
        fromEffect,
      },
    }
  }

  const wrapCommand = (command) => (commandAPI) => {
    trackingSubject.next(commandExecuted({ command, fromEffect }))

    return asObservable(command(commandAPI)).pipe(
      tap({
        complete: () => trackingSubject.next(commandCompleted({ command })),
      }),
      map(wrapEvent(command)),
    )
  }

  return {
    tracking$: trackingSubject,
    wrapEvent: wrapEvent(),
  }
}
