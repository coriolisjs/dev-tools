import { get } from '../lib/object/get'

import { currentStoreId } from './currentStoreId'

export const fullProjectionsIndex = ({ useState }) => (
  useState({}), (list) => list
)

const projectionsIndex = ({ useProjection }) => (
  useProjection(fullProjectionsIndex),
  useProjection(currentStoreId),
  (fullIndex, storeId) => get(fullIndex, storeId) || {}
)

export const projectionsList = ({ useProjection }) => (
  useProjection(projectionsIndex), (index) => Object.values(index)
)
