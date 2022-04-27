import { set } from '../lib/object/set'
import { unshift } from '../lib/array/unshift'
import { get } from '../lib/object/get'

import { trackingsListItem } from '../models/trackingsListItem'

import { commandExecuted, commandCompleted } from '../events/tracking/command'
import { effectAdded, effectRemoved } from '../events/tracking/effect'
import {
  stateFlowCreated,
  subscribedStateFlow,
  unsubscribedStateFlow,
  connectedStateFlow,
  disconnectedStateFlow,
  accessedStateFlowValue,
  requestedNextStateFlowValue,
  getStateFlowCalled,
} from '../events/tracking/stateFlow'
import {
  storeAdded,
  storeEvent,
  storeEnded,
  storeError,
} from '../events/tracking/store'

import { currentStoreId } from './currentStoreId'

export const fullTrackingsList = ({ useState, useEvent }) => (
  useState({}),
  useEvent(
    commandExecuted,
    commandCompleted,

    effectAdded,
    effectRemoved,

    stateFlowCreated,
    subscribedStateFlow,
    unsubscribedStateFlow,
    connectedStateFlow,
    disconnectedStateFlow,
    accessedStateFlowValue,
    requestedNextStateFlowValue,
    getStateFlowCalled,

    storeAdded,
    storeEvent,
    storeEnded,
    storeError,
  ),
  (lists, event) =>
    set(
      lists,
      event.payload.storeId,
      unshift(lists[event.payload.storeId], trackingsListItem(event)),
    )
)

export const trackingsList = ({ useProjection }) => (
  useProjection(fullTrackingsList),
  useProjection(currentStoreId),
  (allEvents, storeId) => get(allEvents, storeId) || []
)
