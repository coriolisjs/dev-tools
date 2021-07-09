import { createEventBuilder } from '@coriolis/coriolis'

export const commandExecuted = createEventBuilder(
  'Coriolis devtools : detected a command execution',
  ({ storeId, command }) => ({
    storeId,
    command,
  }),
)

export const commandCompleted = createEventBuilder(
  'Coriolis devtools : detected a command completed',
  ({ storeId, command }) => ({
    storeId,
    command,
  }),
)
