import { views } from '../../components/views/index'

import { TrackingsListItem } from './units/trackingsListItem'

export const trackingsList = {
  enabledViewName: 'TrackingsList',
  viewList: views,
  trackingsList: [
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
    TrackingsListItem('trackingEvent')(),
  ],
  'Last payload of type "Coriolis devtools : panel width changed"': 600,
  isDevtoolsOpen: true,
  'Last payload of type "Coriolis devtools : current view changed"':
    'TrackingsList',
}
