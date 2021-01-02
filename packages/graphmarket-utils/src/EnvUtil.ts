/**
 * Environment utility.
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
   * If 'NODE_ENV' is not defined return 'production'.
   *
   * @returns Current environment
   */
  public static getCurrentEnv(): string {
    return process.env.NODE_ENV || EnvUtil.ENV_PRODUCTION;
  }

  /**
   * Return the path to the file that is parsed by dotenv.
   * Null skip dotenv processing entirely and only load from process.env.
   * '.env' load .env file used in development environment.
   * '.env.test' load .env.test file used in test environment.
   *
   * @returns Path to the file that is parsed by dotenv
   */
  public static getDotEnvPath(): string | null {
    switch (EnvUtil.getCurrentEnv()) {
      case EnvUtil.ENV_PRODUCTION: {
        return null;
      }
      case EnvUtil.ENV_DEVELOPMENT: {
        return '.env';
      }
      case EnvUtil.ENV_TEST: {
        return '.env.test';
      }
      default: {
        return null;
      }
    }
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
