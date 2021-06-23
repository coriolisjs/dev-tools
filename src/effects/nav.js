import { Observable } from 'rxjs'

import { defaultViewName } from '../projections/defaultViewName'
import { currentViewName } from '../projections/currentViewName'
import { replacementViewName } from '../projections/replacementViewName'

import { viewChanged } from '../events/ui'

const UNDEFINED_VIEW_NAME = 'UndefinedView'

export const nav = ({ addSource, withProjection, dispatch }) => {
  const currentViewName$ = withProjection(currentViewName)
  const defaultViewName$ = withProjection(defaultViewName)

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
