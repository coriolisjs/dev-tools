import { noop, Observable } from 'rxjs'

export const trackSubscriptions =
  (subscribeListener, unsubscribeListener = noop) =>
  (source) =>
    new Observable((observer) => {
      subscribeListener()

      const subscription = source.subscribe(observer)

      return () => {
        unsubscribeListener()

        return subscription.unsubscribe()
      }
    })
