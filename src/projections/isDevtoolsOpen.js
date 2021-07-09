import { devtoolsOpened, devtoolsClosed } from '../events/ui'

export const isDevtoolsOpen = ({ useEvent }) => (
  useEvent(devtoolsOpened, devtoolsClosed),
  (event) => event.type === devtoolsOpened.toString()
)
