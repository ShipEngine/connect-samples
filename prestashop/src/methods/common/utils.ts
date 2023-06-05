import { RequestBase } from '@shipengine/connect-order-source-api';
import { UnauthorizedError } from '@shipengine/connect-runtime';

export function validateAuthorization(req: RequestBase): void {
  const { api_key } = req.auth;
  if (!api_key) {
    throw new UnauthorizedError('Authorization key is missing');
  }
}
