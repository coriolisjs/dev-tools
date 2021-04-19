import { createEventBuilder } from '@coriolis/coriolis'

export const projectionCompiled = createEventBuilder(
  'Coriolis devtools : Projection has been compiled',
  ({ storeId, projection, reducer, initialState }) => ({
    storeId,
    projection,
    reducer,
    initialState,
  }),
)
