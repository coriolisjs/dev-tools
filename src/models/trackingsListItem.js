let count = 0
const uniqId = () => {
  return count++
}

export const trackingsListItem = (trackingEvent) => ({
  ...trackingEvent,
  id: uniqId(),
})
