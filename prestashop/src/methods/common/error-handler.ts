import {
  BadRequestError,
  BaseError,
  ExternalServerError,
  UnauthorizedError,
  logger,
} from '@shipengine/connect-runtime';
import { PsBadRequestError } from '../../client/error';
import { PsUnauthorizedError } from '../../client/error/ps-unauthorized.error';

export function handlerError(e: Error): Error {
  logger.error(e);

  if (e instanceof BaseError) {
    return e;
  }
  if (e instanceof PsBadRequestError) {
    return new BadRequestError(e.message);
  }
  if (e instanceof PsUnauthorizedError) {
    return new UnauthorizedError(e.message);
  }
  return new ExternalServerError(e.message);
}
