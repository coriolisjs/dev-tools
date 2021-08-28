import { first } from '../lib/array/first'
import { last } from '../lib/array/last'
import { unshift } from '../lib/array/unshift'
import { get } from '../lib/object/get'

import {
  storeEvent,
  projectionCalled,
  aggregatorCreated,
  storeEnded,
  storeError,
  commandExecuted,
  commandCompleted,
} from '../events'

import { currentStoreId } from './currentStoreId'
import { fullProjectionsIndex } from './projectionsList'

const ifUndefined = (value, defaultValue) =>
  value === undefined || value === null ? defaultValue : value

const getTimestampDelta = (timestamp2, timestamp1) =>
  timestamp1 ? timestamp2 - timestamp1 : 0

const eventListItem = ({
  title,
  payload,
  meta,
  isError,
  isPastEvent,
  projectionCalls,
  timestamp,
  previousListItem,
  firstListItem,
}) => ({
  type: title,
  payload,
  meta,
  error: isError,
  isPastEvent,
  projectionCalls,
  isProjectionInit: title.includes('Init projection'),
  isCommand: typeof payload === 'function',

  date: new Date(timestamp).toLocaleString(),
  timestamp: timestamp,
  deltaN: getTimestampDelta(timestamp, get(previousListItem, 'timestamp')),
  delta0: getTimestampDelta(timestamp, get(firstListItem, 'timestamp')),
  rank: (get(previousListItem, 'rank') || 0) + 1,
})

const mapStoreEventToEventListItem = (
  event,
  isPastEvent,
  previousListItem,
  firstListItem,
) =>
  eventListItem({
    title: event.type,
    payload: event.payload,
    meta: event.meta,
    isError: event.error,
    isPastEvent,
    projectionCalls: [],

    timestamp: event.meta.timestamp,
    previousListItem,
    firstListItem,
  })

const mapAggregatorCreatedToEventListItem = (
  event,
  previousListItem,
  firstListItem,
) =>
  eventListItem({
    title: `Init projection ${event.payload.projection.name}`,
    payload: event.payload.aggregator.value,
    meta: {},
    isError: false,
    isPastEvent: ifUndefined(get(previousListItem, 'isPastEvent'), true),
    projectionCalls: [],

    timestamp: event.meta.timestamp,
    previousListItem,
    firstListItem,
  })

const mapStoreEndedToEventListItem = (event, previousListItem, firstListItem) =>
  eventListItem({
    title: `Store ended`,
    payload: '',
    isError: false,
    isPastEvent: false,
    projectionCalls: [],

    timestamp: event.meta.timestamp,
    previousListItem,
    firstListItem,
  })

const mapStoreErrorToEventListItem = (event, previousListItem, firstListItem) =>
  eventListItem({
    title: `Store error`,
    payload: event.payload.error,
    isError: true,
    isPastEvent: false,
    projectionCalls: [],

    timestamp: event.meta.timestamp,
    previousListItem,
    firstListItem,
  })

const mapCommandExecutedToEventListItem = (
  event,
  previousListItem,
  firstListItem,
) =>
  eventListItem({
    title: `Command executed`,
    payload: event.payload.command,
    isError: false,
    isPastEvent: false,
    projectionCalls: [],

    timestamp: event.meta.timestamp,
    previousListItem,
    firstListItem,
  })

const mapCommandCompletedToEventListItem = (
  event,
  previousListItem,
  firstListItem,
) =>
  eventListItem({
    title: `Command completed`,
    payload: event.payload.command,
    isError: false,
    isPastEvent: false,
    projectionCalls: [],

    timestamp: event.meta.timestamp,
    previousListItem,
    firstListItem,
  })

const addProjectionCall = (
  lastEventListItem,
  args,
  newState,
  projectionData,
) => ({
  ...lastEventListItem,
  projectionCalls: [
    ...lastEventListItem.projectionCalls,
    {
      ...projectionData,
      args,
      previousState: projectionData.aggregator.value,
      newState,
    },
  ],
})

const fullEventList = ({ useState, useEvent, useProjection }) => (
  useState({}),
  useEvent(
    projectionCalled,
    storeEvent,
    commandExecuted,
    commandCompleted,
    aggregatorCreated,
    storeEnded,
    storeError,
  ),
  useProjection(fullProjectionsIndex),
  (lists, event, projectionIndexes) => {
    const {
      payload: { storeId },
    } = event
    const eventList = lists[storeId]
    let newEventlist = eventList

    switch (event.type) {
      case storeEvent.toString(): {
        const {
          payload: { event: originalEvent, isPastEvent },
        } = event
        newEventlist = unshift(
          eventList,
          mapStoreEventToEventListItem(
            originalEvent,
            isPastEvent,
            first(eventList),
            last(eventList),
          ),
        )
        break
      }

      case aggregatorCreated.toString():
        newEventlist = unshift(
          eventList,
          mapAggregatorCreatedToEventListItem(
            event,
            first(eventList),
            last(eventList),
          ),
        )
        break

      case storeEnded.toString():
        newEventlist = unshift(
          eventList,
          mapStoreEndedToEventListItem(
            event,
            first(eventList),
            last(eventList),
          ),
        )
        break

      case storeError.toString():
        newEventlist = unshift(
          eventList,
          mapStoreErrorToEventListItem(
            event,
            first(eventList),
            last(eventList),
          ),
        )
        break

      case projectionCalled.toString(): {
        const {
          payload: { storeId, projectionId, args, newState },
        } = event

        const lastEvent = eventList[0]
        const projectionData = projectionIndexes[storeId][projectionId]

        newEventlist = [
          addProjectionCall(lastEvent, args, newState, projectionData),
          ...eventList.slice(1),
        ]
        break
      }

      case commandExecuted.toString():
        newEventlist = unshift(
          eventList,
          mapCommandExecutedToEventListItem(
            event,
            first(eventList),
            last(eventList),
          ),
        )
        break

      case commandCompleted.toString():
        newEventlist = unshift(
          eventList,
          mapCommandCompletedToEventListItem(
            event,
            first(eventList),
            last(eventList),
          ),
        )
        break

      default:
        return lists
    }

    return {
      ...lists,
      [storeId]: newEventlist,
    }
  }
)

export const eventList = ({ useProjection }) => (
  useProjection(fullEventList),
  useProjection(currentStoreId),
  (allEvents, storeId) => get(allEvents, storeId) || []
)
