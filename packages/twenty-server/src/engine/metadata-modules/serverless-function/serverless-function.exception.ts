import { CustomException } from 'src/utils/custom-exception';

export class ServerlessFunctionException extends CustomException {
  code: ServerlessFunctionExceptionCode;
  constructor(message: string, code: ServerlessFunctionExceptionCode) {
    super(message, code);
  }
}

export enum ServerlessFunctionExceptionCode {
  SERVERLESS_FUNCTION_NOT_FOUND = 'SERVERLESS_FUNCTION_NOT_FOUND',
  SERVERLESS_FUNCTION_ALREADY_EXIST = 'SERVERLESS_FUNCTION_ALREADY_EXIST',
  SERVERLESS_FUNCTION_NOT_READY = 'SERVERLESS_FUNCTION_NOT_READY',
}
