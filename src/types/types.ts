// export type FetchStatus = 'NO_REQUEST' | 'PENDING' | 'SUCCESS' | 'FAILURE';
import React, { FC, ReactComponentElement } from 'react';
import { FETCH_STATUS } from './enums';
import { EscortAsyncState } from './../functions/escortAsync/escortAsync';
import { AnyProp } from './../types/interfaces';

export type EscortAsyncWrapper = (
  WrappedComponent: ReactComponentElement<any, any> | FC<any> | React.ClassType<any, any, any> | React.ComponentType | React.ElementType,
  config?: any,
) => React.ComponentClass<any, AnyProp>;

export type FetchStatusFunction = (requestName: keyof EscortAsyncState['fetchStatus']) => FETCH_STATUS

