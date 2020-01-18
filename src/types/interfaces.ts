import { EscortAsyncState } from './../functions/escortAsync/escortAsync';

export interface EscortPropTypes {
  makeRequest: Function;
  fetchStatus: EscortAsyncState['fetchStatus'];
}
