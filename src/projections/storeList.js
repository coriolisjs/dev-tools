import { storeAdded } from '../events/tracking/store'

export const storeList = ({ useState, useEvent }) => (
  useState([]), useEvent(storeAdded), (list, event) => [...list, event.payload]
)
