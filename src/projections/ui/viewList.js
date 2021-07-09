import { viewAdded } from '../../events/ui'

export const viewList = ({ useState, useEvent }) => (
  useState([]), useEvent(viewAdded), (list, { payload }) => [...list, payload]
)
