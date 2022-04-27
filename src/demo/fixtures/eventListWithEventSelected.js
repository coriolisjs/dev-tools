import { eventList } from './eventList'

export const eventListWithEventSelected = {
  ...eventList,
  'Last payload of type "[UI] event list item selected"': {
    type: 'event',
    payload: { any: 'data' },
    meta: {},
    error: false,
    isPastEvent: false,
    projectionCalls: [],
    isProjectionInit: false,
    isCommand: false,
    date: new Date().toLocaleString(),
    timestamp: new Date().getTime(),
    deltaN: '234ms',
    delta0: '3j',
    rank: 1,
  },
}
