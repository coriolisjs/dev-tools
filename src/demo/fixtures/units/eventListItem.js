let currentRank = 1
const rank = () => currentRank++

const eventListItemKinds = {
  event: (isPastEvent = false) => {
    return {
      type: 'An event type',
      payload: { any: 'data' },
      meta: {},
      error: false,
      isPastEvent,
      projectionCalls: [],
      isProjectionInit: false,
      isCommand: false,
      date: new Date().toLocaleString(),
      timestamp: new Date().getTime(),
      deltaN: '234ms',
      delta0: '3j',
      rank: rank(),
    }
  },
  commandExecuted: () => {
    return {
      type: 'Command executed',
      payload: () => {},
      meta: {},
      error: false,
      isPastEvent: false,
      projectionCalls: [],
      isProjectionInit: false,
      isCommand: true,
      date: new Date().toLocaleString(),
      timestamp: new Date().getTime(),
      deltaN: '234ms',
      delta0: '3j',
      rank: rank(),
    }
  },
  commandCompleted: () => {
    return {
      type: 'Command completed',
      payload: () => {},
      meta: {},
      error: false,
      isPastEvent: false,
      projectionCalls: [],
      isProjectionInit: false,
      isCommand: true,
      date: new Date().toLocaleString(),
      timestamp: new Date().getTime(),
      deltaN: '234ms',
      delta0: '3j',
      rank: rank(),
    }
  },
  storeError: () => {
    return {
      type: 'Store error',
      payload: new Error('sample error'),
      meta: {},
      error: true,
      isPastEvent: false,
      projectionCalls: [],
      isProjectionInit: false,
      isCommand: false,
      date: new Date().toLocaleString(),
      timestamp: new Date().getTime(),
      deltaN: '234ms',
      delta0: '3j',
      rank: rank(),
    }
  },
  storeEnded: () => {
    return {
      type: 'Store ended',
      payload: '',
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
      rank: rank(),
    }
  },
  projectionInit: () => {
    return {
      type: 'Init projection Projection Name',
      payload: { any: 'data' },
      meta: {},
      error: false,
      isPastEvent: false,
      projectionCalls: [],
      isProjectionInit: true,
      isCommand: false,
      date: new Date().toLocaleString(),
      timestamp: new Date().getTime(),
      deltaN: '234ms',
      delta0: '3j',
      rank: rank(),
    }
  },
}

export const EventListItem = (kind) => {
  return eventListItemKinds[kind]
}
