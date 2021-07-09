import { lastPayloadOfType } from '@coriolis/parametered-projection'

import { panelWidthChanged } from '../events/ui'

export const panelWidth = lastPayloadOfType(panelWidthChanged)
