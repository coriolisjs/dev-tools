import { currentStoreChanged } from '../events/ui'
import { storeAdded } from '../events/tracking/store'

export const currentStoreId = ({ useState, useEvent }) => (
  useState(),
  useEvent(currentStoreChanged, storeAdded),
  (lastStoreId, { type, payload }) =>
    type === currentStoreChanged.toString()
      ? payload
      : lastStoreId === undefined
      ? payload.storeId
      : lastStoreId
)
