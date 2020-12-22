import { Observable, Subject } from 'rxjs'
import { map, tap } from 'rxjs/operators'

import {
  // createAggregator,
  createStateFlow,
  createStateFlowFactory,
  withSimpleStoreSignature,
} from '@coriolis/coriolis'

import { createCoriolisDevToolsEffect } from './effect'

import {
  stateFlowIndexed,
  accessedMemoizedReducerState,
  reducerStateCreated,
  subscribedStateFlow,
  unsubscribedStateFlow,
  connectedStateFlow,
  disconnectedStateFlow,
  accessedStateFlowValue,
  gotNextStateFlowValue,
  commandExecuted,
  storeError,
  commandCompleted,
} from './events'
import { lossless } from './lib/rx/operator/lossless'
import { setValueGetter } from './lib/object/valueGetter'
import { asObservable } from './lib/rx/asObservable'
import { simpleUnsub } from './lib/rx/simpleUnsub'

let lastStoreId = 0
const getStoreId = () => ++lastStoreId

//
// event names to change and to trigger
//
//   projectionSetup -> projectionCompiled  -- off
//   aggregatorCreated -> stateFlowCreated
//   projectionCalled -> reducerStateCreated
//   aggregatorCalled -> reducerStateReused -- off

/*
Quel sont les informations que l'on veut voir
- creation d'un stateFlow:
  quel nom
  quel type de création (projection, reducer, snapshot)
  quelle valeur initiale

- creation d'un nouveau reducerState
  stateFlow associé
  valeur
  reducer
  event

- acces a la valeur d'un reducerState
  - type d'acces (interne en source de projection, externe via getter du stateFlow)


  quelle valeur actuelle
  nombre d'états générés (tout compris, même passés)
  nombre d'états émis
  nombre de souscriptions totales
  nombre de désabonnements
  nombre de souscriptions actives

- Pour une projection
  combien de compilation
  state initial


*/
// let lastprojectionId = 0
// const getprojectionId = () => ++lastprojectionId

// const getProjectionName = (projection) => {
//   try {
//     let foundName
//     projection({
//       useState: () => {},
//       useEvent: () => {},
//       useProjection: () => {},
//       useValue: () => {},
//       setName: (name) => {
//         foundName = name
//       },
//     })

//     return foundName || projection.name
//   } catch (error) {
//     return projection.name
//   }
// }

// const createTrackingAggregatorFactory = (storeId, trackingSubject) => (
//   projection,
//   getAggregator,
// ) => {
//   const projectionId = getprojectionId()
//   const projectionName = getProjectionName(projection)

//   if (projectionName !== projection.name) {
//     Object.defineProperty(projection, 'name', {
//       value: projectionName,
//       writable: false,
//     })
//   }

//   const projectionBehaviorWrapper = (projectionBehavior) => (...args) => {
//     const newState = projectionBehavior(...args)
//     if (aggregator) {
//       // During aggregator creation, this projectionBehaviour wrapper can be called to get initial state
//       // this initial call is not triggered by an event, so we don't track it as an projectionCalled event
//       //
//       // TODO: maybe we could track this with an event like "projectionInitialStateCall"
//       trackingSubject.next(
//         projectionCalled({ storeId, projectionId, args, newState }),
//       )
//     }

//     return newState
//   }

//   const wrappedProjection = (...args) => {
//     if (
//       args.length === 1 &&
//       (args[0].useProjection ||
//         args[0].useEvent ||
//         args[0].useState ||
//         args[0].useValue)
//     ) {
//       let projectionBehavior
//       let shouldThrow = false

//       try {
//         projectionBehavior = projection(...args)
//       } catch (error) {
//         shouldThrow = true
//         projectionBehavior = error
//       }

//       trackingSubject.next(
//         projectionSetup({ storeId, projectionId, projectionBehavior }),
//       )

//       // result is not expected type.... maybe this was not a complex projection but a reducer... return what we got
//       if (typeof projectionBehavior !== 'function') {
//         if (shouldThrow) {
//           throw projectionBehavior
//         }

//         return projectionBehavior
//       }

//       return projectionBehaviorWrapper(projectionBehavior)
//     }

//     const newState = projection(...args)
//     if (aggregator) {
//       // During aggregator creation, this projection wrapper can be called to get initial state
//       // this initial call is not triggered by an event, so we don't track it as an projectionCalled event
//       //
//       // TODO: maybe we could track this with an event like "projectionInitialStateCall"
//       trackingSubject.next(
//         projectionCalled({ storeId, projectionId, args, newState }),
//       )
//     }

//     return newState
//   }

//   Object.defineProperty(wrappedProjection, 'name', {
//     value: projectionName,
//     writable: false,
//   })

//   Object.defineProperty(wrappedProjection, 'length', {
//     value: projection.length,
//     writable: false,
//   })

//   const aggregator = createAggregator(wrappedProjection, getAggregator)

//   trackingSubject.next(
//     aggregatorCreated({ storeId, projectionId, projection, aggregator }),
//   )

//   const wrappedAggregator = (event) => {
//     trackingSubject.next(aggregatorCalled({ storeId, projectionId, event }))
//     return aggregator(event)
//   }

//   return withValueGetter(wrappedAggregator, aggregator.getValue)
// }

