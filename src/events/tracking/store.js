import { createEventBuilder } from '@coriolis/coriolis'

export const storeAdded = createEventBuilder(
  'Coriolis devtools : registered new event store',
  ({ storeId, storeName, snapshot$ }) => ({ storeId, storeName, snapshot$ }),
)

export const storeEvent = createEventBuilder(
  'Coriolis devtools : detected an event',
  ({ storeId, event, isPastEvent }) => ({
    storeId,
    event,
    isPastEvent: !!isPastEvent,
  }),
)

export const storeEnded = createEventBuilder(
  'Coriolis devtools : detected an event store was ended',
  ({ storeId } = {}) => ({ storeId }),
)

export const storeError = createEventBuilder(
  'Coriolis devtools : detected an event store global error',
  ({ storeId, error }) => ({ storeId, error }),
)
