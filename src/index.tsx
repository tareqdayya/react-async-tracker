import escortAsync from './functions/escortAsync';
import { FETCH_STATUS } from './types/enums';
import logger from './utils/logger';

console.log = logger;

export {
  escortAsync,
  FETCH_STATUS,
};
