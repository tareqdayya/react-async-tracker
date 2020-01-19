# react-async-tracker

> react wrapper (HOC) for tracking the status of async requests.

[![NPM](https://img.shields.io/npm/v/react-async-tracker.svg)](https://www.npmjs.com/package/react-async-tracker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-async-tracker
```

## Usage

it's very important we don't rely on FETCH_STATUS.SUCCESS to access the data, but rather whether we 
have data or not:
1- FETCH_STATUS.SUCCESS is temporary. It should eventually revert to FETCH_STATUS.INACTIVE, unless 
the user chooses not to revert.
2- fetchStatus() becomes assigned to SUCCESS before the result of the promise is resolved.

Users will provide a component, or use the one provided, to display request status. Most of the time 
they will not be directly interacting with FETCH_STATUS enum. In order to carry out logic after the 
request resolves or rejects, chain .then(), .catch() and .finally() to escort.makeRequest()
**Remember**: it's escort.makeRequest() that gets chained and not the request inside it. 
```tsx
import * as React from 'react'

import MyComponent from 'react-async-tracker'

class Example extends React.Component {
  render () {
    return (
      <MyComponent />
    )
  }
}
```

## License

MIT © [@tareqdayya](https://github.com/@tareqdayya)
