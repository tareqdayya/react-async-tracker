interface FetchStatus { [name: string]: FetchStatus }

export interface AsyncTrackProp {
  makeRequest: Function;
  fetchStatus: FetchStatus;
}
