import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { FETCH_STATUS } from './../../types/enums';
import { EscortPropTypes } from './../../types/interfaces';
import { EscortAsyncWrapper } from './../../types/types';

// @ts-ignore
const escortAsync: EscortAsyncWrapper = (WrappedComponent, config?: any) => {
  class EscortAsync extends Component<any, EscortAsyncState> {
    static displayName: string;

    /** considered setting to false in componentWillUnmount, but decided it's better left to user.
     * This way they might use it to set state in redux, or cancel requests when disappearing, as
     * opposed to unmounting, as in one of the stack-navigation libraries */
    private shouldRequestsReturn: boolean = true;

    constructor(props: any) {
      super(props);
      this.state = {
        fetchStatus: {},
      };
      this.makeRequest = this.makeRequest.bind(this);
      this.fetchStatus = this.fetchStatus.bind(this);
      this.cancelRequests = this.cancelRequests.bind(this);
    }

    fetchStatus(requestName: string) {
      /** return the fetchStatus state variable, thus rendering the state var private! */
      return this.state.fetchStatus[requestName];
    }

    cancelRequests() {
      /** cancels all requests' effects (setState is not executed), but network request is still
       * sent and returned normally.
       * This function should be called before unmounting/disappearing the component. */
      this.shouldRequestsReturn = false;
    }

    async makeRequest(
      requestName: string,
      request: Promise<any> | Function,
      revertsToInactive?: boolean,
      timeoutUntilRevertsToInactiveInMs: number = 1500,
    ): Promise<any> {
      // set fetchStatus to active
      if (!this.shouldRequestsReturn) return;
      this.setState(cur => ({
        fetchStatus: { ...cur.fetchStatus, [requestName]: FETCH_STATUS.ACTIVE }
      }));

      // if a function is passed, we call it to get the promise
      if (typeof request === 'function') {
        console.log('recursively calling makeRequest. dont forget to carry all arguments.');
        return this.makeRequest(
          requestName,
          request(),
          revertsToInactive,
          timeoutUntilRevertsToInactiveInMs
        );
      }

      return new Promise((async (resolve, reject) => {
        try {
          const response = await request;

          if (!this.shouldRequestsReturn) return;
          this.setState(cur => ({
            fetchStatus: { ...cur.fetchStatus, [requestName]: FETCH_STATUS.SUCCESS }
          }));

          // setTimeout so we can render the success component b4 returning the data
          setTimeout(() => {
            if (!this.shouldRequestsReturn) return;
            resolve(response);
          }, timeoutUntilRevertsToInactiveInMs);
        }
        catch (e) {
          if (!this.shouldRequestsReturn) return;
          this.setState(cur => ({
            fetchStatus: { ...cur.fetchStatus, [requestName]: FETCH_STATUS.FAIL }
          }));
          reject(e);
        }

        if (revertsToInactive === false) return;

        setTimeout(() => {
          if (!this.shouldRequestsReturn) return;
          this.setState(cur => ({
            fetchStatus: {
              ...cur.fetchStatus,
              [requestName]: FETCH_STATUS.INACTIVE,
            }
          }));
        }, timeoutUntilRevertsToInactiveInMs);
      }));
    }

    render() {
      // const { fetchStatus } = this.state;

      const escort: EscortPropTypes = {
        makeRequest: this.makeRequest,
        fetchStatus: this.fetchStatus,
        cancelRequests: this.cancelRequests,
      };

      return (
        <WrappedComponent
          escort={escort}
          {...this.props}
        />
      );
    }

  }

  hoistNonReactStatic(EscortAsync, WrappedComponent);
  EscortAsync.displayName = `EscortAsync(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
  return EscortAsync;
};

export type EscortAsyncState = {
  fetchStatus: { [name: string]: FETCH_STATUS }
};

export default escortAsync;
