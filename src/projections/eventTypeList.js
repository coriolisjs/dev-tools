import { get } from '../lib/object/get'
import { set } from '../lib/object/set'

import { storeEvent } from '../events/tracking/store'

import { bumpCount, eventTypeListItem } from '../models/eventTypeListItem'

import { currentStoreId } from './currentStoreId'

const reduceEventTypes = (
  eventTypes = {},
  { payload: { event: originalEvent } },
) =>
  set(
    eventTypes,
    originalEvent.type,
    bumpCount(
      eventTypes[originalEvent.type] ||
        eventTypeListItem({ type: originalEvent.type }),
    ),
  )

export const allEventTypeIndex = ({ useState, useEvent, setName }) => (
  setName('allEventTypeIndex'),
  useState({}),
  useEvent(storeEvent),
  (index, event) =>
    set(
      index,
      event.payload.storeId,
      reduceEventTypes(index[event.payload.storeId], event),
    )
)

const eventTypeIndex = ({ useProjection }) => (
  useProjection(currentStoreId),
  useProjection(allEventTypeIndex),
  (storeId, index) => get(index, storeId) || {}
)

export const eventTypeList = ({ useProjection, setName }) => (
  setName('eventTypeList'),
  useProjection(eventTypeIndex),
  (index) => Object.values(index)
)
