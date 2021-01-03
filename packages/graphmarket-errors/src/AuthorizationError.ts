/**
 * Authorization error.
 */
export default class AuthorizationError extends Error {
  /**
   * Error's name.
   */
  name = 'AuthorizationError';

  /**
   * Constructs a new Authorization error.
   */
  constructor() {
    super();
    Object.setPrototypeOf(this, AuthorizationError.prototype);
    this.message = 'Insufficient permissions to execute the procedure';
  }
}
