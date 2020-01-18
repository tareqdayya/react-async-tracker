import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import { FETCH_STATUS } from './../../types/enums';
import { EscortPropTypes } from './../../types/interfaces';
import { EscortAsyncWrapper } from './../../types/types';

// @ts-ignore
const escortAsync: EscortAsyncWrapper = (WrappedComponent, config?: any) => {
  class EscortAsync extends Component<any, EscortAsyncState> {
    static displayName: string;

    componentDidMount(): void {
      this.fetchStatus('myRequest');
    }

    constructor(props: any) {
      super(props);
      this.state = {
        fetchStatus: {},
      };
      this.makeRequest = this.makeRequest.bind(this);
      this.isNotActive = this.isNotActive.bind(this);
      this.isActive = this.isActive.bind(this);
      this.fetchStatus = this.fetchStatus.bind(this);
    }

    isNotActive(requestName: string) {
      const { fetchStatus } = this.state;
      return fetchStatus[requestName] === FETCH_STATUS.NO_REQUEST;
    }

    isActive(requestName: string) {
      const { fetchStatus } = this.state;
      return fetchStatus[requestName] === FETCH_STATUS.PENDING;
    }

    fetchStatus(requestName: string) {
      // return the fetchStatus state variable, thus rendering the state var private!
      return this.state.fetchStatus[requestName];
    }

    async makeRequest(
      requestName: string,
      requestPromise: Promise<any>,
      isRevertsToInitial?: boolean,
      revertToInitialTimeoutInMs?: number,
    ) {
      this.setState(cur => ({
        fetchStatus: { ...cur.fetchStatus, [requestName]: FETCH_STATUS.PENDING }
      }));

      return new Promise((async (resolve, reject) => {
        try {
          const response = await requestPromise;

          this.setState(cur => ({
            fetchStatus: { ...cur.fetchStatus, [requestName]: FETCH_STATUS.SUCCESS }
          }));
          resolve(response);
        }
        catch (e) {
          this.setState(cur => ({
            fetchStatus: { ...cur.fetchStatus, [requestName]: FETCH_STATUS.FAILURE }
          }));
          reject(e);
        }

        if (isRevertsToInitial === false) return;

        setTimeout(() => {
          this.setState(cur => ({
            fetchStatus: { ...cur.fetchStatus, [requestName]: FETCH_STATUS.NO_REQUEST }
          }));
        }, revertToInitialTimeoutInMs ?? 1500);
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
