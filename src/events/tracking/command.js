import { createEventBuilder } from '@coriolis/coriolis'

export const commandExecuted = createEventBuilder(
  '[Tracking] command execution detected',
  ({ storeId, command, fromEffect }) => ({
    storeId,
    command,
    fromEffect,
  }),
)

export const commandCompleted = createEventBuilder(
  '[Tracking] command completed detected',
  ({ storeId, command }) => ({
    storeId,
    command,
  }),
)
