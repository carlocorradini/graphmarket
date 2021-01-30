/* eslint-disable no-await-in-loop */
import axios from 'axios';
import logger from '@graphmarket/logger';
import { UrlUtil, ThreadUtil } from '@graphmarket/utils';
import IService from '@app/interfaces/IService';
import services from './services';

/**
 * Check healths options interface.
 */
export interface ICheckHealthsOptions {
  healthCheckEndpoint: string;
  maxRetryAttempts: number;
  sleep: number | undefined;
}

/**
 * Reverse the keys of the array arr.
 *
 * @param arr - Array to reverse the keys from
 */
function* reverseKeys(arr: any[]) {
  let key = arr.length - 1;

  while (key >= 0) {
    yield key;
    key -= 1;
  }
}

/**
 * Performs a health check on all available services.
 *
 * @param param0 - Configuration options
 */
export default async function chechHealths(
  { healthCheckEndpoint, maxRetryAttempts, sleep }: ICheckHealthsOptions = {
    healthCheckEndpoint: '/.well-known/apollo/server-health',
    maxRetryAttempts: 3,
    sleep: 3000,
  },
): Promise<void> {
  const servicesToCheck: IService[] = services.map((service) => ({
    ...service,
    url: UrlUtil.removeTrailingSlash(UrlUtil.baseUrl(service.url)!).concat(healthCheckEndpoint),
  }));
  let attempt;

  for (attempt = 0; attempt < maxRetryAttempts && servicesToCheck.length > 0; attempt += 1) {
    logger.info(`Health checks attempt ${attempt + 1}`);

    // eslint-disable-next-line no-restricted-syntax
    for (const index of reverseKeys(servicesToCheck)) {
      const service = servicesToCheck[index];
      logger.debug(`Checking service ${service.name} availability`);

      try {
        await axios.get(service.url);
        logger.info(`Service ${service.name} is online`);
        servicesToCheck.splice(index, 1);
      } catch (error) {
        logger.warn(`Service ${service.name} health check failed: ${error.message}`);
      }
    }

    if (servicesToCheck.length > 0) {
      // Check failed
      logger.warn(
        `Health checks attempt ${attempt + 1} failed. ${
          servicesToCheck.length
        } services are not available`,
      );

      // Sleep ?
      if (sleep) {
        logger.debug(`Sleep for ${sleep} ms...`);
        await ThreadUtil.sleep(sleep);
      }
    }
  }

  // Health checks failed
  if (servicesToCheck.length > 0)
    throw new Error(`Health checks failed: ${servicesToCheck.length} services are not available`);
}
