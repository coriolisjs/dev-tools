import { createEventBuilder } from '@coriolis/coriolis'

export const stateFlowCreated = createEventBuilder(
  'Coriolis devtools : StateFlow has been created',
  ({ storeId, stateFlow }) => ({
    storeId,
    stateFlow,
  }),
)

export const accessedMemoizedReducedState = createEventBuilder(
  'Coriolis devtools : ReducedState accessed with memoized event',
  ({ reducedState, event }) => ({ reducedState, event }),
)

export const initialReducedStateCreated = createEventBuilder(
  'Coriolis devtools : Initial reducedState created',
  ({ stateFlowId, reducedState }) => ({
    stateFlowId,
    reducedState,
  }),
)

export const nextReducedStateCreated = createEventBuilder(
  'Coriolis devtools : ReducedState created',
  ({ parentReducedState, event, reducedState }) => ({
    parentReducedState,
    event,
    reducedState,
  }),
)

export const subscribedStateFlow = createEventBuilder(
  'Coriolis devtools : Subscription to stateFlow registered',
  ({ stateFlow }) => ({ stateFlow }),
)

export const unsubscribedStateFlow = createEventBuilder(
  'Coriolis devtools : Subscription to stateFlow removed',
  ({ stateFlow }) => ({ stateFlow }),
)

export const connectedStateFlow = createEventBuilder(
  'Coriolis devtools : StateFlow connected',
  ({ stateFlow }) => ({ stateFlow }),
)

export const disconnectedStateFlow = createEventBuilder(
  'Coriolis devtools : StateFlow disconnected',
  ({ stateFlow }) => ({ stateFlow }),
)

export const accessedStateFlowValue = createEventBuilder(
  'Coriolis devtools : StateFlow value accessed',
  ({ stateFlow, internal }) => ({ stateFlow, internal }),
)

export const requestedNextStateFlowValue = createEventBuilder(
  'Coriolis devtools : StateFlow next value created',
  ({ stateFlow, event, internal }) => ({ stateFlow, event, internal }),
)
