import { produce } from 'immer'

import { stateFlowCreated } from '../events/tracking/stateFlow'
import { get } from '../lib/object/get'
import { set } from '../lib/object/set'
import { currentStoreId } from './currentStoreId'

const reduceStateFlowsIndex = (
  state = {},
  { type, payload: { storeId, stateFlow } },
) => {
  switch (type) {
    case stateFlowCreated.toString():
      state = state || {}
      state.storeId = storeId
      state.stateFlow = stateFlow
      state.name = (stateFlow && stateFlow.name) || 'unnamed'
      break
  }

  return state
}

let previousId = 0
const createId = () => {
  previousId = previousId + 1

  return previousId
}

export const stateFlowIdIndex = ({ useState, useEvent }) => (
  useState(new Map()),
  useEvent(stateFlowCreated),
  (index, event) => {
    if (index.has(event.payload.stateFlow)) {
      return index
    }

    const newIndex = new Map(index)
    newIndex.set(event.payload.stateFlow, createId())
    return newIndex
  }
)

const allStateFlowsIndex = ({ useState, useEvent, useProjection }) => (
  useState({}),
  useProjection(stateFlowIdIndex),
  useEvent(stateFlowCreated),
  produce((indexDraft, idsIndex, event) =>
    set(
      indexDraft,
      event.payload.storeId,
      idsIndex.get(event.payload.stateFlow),
      reduceStateFlowsIndex(
        get(
          indexDraft,
          event.payload.storeId,
          idsIndex.get(event.payload.stateFlow),
        ),
        event,
      ),
    ),
  )
)

const stateFlowsIndex = ({ useProjection }) => (
  useProjection(allStateFlowsIndex),
  useProjection(currentStoreId),
  (fullIndex, storeId) => get(fullIndex, storeId) || {}
)

export const stateFlowList = ({ useProjection }) => (
  useProjection(stateFlowsIndex), (index) => Object.values(index)
)
