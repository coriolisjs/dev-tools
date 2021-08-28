export const eventTypeListItem = ({ type, count = 0 }) => ({
  type,
  count,
})

export const bumpCount = (item) =>
  eventTypeListItem({
    ...item,
    count: item.count + 1,
  })
