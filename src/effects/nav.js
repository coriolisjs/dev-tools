import { Observable } from 'rxjs'

import { defaultViewName } from '../projections/ui/defaultViewName'
import { currentViewName } from '../projections/ui/currentViewName'
import { replacementViewName } from '../projections/ui/replacementViewName'

import { viewChanged } from '../events/ui'

const UNDEFINED_VIEW_NAME = 'UndefinedView'

export const nav = ({ addSource, withProjection, dispatch }) => {
  const currentViewName$ = withProjection(currentViewName)
  const defaultViewName$ = withProjection(defaultViewName)

  currentViewName$.connect()

  const removeSource = addSource(
    new Observable((observer) => {
      if (!currentViewName$.value) {
        observer.next(
          viewChanged(defaultViewName$.value || UNDEFINED_VIEW_NAME),
        )
      }
      observer.complete()
    }),
  )

  // In case current view is not defined, change current view
  const replaceViewSubscription = withProjection(replacementViewName).subscribe(
    (viewName) => viewName && dispatch(viewChanged(viewName)),
  )

  return () => {
    removeSource()
    replaceViewSubscription.unsubscribe()
  }
}
