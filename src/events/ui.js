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
