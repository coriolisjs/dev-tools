import { createEventBuilder } from '@coriolis/coriolis'

export const projectionIndexed = createEventBuilder(
  'Coriolis devtools : Projection has been indexed',
  ({ storeId, projection }) => ({
    storeId,
    projection,
  }),
)
