import { produce, original } from 'immer'
import { set } from 'immer/dist/internal'

import { stateFlowIndexed /*, initialReducedProjectionCreated, nextReducedProjectionCreated*/ } from '../events'
import { get } from '../lib/object/get'
import { currentStoreId } from './currentStoreId'

const reduceStateFlowsIndex = (
  state = {},
  { type, payload: { storeId, stateFlowId, stateFlow, args } },
) => {
  switch (type) {
    case stateFlowIndexed.toString():
      state = state || {}
      state.storeId = storeId
      state.stateFlowId = stateFlowId
      state.stateFlow = stateFlow
      state.name = (stateFlow && stateFlow.name) || 'unnamed'
      state.args = args
      break
  }

  return state
}

const allStateFlowsIndex = ({ useState, useEvent }) => (
  useState({}),
  useEvent(stateFlowIndexed),
  produce((indexDraft, event) =>
    set(indexDraft, event.payload.storeId, event.payload.stateFlowId, reduceStateFlowsIndex(
      get(indexDraft, event.payload.storeId, event.payload.stateFlowId),
      event,
    ))
  )
)

const stateFlowsIndex = ({ useProjection }) => (
  useProjection(allStateFlowsIndex),
  useProjection(currentStoreId),
  (fullIndex, storeId) => get(fullIndex, storeId) || {}
)

const storeStateFlowIdsIndex = ({ useState, useEvent }) => (
  useState({}),
  useEvent(stateFlowIndexed),
  (index, event) => index[event.payload.storeId] = (index[event.payload.storeId] || []).concat(event.payload.)
)

export const stateFlowList = ({ useProjection }) => (
  useProjection(stateFlowsIndex), (index) => Object.values(index)
)
