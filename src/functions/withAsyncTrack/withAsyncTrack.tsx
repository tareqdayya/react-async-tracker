import React, { Component, FC, ReactComponentElement } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { FetchStatus } from 'types/types';

// TODO figure out where to use this error. Can't use it directly in a getter since componentDidMount
// is a usual place to use this and when it's called after render (so getter tries to access
// a property that is about to be created)
const REQUEST_NAME_ERROR = new Error();
REQUEST_NAME_ERROR.message = `Are You Sure You Have Sent A Request
  With Said Name? withNetworkRequest Doesn't Seem To Be Able To Find It.`;
REQUEST_NAME_ERROR.name = 'REQUEST NAME ERROR';

const withAsyncTrack = (
  WrappedComponent: ReactComponentElement<any, any> | FC<any> | React.ClassType<any, any, any> | React.ComponentType | React.ElementType,
  config?: any,
) => {
  class WithNetworkRequest extends Component<any, withAsyncRequestState> {
    static displayName: string;

    constructor(props: any) {
      super(props);
      this.state = {
        fetchStatus: {},
      };
      this.makeRequest = this.makeRequest.bind(this);
    }

    immutablyUpdateFetchStatusObject(
      obj: any,
      key: string | number | symbol,
      value: FetchStatus,
    ) {
      if (typeof obj !== 'object') return obj;

      const copy = Object.assign({}, obj);

      copy[key] = value;

      return copy;
    }

    async makeRequest(requestName: string,
                      requestPromise: Promise<any>,
                      isRevertsToInitial?: boolean,
                      revertToInitialTimeoutInMs?: number,) {
      this.setState(cur => ({
        fetchStatus: this.immutablyUpdateFetchStatusObject(cur.fetchStatus,
          requestName,
          'PENDING')
      }));

      return new Promise((async (resolve, reject) => {
        try {
          const response = await requestPromise;

          this.setState(cur => ({
            fetchStatus: this.immutablyUpdateFetchStatusObject(cur.fetchStatus,
              requestName,
              'SUCCESS')
          }));
          resolve(response);
        }
        catch (e) {
          this.setState(cur => ({
            fetchStatus: this.immutablyUpdateFetchStatusObject(cur.fetchStatus,
              requestName,
              'FAILURE')
          }));
          reject(e);
        }

        if (isRevertsToInitial === false) return;

        setTimeout(() => {
          this.setState(cur => ({
            fetchStatus: this.immutablyUpdateFetchStatusObject(cur.fetchStatus,
              requestName,
              'NO_REQUEST')
          }));
        }, revertToInitialTimeoutInMs ?? 1500);
      }));
    }

    render() {
      const { fetchStatus } = this.state;
      return (
        <WrappedComponent
          asyncTrack={{
            makeRequest: this.makeRequest,
            fetchStatus,
          }}
          {...this.props}
        />
      );
    }

  }

  hoistNonReactStatic(WithNetworkRequest, WrappedComponent);
  WithNetworkRequest.displayName = `WithNetworkRequest(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return WithNetworkRequest;
};

export type withAsyncRequestState = {
  fetchStatus: { [name: string]: FetchStatus }
};

export default withAsyncTrack;
