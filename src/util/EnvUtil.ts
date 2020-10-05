import env from '@app/config/env';

export default class EnvUtil {
  public static readonly ENV_PRODUCTION: string = 'production';

  public static readonly ENV_DEVELOPMENT: string = 'development';

  public static readonly ENV_TEST: string = 'test';

  public static getCurrent(): string | undefined {
    return process.env.NODE_ENV || env.NODE_ENV;
  }

  public static isProduction(): boolean {
    return this.getCurrent() === this.ENV_PRODUCTION;
  }

  public static isDevelopment(): boolean {
    return this.getCurrent() === this.ENV_DEVELOPMENT;
  }

  public static isTest(): boolean {
    return this.getCurrent() === this.ENV_TEST;
  }
}
