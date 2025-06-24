import { ErrorCode } from './error-code';

export interface ErrorResponse {
  code: ErrorCode;
  message: string;
}
