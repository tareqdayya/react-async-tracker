// importing type files
import * as enums from './src/types/enums';
import * as errors from './src/types/errors';
import * as interfaces from './src/types/interfaces';
import * as types from './src/types/types';

// declare what's exported (don't give it a type if it's already imported from typings files above)
declare const escortAsync: types.EscortAsyncWrapper;
declare const FETCH_STATUS;
