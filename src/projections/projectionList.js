import { get } from '../lib/object/get'
import { set } from '../lib/object/set'

import { currentStoreId } from './currentStoreId'

import { projectionListItem } from '../models/projectionListItem'

import { stateFlowCreated } from '../events/tracking/stateFlow'
import { unshift } from '../lib/array/unshift'

const reduceProjectionList = (projectionList = [], event) => {
  switch (event.type) {
    case stateFlowCreated.toString():
      return unshift(
        projectionList,
        projectionListItem({
          id: projectionList.length,
          projection: event.payload.projection,
          stateFlow: event.payload.stateFlow,
        }),
      )

    default:
      return projectionList
  }
}

export const fullProjectionsIndex = ({ useState, useEvent }) => (
  useState({}),
  useEvent(stateFlowCreated),
  (lists, event) =>
    set(
      lists,
      event.payload.storeId,
      reduceProjectionList(lists[event.payload.storeId], event),
    )
)

export const projectionList = ({ useProjection }) => (
  useProjection(fullProjectionsIndex),
  useProjection(currentStoreId),
  (fullIndex, storeId) => get(fullIndex, storeId) || []
)
