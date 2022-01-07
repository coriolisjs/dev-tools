import { open } from './open'

export const openWithEventSelected = {
  ...open,
  'Last payload of type "Coriolis devtools : item selected in event list"': {
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
