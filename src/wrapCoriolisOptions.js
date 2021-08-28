import { Subject } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import {
  createAggregator,
  createAggregatorFactory,
  withSimpleStoreSignature,
} from '@coriolis/coriolis'

import { createCoriolisDevToolsEffect } from './effect'

import {
  aggregatorCreated,
  projectionSetup,
  projectionCalled,
  aggregatorCalled,
  commandExecuted,
  storeError,
  commandCompleted,
} from './events'
import { lossless } from './lib/rx/operator/lossless'
import { withValueGetter } from './lib/object/valueGetter'
import { asObservable } from './lib/rx/asObservable'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

let lastprojectionId = 0
const getprojectionId = () => ++lastprojectionId

const getProjectionName = (projection) => {
  try {
    let foundName
    projection({
      useState: () => {},
      useEvent: () => {},
      useProjection: () => {},
      useValue: () => {},
      setName: (name) => {
        foundName = name
      },
    })

    return foundName || projection.name
  } catch (error) {
    return projection.name
  }
}

const createTrackingAggregatorFactory = (storeId, trackingSubject) => (
  projection,
  getAggregator,
) => {
  const projectionId = getprojectionId()
  const projectionName = getProjectionName(projection)

  if (projectionName !== projection.name) {
    Object.defineProperty(projection, 'name', {
      value: projectionName,
      writable: false,
    })
  }

  const projectionBehaviorWrapper = (projectionBehavior) => (...args) => {
    const newState = projectionBehavior(...args)
    if (aggregator) {
      // During aggregator creation, this projectionBehaviour wrapper can be called to get initial state
      // this initial call is not triggered by an event, so we don't track it as an projectionCalled event
      //
      // TODO: maybe we could track this with an event like "projectionInitialStateCall"
      trackingSubject.next(
        projectionCalled({ storeId, projectionId, args, newState }),
      )
    }

    return newState
  }

  const wrappedProjection = (...args) => {
    if (
      args.length === 1 &&
      (args[0].useProjection ||
        args[0].useEvent ||
        args[0].useState ||
        args[0].useValue)
    ) {
      let projectionBehavior
      let shouldThrow = false

      try {
        projectionBehavior = projection(...args)
      } catch (error) {
        shouldThrow = true
        projectionBehavior = error
      }

      trackingSubject.next(
        projectionSetup({ storeId, projectionId, projectionBehavior }),
      )

      // result is not expected type.... maybe this was not a complex projection but a reducer... return what we got
      if (typeof projectionBehavior !== 'function') {
        if (shouldThrow) {
          throw projectionBehavior
        }

        return projectionBehavior
      }

      return projectionBehaviorWrapper(projectionBehavior)
    }

    const newState = projection(...args)
    if (aggregator) {
      // During aggregator creation, this projection wrapper can be called to get initial state
      // this initial call is not triggered by an event, so we don't track it as an projectionCalled event
      //
      // TODO: maybe we could track this with an event like "projectionInitialStateCall"
      trackingSubject.next(
        projectionCalled({ storeId, projectionId, args, newState }),
      )
    }

    return newState
  }

  Object.defineProperty(wrappedProjection, 'name', {
    value: projectionName,
    writable: false,
  })

  Object.defineProperty(wrappedProjection, 'length', {
    value: projection.length,
    writable: false,
  })

  const aggregator = createAggregator(wrappedProjection, getAggregator)

  trackingSubject.next(
    aggregatorCreated({ storeId, projectionId, projection, aggregator }),
  )

  const wrappedAggregator = (event) => {
    trackingSubject.next(aggregatorCalled({ storeId, projectionId, event }))
    return aggregator(event)
  }

  return withValueGetter(wrappedAggregator, aggregator.getValue)
}

const wrapCommand = (storeId, trackingSubject, command) => (commandAPI) => {
  trackingSubject.next(commandExecuted({ storeId, command }))

  return asObservable(command(commandAPI)).pipe(
    tap({
      complete: () =>
        trackingSubject.next(commandCompleted({ storeId, command })),
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
}

const wrapEffectAPI = (storeId, trackingSubject, effectAPI) => {
  const doWrapEffect = wrapEffect(storeId, trackingSubject)

  return {
    ...effectAPI,
    addEffect: (effect) => effectAPI.addEffect(doWrapEffect(effect)),
    dispatch: (event) => {
      if (typeof event === 'function') {
        return effectAPI.dispatch(wrapCommand(storeId, trackingSubject, event))
      }
      return effectAPI.dispatch(event)
    },
  }
}

const wrapEffect = (storeId, trackingSubject) => (effect) => {
  return (effectAPI) => {
    return effect(wrapEffectAPI(storeId, trackingSubject, effectAPI))
  }
}

export const wrapCoriolisOptions = withSimpleStoreSignature(
  (options, ...effects) => {
    const storeId = getStoreId()
    const aggregatorEvents = new Subject()

    const devtoolsEffect = createCoriolisDevToolsEffect(
      storeId,
      options.storeName,
      aggregatorEvents.pipe(lossless),
    )

    options.effects = [
      devtoolsEffect,
      ...effects.map(wrapEffect(storeId, aggregatorEvents)),
    ]

    options.aggregatorFactory = createAggregatorFactory(
      createTrackingAggregatorFactory(storeId, aggregatorEvents),
    )

    const originalErrorHandler =
      options.errorHandler ||
      ((error) => {
        throw error
      })

    options.errorHandler = (error) => {
      aggregatorEvents.next(storeError({ storeId, error }))
      originalErrorHandler(error)
    }

    return options
  },
)
