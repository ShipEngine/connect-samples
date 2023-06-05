import { RequestError } from '../client.models';

export class PsRequestError extends Error {
  code: number;

  constructor(err: RequestError | string, code = 500) {
    if (typeof err === 'string') {
      super(err);
      return;
    }
    const msg: string = err.errors.map(e => e.message).join('; ');
    super(msg);

    this.code = code;
  }
}
