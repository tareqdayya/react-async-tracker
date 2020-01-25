# react-async-tracker

> react wrapper (HOC) for tracking the status of async requests.

[![NPM](https://img.shields.io/npm/v/react-async-tracker.svg)](https://www.npmjs.com/package/react-async-tracker) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

<br/>

A package that reuses state logic responsible for tracking an async request's status. Supports 
promises, thunks, and any other type of async request.
Don't forget to ⭐️ if you like.

## Install

```bash
npm install react-async-tracker
```
or if you're using yarn
```bash
yarn add react-async-tracker
```

## Usage

This package reuses state logic responsible for tracking an async request's status. It exports a 
wrapper function, and an object that contains the possible status values which
you can use to compare your request's status against. The values that a request status can take are
 as follows:
<br/>
* undefined: Request not yet initiated
* FETCH_STATUS.ACTIVE: 🏋
* FETCH_STATUS.SUCCESS: 😇
* FETCH_STATUS.FAIL: 😢
* FETCH_STATUS.INACTIVE: the request is set to this value **ONLY** after finishing (either with 
success or failure). BTW, this is equal to 0, which means it's a falsy value. 

<br/>
Here is a full example of a typical use case:

```bash
import { escortAsync, FETCH_STATUS } from 'react-async-tracker';

class MyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.fetchData = this.fetchData.bind(this);
  }

  componentWillUnmount() {
    this.props.escort.cancelRequests();
  }

  fetchData() {
    this.props.escort.makeRequest(
      'myRequest',
      dispatch(thunkReturningFunction())
    )
    .then((data) => this.setState({ data }))
    .catch((e) => console.log('e', e));
  }

  render() {
    const { escort } = this.props;
    const { data } = this.state;
    return (
      <div>
          {data && data.length ? (
            <ul>
              display your fetched data
            </ul>
          ) : (
            <Fragment>
              {/* Create a reusable component that replicates the behavior below */}
              <span>{!escort.fetchStatus('myRequest') && (
                <button onClick={this.fetchData}>Fetch Data</button>
              )}
              </span>

              <span>{escort.fetchStatus('myRequest') === FETCH_STATUS.ACTIVE && (
                LOADING...
              )}</span>

              <span>{escort.fetchStatus('myRequest') === FETCH_STATUS.SUCCESS && (
                <p>😃</p>
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

export default escortAsync(MyComponent);
```

The **escortAsync** function is a wrapper which passes down the object **escort** to your props.
Use this object to make requests, track their status, and cancel them:
* escort.makeRequest(myRequestName, request): makes the request. Make sure whatever promise-chaining
functions you use (then, catch, finally) are **chained to it** and **NOT** the request in the 
arguments!
* escort.fetchStatus(myRequestName): returns the status of the request. Compare this against one
of the values of the FETCH_STATUS enum (scared by the word enum? pretend it's not there) object.
* escort.cancelRequests(): use this in the componentWillUnmount method to cancel all ongoing
 requests and avoid the memory leak console warning. And no, you can't cancel just one request.
 
<br/> 
You can make as many requests in one component as you'd like, just make sure you name each of them.
<br/>

#### Escort.makeRequest() Options:
<table>
<tr>
<th>Option</th>
<th>Required?</th>
<th>Description</th>
</tr>

<tr>
<td>requestName</td>
<td>true</td>
<td>a string that represents your request. You'll use this to query for the status of the request.</td>
</tr>

<tr>
<td>request</td>
<td>true</td>
<td>This could be a promise, a function that returns a promise (functions are recursively called until
a promise is found), or your average redux dispatch of a thunk.</td>
</tr>

<tr>
<td>revertsToInactive</td>
<td>false</td>
<td>Controls whether value of the request status becomes INACTIVE after it completes.
Providing false here means the request will not change after reaching SUCCESS
or FAIL after finishing</td>
</tr>

<tr>
<td>timeoutUntilRevertsToInactiveInMs</td>
<td>false</td>
<td>How many milliseconds to wait after request completion before
setting request status to INACTIVE. Default is 1500. Setting revertsToInactive = false will render
this useless.</td>
</tr>
</table>

<br/>

_PS: it's very important we don't rely on FETCH_STATUS.SUCCESS as a condition to access whether we
have data_. **Why**?
1. FETCH_STATUS.SUCCESS is temporary. The value should eventually change to FETCH_STATUS.INACTIVE 
(unless the user chooses not to for that individual request; that is).
1. fetchStatus(REQUEST_NAME) becomes assigned to SUCCESS before the result of the promise is resolved.
Some time is given before changing value to INACTIVE so that users get to see the SUCCESS result 
on their screens.
1. Assuming you persist the data, e.g. store it in redux, unmounting the component will reset the
status of the request to undefined while the data is still available.

## License

MIT © [@tareqdayya](https://github.com/@tareqdayya)
