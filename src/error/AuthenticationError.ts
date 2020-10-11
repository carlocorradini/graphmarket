export default class AuthenticationError extends Error {
  name = 'AuthenticationError';

  constructor() {
    super();
    Object.setPrototypeOf(this, AuthenticationError.prototype);
    this.message = 'Invalid username and/or password';
  }
}
