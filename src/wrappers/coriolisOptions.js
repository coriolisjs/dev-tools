import { merge } from 'rxjs'
import { withSimpleStoreSignature } from '@coriolis/coriolis'

import { createCoriolisDevToolsEffect } from '../effect'

import { wrapEffect } from './effect'
import { wrapErrorHandler } from './errorHandler'
import { createTrackedStateFlowFactoryBuilder } from './stateFlowFactory'

export const wrapCoriolisOptions = withSimpleStoreSignature(
  (options, ...effects) => {
    const wrappedEffects = effects.map(wrapEffect)

    const {
      tracking$: stateFlowTracking$,
      createStateFlowFactory: wrappedStateFlowFactoryBuilder,
    } = createTrackedStateFlowFactoryBuilder(options.stateFlowFactoryBuilder)

    const {
      tracking$: errorTracking$,
      errorHandler: wrappedErrorHandler,
    } = wrapErrorHandler(options.errorHandler)

    const devtoolsEffect = createCoriolisDevToolsEffect(
      options.storeName,
      merge(
        stateFlowTracking$,
        errorTracking$,
        ...wrappedEffects.map(({ tracking$ }) => tracking$),
      ),
    )

    return {
      ...options,
      effects: [devtoolsEffect, ...wrappedEffects.map(({ effect }) => effect)],
      stateFlowFactoryBuilder: wrappedStateFlowFactoryBuilder,
      errorHandler: wrappedErrorHandler,
    }
  },
)
