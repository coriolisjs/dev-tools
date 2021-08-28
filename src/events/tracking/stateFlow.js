import { createEventBuilder } from '@coriolis/coriolis'

export const stateFlowCreated = createEventBuilder(
  'Coriolis devtools : StateFlow has been created',
  ({ storeId, stateFlow }) => ({
    storeId,
    stateFlow,
  }),
)

export const accessedMemoizedReducedProjection = createEventBuilder(
  'Coriolis devtools : ReducedProjection accessed with memoized event',
  ({ reducedProjection, event }) => ({ reducedProjection, event }),
)

export const initialReducedProjectionCreated = createEventBuilder(
  'Coriolis devtools : Initial reducedProjection created',
  ({ stateFlowId, reducedProjection }) => ({
    stateFlowId,
    reducedProjection,
  }),
)

export const nextReducedProjectionCreated = createEventBuilder(
  'Coriolis devtools : ReducedProjection created',
  ({ parentReducedProjection, event, reducedProjection }) => ({
    parentReducedProjection,
    event,
    reducedProjection,
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
