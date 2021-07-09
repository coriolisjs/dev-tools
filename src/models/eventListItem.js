import { get } from '../lib/object/get'
import { humanReadableTimeDelta } from '../lib/time/humanReadableTimeDelta'

const getTimestampDelta = (timestamp2, timestamp1) =>
  timestamp1 ? timestamp2 - timestamp1 : 0

export const eventListItem = ({
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
  deltaN: humanReadableTimeDelta(
    getTimestampDelta(timestamp, get(previousListItem, 'timestamp')),
  ),
  delta0: humanReadableTimeDelta(
    getTimestampDelta(timestamp, get(firstListItem, 'timestamp')),
  ),
  rank: (get(previousListItem, 'rank') || 0) + 1,
})

export const fromStoreEvent = (
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

export const fromStoreEnded = (event, previousListItem, firstListItem) =>
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

export const fromStoreError = (event, previousListItem, firstListItem) =>
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

export const fromCommandExecuted = (event, previousListItem, firstListItem) =>
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

export const fromCommandCompleted = (event, previousListItem, firstListItem) =>
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
