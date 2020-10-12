export default class UnauthorizedError extends Error {
  name = 'UnauthorizedError';

  constructor(message?: string) {
    super();
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.message = message || 'Insufficient permissions to execute the operation';
  }
}
