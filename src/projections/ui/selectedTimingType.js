import { lastPayloadOfType } from '@coriolis/parametered-projection'

import { timingTypeSelected } from '../../events/ui'

export const selectedTimingType = lastPayloadOfType(timingTypeSelected)
