/**
 * Authentication error.
 */
export default class AuthenticationError extends Error {
  /**
   * Error's name.
   */
  name = 'AuthenticationError';

  /**
   * Constructs a new authentication error.
   */
  constructor() {
    super();
    Object.setPrototypeOf(this, AuthenticationError.prototype);
    this.message = 'Invalid username and/or password';
  }
}
