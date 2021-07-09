import { first } from '../lib/array/first'
import { last } from '../lib/array/last'
import { unshift } from '../lib/array/unshift'
import { get } from '../lib/object/get'
import { set } from '../lib/object/set'

import {
  fromStoreEvent,
  fromStoreEnded,
  fromStoreError,
  fromCommandExecuted,
  fromCommandCompleted,
} from '../models/eventListItem'

import { storeEvent, storeEnded, storeError } from '../events/tracking/store'

import { commandExecuted, commandCompleted } from '../events/tracking/command'

import { currentStoreId } from './currentStoreId'

const reduceEventList = (eventList = [], event) => {
  switch (event.type) {
    case storeEvent.toString(): {
      const {
        payload: { event: originalEvent, isPastEvent },
      } = event
      return unshift(
        eventList,
        fromStoreEvent(
          originalEvent,
          isPastEvent,
          first(eventList),
          last(eventList),
        ),
      )
    }

    case storeEnded.toString():
      return unshift(
        eventList,
        fromStoreEnded(event, first(eventList), last(eventList)),
      )

    case storeError.toString():
      return unshift(
        eventList,
        fromStoreError(event, first(eventList), last(eventList)),
      )

    case commandExecuted.toString():
      return unshift(
        eventList,
        fromCommandExecuted(event, first(eventList), last(eventList)),
      )

    case commandCompleted.toString():
      return unshift(
        eventList,
        fromCommandCompleted(event, first(eventList), last(eventList)),
      )

    default:
      return eventList
  }
}

export const fullEventList = ({ useState, useEvent }) => (
  useState({}),
  useEvent(
    storeEvent,
    commandExecuted,
    commandCompleted,
    storeEnded,
    storeError,
  ),
  (lists, event) =>
    set(
      lists,
      event.payload.storeId,
      reduceEventList(lists[event.payload.storeId], event),
    )
)

export const eventList = ({ useProjection }) => (
  useProjection(fullEventList),
  useProjection(currentStoreId),
  (allEvents, storeId) => get(allEvents, storeId) || []
)
