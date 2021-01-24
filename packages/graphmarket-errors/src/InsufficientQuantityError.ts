/**
 * Insufficient quantity error.
 */
export default class InsufficientQuantityError extends Error {
  /**
   * Error's name.
   */
  name = 'InsufficientQuantityError';

  /**
   * Constructs a new insufficient quantity error.
   */
  constructor() {
    super();
    Object.setPrototypeOf(this, InsufficientQuantityError.prototype);
    this.message = 'Insufficient quantity';
  }
}
