import { lastPayloadOfType } from '@coriolis/parametered-projection'

import { viewChanged } from '../../events/ui'

export const currentViewName = lastPayloadOfType(viewChanged)
