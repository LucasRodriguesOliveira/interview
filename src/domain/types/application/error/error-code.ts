import { Resource } from '../resource';

type Action = 'FIND' | 'CREATE' | 'UPDATE' | 'DELETE';

export type ErrorCode =
  | 'UNEXPECTED'
  | 'INVALID_DATA'
  | `COULD_NOT_${Action}_${Resource}`;
