import { CustomError } from './customError';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route Not Found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public serializeErrors() {
    return [
      {
        message: 'Not Found',
      },
    ];
  }
}
