# <img src='https://user-images.githubusercontent.com/67515/79133703-c3bcd200-7dac-11ea-9cd1-c39b84458d35.png' height='40' alt='Coriolis dev-tools logo' aria-label='Coriolis dev-tools' /> Dev-tools for Coriolis

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

## Credits

[Icon made by Freepik from www.flaticon.com](https://www.flaticon.com/authors/freepik)

[Icon made by Surang from www.flaticon.com](https://www.flaticon.com/authors/surang)
