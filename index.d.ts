// Type definitions for with-async-request
// Project: @tareqdayya/with-async-request
// Definitions by: tareq dayya
import * as React from 'react';

export function withAsyncTrack(WrappedComponent: React.ReactComponentElement<any, any> | React.FC<any> | React.ClassType<any, any, any> | React.ComponentType | React.ElementType,
                               config?: any,): React.ReactComponentElement<any, any> | React.FC<any> | React.ClassType<any, any, any> | React.ComponentType | React.ElementType;

/*~ You can declare types that are available via importing the module */
import './src/types/types';
import './src/types/interfaces';
import { AsyncTrackProp } from './src/types/interfaces';

/*~ You can declare properties of the module using const, let, or var */
export const asyncTrack: AsyncTrackProp;

/*~ If there are types, properties, or methods inside dotted names
 *~ of the module, declare them inside a 'namespace'.
 */
/*export namespace subProp {
  /!*~ For example, given this definition, someone could write:
   *~   import { subProp } from 'yourModule';
   *~   subProp.foo();
   *~ or
   *~   import * as yourMod from 'yourModule';
   *~   yourMod.subProp.foo();
   *!/
  export function foo(): void;
}*/
