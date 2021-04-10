import { lastPayloadOfType } from '@coriolis/parametered-projection'

import { selectedEventListItem } from '../events/ui'

export const eventListSelectedItem = lastPayloadOfType(selectedEventListItem)
