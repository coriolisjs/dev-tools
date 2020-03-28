# Dev-tools for Coriolis

## Install

```sh
npm install -D @coriolis/dev-tools
```

## Usage

To load devtools, you just have to wrap event store options with a call to dev-tools wrapper:

```javascript
import { wrapCoriolisOptions } from '@coriolis/dev-tools'

createStore(wrapCoriolisOptions(options))

// or
createStore(wrapCoriolisOptions(effect1, effect2))
```
