import { merge } from 'rxjs'
import { map } from 'rxjs/operators'

import { createDevtoolsEffect } from '../effects/devtoolsEffect'
import { wrapEffect } from '../wrappers/effect'
import { wrapErrorHandler } from '../wrappers/errorHandler'
import { createTrackedStateFlowFactoryBuilder } from '../wrappers/stateFlowFactory'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

export const createStoreTrackingEffect = (options) => {
  const storeId = getStoreId()

  const { tracking$: storeTracking$, devtoolsEffect } = createDevtoolsEffect(
    options.storeName,
  )

  const wrappedEffects = options.effects.map(wrapEffect)

  const {
    tracking$: stateFlowTracking$,
    createStateFlowFactory: wrappedStateFlowFactoryBuilder,
  } = createTrackedStateFlowFactoryBuilder(options.stateFlowFactoryBuilder)

  const { tracking$: errorTracking$, errorHandler: wrappedErrorHandler } =
    wrapErrorHandler(options.errorHandler)

  const storeTrackingEffect = ({ dispatch }) => {
    dispatch(() =>
      merge(
        storeTracking$,
        stateFlowTracking$,
        errorTracking$,
        ...wrappedEffects.map(({ tracking$ }) => tracking$),
      ).pipe(
        map((event) => ({
          ...event,
          payload: { ...event.payload, storeId },
        })),
      ),
    )
  }

  return {
    storeTrackingEffect,
    storeOptions: {
      ...options,
      effects: [devtoolsEffect, ...wrappedEffects.map(({ effect }) => effect)],
      stateFlowFactoryBuilder: wrappedStateFlowFactoryBuilder,
      errorHandler: wrappedErrorHandler,
    },
  }
}