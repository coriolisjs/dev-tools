import { createEventBuilder } from '@coriolis/coriolis'

export const stateFlowCreated = createEventBuilder(
  '[Tracking] stateFlow has been created',
  ({ storeId, stateFlow, projection }) => ({
    storeId,
    stateFlow,
    projection,
  }),
)

export const subscribedStateFlow = createEventBuilder(
  '[Tracking] stateFlow subscription registered',
  ({ stateFlow }) => ({ stateFlow }),
)

export const unsubscribedStateFlow = createEventBuilder(
  '[Tracking] stateFlow subscription removed',
  ({ stateFlow }) => ({ stateFlow }),
)

export const connectedStateFlow = createEventBuilder(
  '[Tracking] stateFlow connected',
  ({ stateFlow }) => ({ stateFlow }),
)

export const disconnectedStateFlow = createEventBuilder(
  '[Tracking] stateFlow disconnected',
  ({ stateFlow }) => ({ stateFlow }),
)

export const accessedStateFlowValue = createEventBuilder(
  '[Tracking] stateFlow value accessed',
  ({ stateFlow, internal }) => ({ stateFlow, internal }),
)

export const requestedNextStateFlowValue = createEventBuilder(
  '[Tracking] stateFlow next value created',
  ({ stateFlow, event, internal }) => ({ stateFlow, event, internal }),
)

export const getStateFlowCalled = createEventBuilder(
  '[Tracking] stateFlow has been accessed',
  ({ storeId, projection, stateFlow }) => ({
    storeId,
    projection,
    stateFlow,
  }),
)
