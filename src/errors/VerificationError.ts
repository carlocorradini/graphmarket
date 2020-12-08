/**
 * Verification error.
 */
export default class VerificationError extends Error {
  /**
   * Error's name.
   */
  name = 'VerificationError';

  /**
   * Constructs a new verification error.
   */
  constructor() {
    super();
    Object.setPrototypeOf(this, VerificationError.prototype);
    this.message = 'Verification missing to execute the procedure';
  }
}
