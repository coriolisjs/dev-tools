import { createEventBuilder } from '@coriolis/coriolis'

export const storeAdded = createEventBuilder(
  '[Tracking] store registered',
  ({ storeId, storeName, snapshot$ }) => ({ storeId, storeName, snapshot$ }),
)

export const storeEvent = createEventBuilder(
  '[Tracking] event detected',
  ({ storeId, event, isPastEvent }) => ({
    storeId,
    event,
    isPastEvent: !!isPastEvent,
  }),
)

export const storeEnded = createEventBuilder(
  '[Tracking] store ended',
  ({ storeId } = {}) => ({ storeId }),
)

export const storeError = createEventBuilder(
  '[Tracking] store global error',
  ({ storeId, error }) => ({ storeId, error }),
)
