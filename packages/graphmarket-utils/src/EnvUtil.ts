import path from 'path';
import dotenv from 'dotenv';
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
   * Load the '.env' file based on the current environment.
   * .env file used in production & development environment.
   * .env.test file used in test environment.
   * Otherwise it does not load any '.env' file.
   */
  public static loadDotEnvFile(): void {
    let dotEnvPath: string;

    switch (EnvUtil.getCurrentEnv()) {
      case EnvUtil.ENV_PRODUCTION:
      case EnvUtil.ENV_DEVELOPMENT:
        dotEnvPath = '.env';
        break;
      case EnvUtil.ENV_TEST:
        dotEnvPath = '.env.test';
        break;
      default:
        // Skip .env file loading
        return;
    }

    dotenv.config({ path: path.resolve(process.cwd(), dotEnvPath) });
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
