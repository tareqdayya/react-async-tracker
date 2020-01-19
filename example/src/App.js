import React, { Component, Fragment } from 'react'

import { escortAsync, FETCH_STATUS } from 'react-async-tracker';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.makeARequest = this.makeARequest.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.makeARequest();
    }, 1000);
  }

  makeARequest() {
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
    ).then(() => {
      // setTimeout to show the tick before displaying the data
      setTimeout(() => {
          this.setState({ data: [
            { name: 'adam', age: 29},
            { name: 'sarah', age: 30},
            { name: 'max', age: 31},
            ] });
      }, 500);
    });
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
              {data.map(user => <li>{user.name} is {user.age} years old.</li>)}
            </ul>
          ) : (
            <Fragment>
              <span>{!escort.fetchStatus('myRequest') && (
                <p>skeleton. or
                  <button style={{ backgroundColor: 'blue', color: 'white'}} onClick={this.makeARequest}>Fetch Data</button>
                </p>
              )}</span>
              <span>{escort.fetchStatus('myRequest') === FETCH_STATUS.ACTIVE && (
                <img src={require('./Spinner-0.5s-108px.svg')} alt="spinner" width={50}/>
              )}</span>
              <span>{escort.fetchStatus('myRequest') === FETCH_STATUS.SUCCESS && (
                <p>✔︎</p>
              )}</span>
              <span>{escort.fetchStatus('myRequest') === FETCH_STATUS.FAIL && (
                <p>😔</p>
              )}</span>
            </Fragment>
          )}
        </h3>
      </div>
    )
  }
}

export default escortAsync(App);
