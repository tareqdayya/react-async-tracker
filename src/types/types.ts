// export type FetchStatus = 'NO_REQUEST' | 'PENDING' | 'SUCCESS' | 'FAILURE';
import React, { FC, ReactComponentElement } from 'react';

export type EscortAsyncWrapper = (
  WrappedComponent: ReactComponentElement<any, any> | FC<any> | React.ClassType<any, any, any> | React.ComponentType | React.ElementType,
  config?: any,
) => React.ComponentClass<any, any>;