const wrapReducerState = (reducerState, stateFlowId, trackingSubject) => {
  const wrappedReducerState = {
    name: reducerState.name,
    getNextState: (event) => {
      const nextReducerState = reducerState.getNextState(event)

      if (nextReducerState === reducerState) {
        trackingSubject.next(
          accessedMemoizedReducerState({
            stateFlowId,
            reducerState,
            event,
          }),
        )
        // console.log(
        //   'memoized reducer state',
        //   reducerState.name,
        //   reducerState.value,
        // )
        return wrappedReducerState
      }

      trackingSubject.next(
        reducerStateCreated({
          stateFlowId,
          reducerState: nextReducerState,
          parentReducerState: reducerState,
          event,
        }),
      )
      // console.log(
      //   'new reducer state',
      //   nextReducerState.name,
      //   nextReducerState.value,
      //   event,
      // )

      return wrapReducerState(nextReducerState, stateFlowId, trackingSubject)
    },
    value: reducerState.value,
  }

  return wrappedReducerState
}

let stateFlowCount = 0
const createTrackedStateFlow = (storeId, trackingSubject) => (
  initialReducerState,
  event$,
  skipUntil$,
) => {
  stateFlowCount += 1
  const stateFlowId = stateFlowCount
  const stateFlow = createStateFlow(
    wrapReducerState(initialReducerState, storeId, trackingSubject),
    event$,
    skipUntil$,
  )

  trackingSubject.next(
    reducerStateCreated({
      stateFlowId,
      reducerState: initialReducerState,
    }),
  )

  // console.log(
  //   'new initial reducer state',
  //   initialReducerState.name,
  //   initialReducerState.value,
  //   stateFlow,
  // )

  // stateFlowCreated
  // console.log('new stateFlow', stateFlow)
  const trackedStateFlow = stateFlow.external.pipe(
    (source) =>
      new Observable((observer) => {
        trackingSubject.next(subscribedStateFlow({ stateFlowId }))
        // console.log('new stateFlow subscription', stateFlow.name)

        const subscription = source.subscribe(observer)
        return () => {
          trackingSubject.next(unsubscribedStateFlow({ stateFlowId }))

          // console.log('stateFlow unsubscription', stateFlow.name)
          return subscription.unsubscribe()
        }
      }),
  )

  trackedStateFlow.connect = () => {
    trackingSubject.next(connectedStateFlow({ stateFlowId }))
    // console.log('connected stateflow', stateFlow.name)
    const unsub = simpleUnsub(trackedStateFlow.subscribe())

    return () => {
      trackingSubject.next(disconnectedStateFlow({ stateFlowId }))
      // console.log('disconnected from stateFlow', stateFlow.name)
      return unsub()
    }
  }

  const getValue = stateFlow.internal.getValue

  const internalGetValueTracked = () => {
    trackingSubject.next(
      accessedStateFlowValue({ stateFlowId, internal: true }),
    )
    // console.log('access stateFlow value from internal', stateFlow.name)
    return getValue()
  }

  const externalGetValueTracked = () => {
    trackingSubject.next(
      accessedStateFlowValue({ stateFlowId, internal: false }),
    )
    // console.log('access stateFlow value from external', stateFlow.name)
    return getValue()
  }

  const internalGetNextValueTracked = (event) => {
    trackingSubject.next(
      gotNextStateFlowValue({ stateFlowId, event, internal: true }),
    )
    // console.log('get stateFlow next value from internal', stateFlow.name, event)

    return stateFlow.internal.getNextValue(event)
  }

  setValueGetter(trackedStateFlow, externalGetValueTracked)
  trackedStateFlow.id = stateFlowId
  trackedStateFlow.name = stateFlow.name

  return {
    ...stateFlow,
    internal: {
      getValue: internalGetValueTracked,
      getNextValue: internalGetNextValueTracked,
    },
    external: trackedStateFlow,
    untracked: stateFlow,
    id: stateFlowId,
  }
}

const createTrackedStateFlowFactory = (
  event$,
  skipUntil,
  storeId,
  trackingSubject,
) => {
  const stateFlowFactory = createStateFlowFactory(
    event$,
    skipUntil,
    createTrackedStateFlow(storeId, trackingSubject),
  )

  return (...args) => {
    // TODO : here we could wrap projection to track.... something
    const stateFlow = stateFlowFactory(...args)
    console.log('stateFlow created', stateFlow)
    trackingSubject.next(
      stateFlowIndexed({
        storeId,
        stateFlowId: stateFlow.id,
        stateFlow: stateFlow,
        args,
      }),
    )
    // console.log('link projection and stateFlow', stateFlow, args)

    return stateFlow
  }
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
    const trackingSubject = new Subject()

    const devtoolsEffect = createCoriolisDevToolsEffect(
      storeId,
      options.storeName,
      trackingSubject.pipe(lossless),
    )

    options.effects = [
      devtoolsEffect,
      ...effects.map(wrapEffect(storeId, trackingSubject)),
    ]

    // options.aggregatorFactory = createAggregatorFactory(
    //   createTrackingAggregatorFactory(storeId, trackingSubject),
    // )
    options.stateFlowFactoryBuilder = (event$, skipUntil) =>
      createTrackedStateFlowFactory(event$, skipUntil, storeId, trackingSubject)

    const originalErrorHandler =
      options.errorHandler ||
      ((error) => {
        throw error
      })

    options.errorHandler = (error) => {
      trackingSubject.next(storeError({ storeId, error }))
      originalErrorHandler(error)
    }

    return options
  },
)
