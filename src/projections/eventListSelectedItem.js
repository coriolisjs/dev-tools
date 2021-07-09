import { lastPayloadOfType } from '@coriolis/parametered-projection'

import { selectedEventListItem } from '../events'

export const eventListSelectedItem = lastPayloadOfType(selectedEventListItem)
