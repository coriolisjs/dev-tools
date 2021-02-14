import { Subject } from 'rxjs'

import { withSimpleStoreSignature } from '@coriolis/coriolis'

import { createCoriolisDevToolsEffect } from '../effect'

import { storeError } from '../events'

import { wrapEffect } from './effect'
import { createTrackedStateFlowFactory } from './stateFlowFactory'

import { lossless } from '../lib/rx/operator/lossless'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

export const wrapCoriolisOptions = withSimpleStoreSignature(
  (options, ...effects) => {
    const storeId = getStoreId()
    const trackingSubject = new Subject()

    const devtoolsEffect = createCoriolisDevToolsEffect(
      storeId,
      options.storeName,
      trackingSubject.pipe(lossless),
    )

    options.effects = [
      devtoolsEffect,
      ...effects.map(wrapEffect(trackingSubject)),
    ]

    options.stateFlowFactoryBuilder = createTrackedStateFlowFactory(
      trackingSubject,
    )

    const originalErrorHandler =
      options.errorHandler ||
      ((error) => {
        throw error
      })

    options.errorHandler = (error) => {
      trackingSubject.next(storeError({ error }))
      originalErrorHandler(error)
    }

    return options
  },
)
