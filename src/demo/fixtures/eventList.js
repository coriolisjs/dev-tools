import { views } from '../../components/views/index'

import { EventListItem } from './units/eventListItem'

export const eventList = {
  enabledViewName: 'EventList',
  viewList: views,
  filteredEventList: [
    EventListItem('storeEnded')(),
    EventListItem('storeError')(),
    EventListItem('event')(),
    EventListItem('event')(),
    EventListItem('event')(),
    EventListItem('commandExecuted')(),
    EventListItem('event')(),
    EventListItem('commandCompleted')(),
    EventListItem('event')(true),
    EventListItem('event')(true),
    EventListItem('event')(true),
    EventListItem('projectionInit')(),
  ],
  'Last payload of type "[UI] panel width changed"': 600,
  isDevtoolsOpen: true,
  'Last payload of type "[UI] current view changed"': 'EventList',
  'Last payload of type "[UI] event list filter have been changed"': undefined,
  'Last payload of type "[UI] event list item selected"': undefined,
  'Last payload of type "[UI] event list timing type have been selected"':
    undefined,
}
