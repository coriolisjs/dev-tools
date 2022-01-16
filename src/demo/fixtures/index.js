import { open } from './open'
import { openWithEventSelected } from './openWithEventSelected'

export { open }

export const openWithTimeingTypeSelectedTimestamp = {
  ...open,
  'Last payload of type "Coriolis devtools : timing type for event display have been selected"':
    'timestamp',
}

export const openWithTimeingTypeSelectedDate = {
  ...open,
  'Last payload of type "Coriolis devtools : timing type for event display have been selected"':
    'date',
}

export const openWithTimeingTypeSelectedDelta0 = {
  ...open,
  'Last payload of type "Coriolis devtools : timing type for event display have been selected"':
    'delta0',
}

export { openWithEventSelected }

export const closed = {
  enabledViewName: undefined,
  isDevtoolsOpen: false,
}
