import { createEventBuilder } from '@coriolis/coriolis'

export const viewAdded = createEventBuilder(
  'Coriolis devtools new view added',
  ({ name, longname }) => ({ name, longname }),
)
export const viewChanged = createEventBuilder(
  'Coriolis devtools current view changed',
  (viewname) => viewname,
)

export const devtoolsOpened = createEventBuilder(
  'Coriolis devtools have been opened',
)
export const devtoolsClosed = createEventBuilder(
  'Coriolis devtools have been closed',
)

export const eventListFilterChange = createEventBuilder(
  'Coriolis devtools event list filter have been changed',
  (filter) => filter,
)

export const selectedEventListItem = createEventBuilder(
  'Coriolis devtools item selected in event list',
  (eventListItem) => eventListItem,
)

export const timingTypeSelected = createEventBuilder(
  'Coriolis devtools timing type for event display have been selected',
  (type) => type,
)

export const aggregatorCreated = createEventBuilder(
  'Coriolis devtools detected an aggregator creation',
  ({ storeId, projectionId, projection, aggregator }) => ({
    storeId,
    projectionId,
    projection,
    aggregator,
  }),
)
export const projectionSetup = createEventBuilder(
  'Coriolis devtools detected an projection have been setup',
  ({ storeId, projectionId, projectionBehavior }) => ({
    storeId,
    projectionId,
    projectionBehavior,
  }),
)
export const projectionCalled = createEventBuilder(
  'Coriolis devtools detected an projection have been called',
  ({ storeId, projectionId, args, newState }) => ({
    storeId,
    projectionId,
    args,
    newState,
  }),
)
export const aggregatorCalled = createEventBuilder(
  'Coriolis devtools detected an aggregator have been called',
  ({ storeId, projectionId, event }) => ({ storeId, projectionId, event }),
)

export const storeAdded = createEventBuilder(
  'Coriolis devtools registered new event store',
  ({ storeId, storeName, snapshot$ }) => ({ storeId, storeName, snapshot$ }),
)

export const storeEnded = createEventBuilder(
  'Coriolis devtools detected an event store was ended',
  ({ storeId }) => ({ storeId }),
)

export const storeError = createEventBuilder(
  'Coriolis devtools detected an event store global error',
  ({ storeId, error }) => ({ storeId, error }),
)

export const currentStoreChanged = createEventBuilder(
  'Coriolis devtools current event store have been changed',
  (storeId) => storeId,
)
export const storeEvent = createEventBuilder(
  'Coriolis devtools detected an event',
  ({ storeId, event, isPastEvent }) => ({
    storeId,
    event,
    isPastEvent: !!isPastEvent,
  }),
)

export const commandExecuted = createEventBuilder(
  'Coriolis devtools detected a command execution',
  ({ storeId, command }) => ({
    storeId,
    command,
  }),
)

export const commandCompleted = createEventBuilder(
  'Coriolis devtools detected a command completed',
  ({ storeId, command }) => ({
    storeId,
    command,
  }),
)

export const panelWidthChanged = createEventBuilder(
  'Coriolis devtools panel width changed',
  (width) => width,
)
