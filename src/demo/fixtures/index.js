import { eventList } from './eventList'
import { eventListWithEventSelected } from './eventListWithEventSelected'

import { trackingsList } from './trackingsList'

export { eventList }

export const eventListWithTimingTypeSelectedTimestamp = {
  ...eventList,
  'Last payload of type "[UI] event list timing type have been selected"':
    'timestamp',
}

export const eventListWithTimingTypeSelectedDate = {
  ...eventList,
  'Last payload of type "[UI] event list timing type have been selected"':
    'date',
}

export const eventListWithTimingTypeSelectedDelta0 = {
  ...eventList,
  'Last payload of type "[UI] event list timing type have been selected"':
    'delta0',
}

export { eventListWithEventSelected }
export { trackingsList }

export const closed = {
  enabledViewName: undefined,
  isDevtoolsOpen: false,
}
