import { eventList } from './eventList'
import { eventListWithEventSelected } from './eventListWithEventSelected'

import { trackingsList } from './trackingsList'

export { eventList }

export const eventListWithTimingTypeSelectedTimestamp = {
  ...eventList,
  'Last payload of type "Coriolis devtools : timing type for event display have been selected"':
    'timestamp',
}

export const eventListWithTimingTypeSelectedDate = {
  ...eventList,
  'Last payload of type "Coriolis devtools : timing type for event display have been selected"':
    'date',
}

export const eventListWithTimingTypeSelectedDelta0 = {
  ...eventList,
  'Last payload of type "Coriolis devtools : timing type for event display have been selected"':
    'delta0',
}

export { eventListWithEventSelected }
export { trackingsList }

export const closed = {
  enabledViewName: undefined,
  isDevtoolsOpen: false,
}
