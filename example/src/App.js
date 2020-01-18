import React, { Component } from 'react'

import { escortAsync } from 'react-async-tracker';

class App extends Component {

  componentDidMount() {
    this.props.escort.makeRequest('myRequest', async () => {
      return new Promise((res, rej) => {
        setTimeout(() => {
          res(true);
        }, 2000);
      })
    })
  }

  render() {
    const { escort } = this.props;
    return (
      <div style={{ margin: 30 }}>
        <h1>This is an escorted App!</h1>
        <h5>{escort.fetchStatus('myRequest')}</h5>
      </div>
    )
  }
}

export default escortAsync(App);
