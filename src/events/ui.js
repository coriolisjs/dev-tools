import { createEventBuilder } from '@coriolis/coriolis'

export const viewAdded = createEventBuilder(
  '[UI] new view added',
  ({ name, longname }) => ({ name, longname }),
)
export const viewChanged = createEventBuilder(
  '[UI] current view changed',
  (viewname) => viewname,
)

export const devtoolsOpened = createEventBuilder(
  '[UI] devtools have been opened',
)
export const devtoolsClosed = createEventBuilder(
  '[UI] devtools have been closed',
)

export const panelWidthChanged = createEventBuilder(
  '[UI] panel width changed',
  (width) => width,
)

export const eventListFilterChange = createEventBuilder(
  '[UI] event list filter have been changed',
  (filter) => filter,
)

export const selectedEventListItem = createEventBuilder(
  '[UI] event list item selected',
  (eventListItem) => eventListItem,
)

export const timingTypeSelected = createEventBuilder(
  '[UI] event list timing type have been selected',
  (type) => type,
)

export const currentStoreChanged = createEventBuilder(
  '[UI] current event store have been changed',
  (storeId) => storeId,
)
