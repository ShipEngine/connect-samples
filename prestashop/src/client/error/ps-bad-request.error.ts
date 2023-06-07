import { PsRequestError } from './ps-request.error';
import { RequestError } from '../client.models';

export class PsBadRequestError extends PsRequestError {
  constructor(err: RequestError | string) {
    super(err, 400);
  }
}
