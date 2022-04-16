import { createEventBuilder } from '@coriolis/coriolis'

export const commandExecuted = createEventBuilder(
  'Coriolis devtools : detected a command execution',
  ({ storeId, command, fromEffect }) => ({
    storeId,
    command,
    fromEffect,
  }),
)

export const commandCompleted = createEventBuilder(
  'Coriolis devtools : detected a command completed',
  ({ storeId, command }) => ({
    storeId,
    command,
  }),
)
