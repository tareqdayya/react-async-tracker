// import { EscortAsyncState } from './../functions/escortAsync/escortAsync';
import { FetchStatusFunction } from './types';

export interface EscortPropTypes {
  makeRequest: Function;
  fetchStatus: FetchStatusFunction;
  cancelRequests: Function;
}

export interface AnyProp {
  escort: EscortPropTypes;
  [prop: string]: any;
}
