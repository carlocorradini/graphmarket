/**
 * Unauthorized error.
 */
export default class UnauthorizedError extends Error {
  /**
   * Error's name.
   */
  name = 'UnauthorizedError';

  /**
   * Constructs a new unauthorized error.
   */
  constructor() {
    super();
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
    this.message = 'Insufficient permissions to execute the procedure';
  }
}
