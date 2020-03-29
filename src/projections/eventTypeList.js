import { get } from '../lib/object/get'

import { storeEvent } from '../events'

import { currentStoreId } from './currentStoreId'

const allEventTypeIndex = ({ useState, useEvent }) => (
  useState({}),
  useEvent(storeEvent),
  (index, { payload: { storeId, event: originalEvent } }) => ({
    ...index,
    [storeId]: {
      ...index[storeId],
      [originalEvent.type]: (get(index, storeId, originalEvent.type) || 0) + 1,
    },
  })
)

const eventTypeIndex = ({ useProjection }) => (
  useProjection(currentStoreId),
  useProjection(allEventTypeIndex),
  (storeId, index) => get(index, storeId) || {}
)

export const eventTypeList = ({ useProjection }) => (
  useProjection(eventTypeIndex),
  (index) => Object.entries(index).map(([name, count]) => ({ name, count }))
)
