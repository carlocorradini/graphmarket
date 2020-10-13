import Redis from 'ioredis';
import logger from '@app/logger';
import config from '@app/config';

export default class CacheService extends Redis {
  private static instance?: CacheService;

  private constructor(url: string) {
    super(url);
  }

  public static mount(url: string): void {
    if (CacheService.instance) {
      logger.warn('Cache Service already mounted');
      return;
    }

    CacheService.instance = new CacheService(url);
    logger.info('Cache Service mounted');
  }

  public static async unmount(forced: boolean = false): Promise<void> {
    if (!CacheService.instance) {
      logger.warn('Cache Service is not mounted. Cannot unmount');
      return;
    }

    if (forced) CacheService.instance.disconnect();
    else await CacheService.instance.quit();

    CacheService.instance = undefined;
    logger.info('Cache Service unmounted');
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      logger.warn(
        'Cache Service is not mounted. Constructing instance using default configuration',
      );
      CacheService.mount(config.REDIS.URL);
    }

    return CacheService.instance!;
  }
}
