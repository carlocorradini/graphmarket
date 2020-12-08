/**
 * Environment utilities.
 */
export default class EnvUtil {
  /**
   * Production environment identifier.
   */
  public static readonly ENV_PRODUCTION: string = 'production';

  /**
   * Development environment identifier.
   */
  public static readonly ENV_DEVELOPMENT: string = 'development';

  /**
   * Test environment identifier.
   */
  public static readonly ENV_TEST: string = 'test';

  /**
   * Return the current environment.
   *
   * @returns Current environment
   */
  public static getCurrentEnv(): string | undefined {
    return process.env.NODE_ENV;
  }

  /**
   * Check if the current environment is production.
   *
   * @returns True if production, false otherwise
   */
  public static isProduction(): boolean {
    return this.getCurrentEnv() === EnvUtil.ENV_PRODUCTION;
  }

  /**
   * Check if the current environment is development.
   *
   * @returns True if development, false otherwise
   */
  public static isDevelopment(): boolean {
    return this.getCurrentEnv() === EnvUtil.ENV_DEVELOPMENT;
  }

  /**
   * Check if the current environment is test.
   *
   * @returns True if test, false otherwise
   */
  public static isTest(): boolean {
    return this.getCurrentEnv() === EnvUtil.ENV_TEST;
  }
}
