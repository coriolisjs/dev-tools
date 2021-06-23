import { merge } from 'rxjs'
import { map } from 'rxjs/operators'

import { withSimpleStoreSignature } from '@coriolis/coriolis'

import { getDevtoolsTrackingObserver } from '../devtoolsStore'
import { createDevtoolsEffect } from '../effects/devtoolsEffect'
import { wrapEffect } from './effect'
import { wrapErrorHandler } from './errorHandler'
import { createTrackedStateFlowFactoryBuilder } from './stateFlowFactory'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

export const wrapCoriolisOptions = withSimpleStoreSignature(
  (options, ...effects) => {
    const storeId = getStoreId()

    // Here trackingObserver could send events via http, websocket or any other solution
    const trackingObserver = getDevtoolsTrackingObserver()

    const { tracking$: storeTracking$, devtoolsEffect } = createDevtoolsEffect(
      options.storeName,
    )

    const wrappedEffects = effects.map(wrapEffect)

    const {
      tracking$: stateFlowTracking$,
      createStateFlowFactory: wrappedStateFlowFactoryBuilder,
    } = createTrackedStateFlowFactoryBuilder(options.stateFlowFactoryBuilder)

    const {
      tracking$: errorTracking$,
      errorHandler: wrappedErrorHandler,
    } = wrapErrorHandler(options.errorHandler)

    merge(
      storeTracking$,
      stateFlowTracking$,
      errorTracking$,
      ...wrappedEffects.map(({ tracking$ }) => tracking$),
    )
      .pipe(
        map((event) => ({
          ...event,
          payload: { ...event.payload, storeId },
        })),
      )
      .subscribe(trackingObserver)

    return {
      ...options,
      effects: [devtoolsEffect, ...wrappedEffects.map(({ effect }) => effect)],
      stateFlowFactoryBuilder: wrappedStateFlowFactoryBuilder,
      errorHandler: wrappedErrorHandler,
    }
  },
)
