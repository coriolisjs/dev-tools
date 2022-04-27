let count = 1
const uniqId = () => count++

const trackingsListItemKinds = {
  trackingEvent: (eventType = 'An event type') => {
    return {
      id: uniqId(),
      type: eventType,
      payload: { any: 'data' },
      meta: {},
      error: false,
    }
  },
}

export const TrackingsListItem = (kind) => {
  return trackingsListItemKinds[kind]
}
