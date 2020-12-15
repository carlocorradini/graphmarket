/**
 * Verification error.
 */

export interface IVerificationErrorData {
  message?: string;
  userId?: string;
}

export default class VerificationError extends Error {
  /**
   * Error's name.
   */
  name = 'VerificationError';

  /**
   * User's id.
   */
  userId?: string;

  /**
   * Constructs a new verification error.
   *
   * @param message - Error message
   */
  constructor(errorData: IVerificationErrorData = {}) {
    super();
    Object.setPrototypeOf(this, VerificationError.prototype);
    this.message = errorData.message || 'Verification missing to execute the procedure';
    this.userId = errorData.userId;
  }
}
