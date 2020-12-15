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
   *
   * @param message - Error message
   */
  constructor(message?: string) {
    super();
    Object.setPrototypeOf(this, VerificationError.prototype);
    this.message = message || 'Verification missing to execute the procedure';
  }
}
