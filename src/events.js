import { createEventBuilder } from '@coriolis/coriolis'

export const viewAdded = createEventBuilder(
  'Coriolis devtools : new view added',
  ({ name, longname }) => ({ name, longname }),
)
export const viewChanged = createEventBuilder(
  'Coriolis devtools : current view changed',
  (viewname) => viewname,
)

export const devtoolsOpened = createEventBuilder(
  'Coriolis devtools : have been opened',
)
export const devtoolsClosed = createEventBuilder(
  'Coriolis devtools : have been closed',
)

export const panelWidthChanged = createEventBuilder(
  'Coriolis devtools : panel width changed',
  (width) => width,
)

export const eventListFilterChange = createEventBuilder(
  'Coriolis devtools : event list filter have been changed',
  (filter) => filter,
)

export const selectedEventListItem = createEventBuilder(
  'Coriolis devtools : item selected in event list',
  (eventListItem) => eventListItem,
)

export const timingTypeSelected = createEventBuilder(
  'Coriolis devtools : timing type for event display have been selected',
  (type) => type,
)

export const currentStoreChanged = createEventBuilder(
  'Coriolis devtools : current event store have been changed',
  (storeId) => storeId,
)

export const storeAdded = createEventBuilder(
  'Coriolis devtools : registered new event store',
  ({ storeId, storeName, snapshot$ }) => ({ storeId, storeName, snapshot$ }),
)

export const storeEnded = createEventBuilder(
  'Coriolis devtools : detected an event store was ended',
  ({ storeId }) => ({ storeId }),
)

export const storeError = createEventBuilder(
  'Coriolis devtools : detected an event store global error',
  ({ storeId, error }) => ({ storeId, error }),
)

export const effectAdded = createEventBuilder(
  'Coriolis devtools : An effect has been added to a store',
  (storeId, effect) => ({ storeId, effect }),
)

export const effectRemoved = createEventBuilder(
  `Coriolis devtools : An effect has been removed from it's store`,
  (storeId, effect) => ({ storeId, effect }),
)

export const storeEvent = createEventBuilder(
  'Coriolis devtools : detected an event',
  ({ storeId, event, isPastEvent }) => ({
    storeId,
    event,
    isPastEvent: !!isPastEvent,
  }),
)

export const commandExecuted = createEventBuilder(
  'Coriolis devtools : detected a command execution',
  ({ storeId, command }) => ({
    storeId,
    command,
  }),
)

export const commandCompleted = createEventBuilder(
  'Coriolis devtools : detected a command completed',
  ({ storeId, command }) => ({
    storeId,
    command,
  }),
)

export const stateFlowIndexed = createEventBuilder(
  'Coriolis devtools : StateFlow has been linked with a projection or equivalent',
  ({ storeId, stateFlowId, stateFlow, args }) => ({
    storeId,
    stateFlowId,
    stateFlow,
    args,
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
