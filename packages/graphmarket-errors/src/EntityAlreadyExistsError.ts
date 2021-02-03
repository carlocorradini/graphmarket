/**
 * Entity already exists error.
 */
export default class EntityAlreadyExistsError extends Error {
  /**
   * Error's name.
   */
  name = 'EntityAlreadyExistsError';

  /**
   * Constructs a new Entity already exists error.
   *
   * @param message - Error's message
   */
  constructor(message?: string) {
    super();
    Object.setPrototypeOf(this, EntityAlreadyExistsError.prototype);
    this.message = message || 'Entity already exists';
  }
}
