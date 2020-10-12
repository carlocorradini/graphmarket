export default class UnauthorizedError extends Error {
  name = 'UnauthorizedError';

  constructor() {
    super();
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.message = 'Insufficient permissions to execute the operation';
  }
}
