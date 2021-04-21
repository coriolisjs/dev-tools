import { lastPayloadOfType } from '@coriolis/parametered-projection'

import { eventListFilterChange } from '../../events/ui'

export const eventListFilter = lastPayloadOfType(eventListFilterChange)
