import { createEventBuilder } from '@coriolis/coriolis'

export const effectAdded = createEventBuilder(
  'Coriolis devtools : An effect has been added to a store',
  ({ storeId, effect }) => ({
    storeId,
    effect,
    name: effect.name,
  }),
)

export const effectRemoved = createEventBuilder(
  `Coriolis devtools : An effect has been removed from it's store`,
  ({ storeId, effect }) => ({ storeId, effect }),
)

export const withProjectionCalled = createEventBuilder(
  'Coriolis devtools : Projection has been used',
  ({ storeId, projection, stateFlow }) => ({
    storeId,
    projection,
    stateFlow,
  }),
)
