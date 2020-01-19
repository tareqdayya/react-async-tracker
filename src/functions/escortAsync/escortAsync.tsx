import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { FETCH_STATUS } from './../../types/enums';
import { EscortPropTypes } from './../../types/interfaces';
import { EscortAsyncWrapper } from './../../types/types';

// @ts-ignore
const escortAsync: EscortAsyncWrapper = (WrappedComponent, config?: any) => {
  class EscortAsync extends Component<any, EscortAsyncState> {
    static displayName: string;

    constructor(props: any) {
      super(props);
      this.state = {
        fetchStatus: {},
      };
      this.makeRequest = this.makeRequest.bind(this);
      this.fetchStatus = this.fetchStatus.bind(this);
    }

    fetchStatus(requestName: string) {
      // return the fetchStatus state variable, thus rendering the state var private!
      return this.state.fetchStatus[requestName];
    }

    async makeRequest(
      requestName: string,
      request: Promise<any> | Function,
      revertsToInactive?: boolean,
      timeoutUntilRevertsToInactiveInMs: number = 1500,
    ): Promise<any> {
      /** post stage: POST_FAIL or POST_SUCCESS */

      // set fetchStatus to active
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

          this.setState(cur => ({
            fetchStatus: { ...cur.fetchStatus, [requestName]: FETCH_STATUS.SUCCESS }
          }));

          // setTimeout so we can render the success component b4 returning the data
          setTimeout(() => {
            resolve(response);
          }, timeoutUntilRevertsToInactiveInMs);
        }
        catch (e) {
          this.setState(cur => ({
            fetchStatus: { ...cur.fetchStatus, [requestName]: FETCH_STATUS.FAIL }
          }));
          reject(e);
        }

        if (revertsToInactive === false) return;

        setTimeout(() => {
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
