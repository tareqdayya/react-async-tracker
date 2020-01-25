import React, { Component, Fragment } from 'react'

import { escortAsync, FETCH_STATUS } from 'react-async-tracker';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  componentWillUnmount() {
    this.props.escort.cancelRequests();
  }

  fetchData() {
    this.props.escort.makeRequest(
      'myRequest',
      async () => {
        // async/await is so cool it keeps await-ing until the inner promise resolves/rejects
        return new Promise((res, _rej) => {
          setTimeout(() => {
            res(new Promise((resolve, rej) => {
                setTimeout(() => {
                  if (Math.random() < 0.5) return rej('bad promise!');
                  resolve('good inner Promise!');
                }, 1000);
              })
            );
          }, 1000);
        })
      },
    )
    .then(() => {
        console.log('success');
        this.setState({
          data: [
            { name: 'adam', age: 29 },
            { name: 'sarah', age: 30 },
            { name: 'max', age: 31 },
          ]
        })
      }
    )
    .catch((e) => console.log('e in consumer request:', e));
  }

  render() {
    const { escort } = this.props;
    const { data } = this.state;
    return (
      <div style={{ margin: 30, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ flex: 1.5 }}>A user can override any of the components rendered for each
          case!</h1>
        <h3
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          {data && data.length ? (
            <ul>
              {data.map(user => <li key={user.name}>{user.name} is {user.age} years old.</li>)}
            </ul>
          ) : (
            <Fragment>
              {/* this is your fetch component */}
              <Fragment>{!escort.fetchStatus('myRequest') && (
                <p>skeleton. or
                  <button style={{ backgroundColor: 'blue', color: 'white' }}
                          onClick={this.fetchData}>Fetch Data</button>
                </p>
              )}</Fragment>
              <Fragment>{escort.fetchStatus('myRequest') === FETCH_STATUS.ACTIVE && (
                <p>Loading...</p>
              )}</Fragment>
              <Fragment>{escort.fetchStatus('myRequest') === FETCH_STATUS.SUCCESS && (
                <p>✔︎</p>
              )}</Fragment>
              <Fragment>{escort.fetchStatus('myRequest') === FETCH_STATUS.FAIL && (
                <p>😔</p>
              )}</Fragment>
            </Fragment>
          )}
        </h3>
      </div>
    )
  }
}

export default escortAsync(Home);
