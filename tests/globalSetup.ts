// --- ALWAYS FIRST
import config from '@app/config';
import IORedis from 'ioredis';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import logger from '@app/logger';

// --- END

/**
 * Attempts to connect to Redis, and then disconnects.
 */
async function testRedis(): Promise<void> {
  return new Promise((resolve, reject) => {
    const redis = new IORedis(config.REDIS.URL);
    redis.on('connect', () => {
      redis.disconnect();
      resolve();
    });
    redis.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Attempts to connect to the database, and then disconnects.
 */
async function testDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const conn: Connection = await createConnection(<ConnectionOptions>{
          type: 'postgres',
          url: config.DATABASE.URL,
          synchronize: false,
          dropSchema: false,
          logging: false,
          ssl: config.DATABASE.SSL,
        });
        await conn.close();
        resolve();
      } catch (e) {
        reject(e);
      }
    })();
  });
}

export default async () => {
  try {
    await testRedis();
    logger.debug('Redis can be connected.');
  } catch (err) {
    logger.error('Error while connecting to Redis');
    throw err;
  }

  try {
    await testDatabase();
    logger.debug('Database can be connected');
  } catch (err) {
    logger.error('Error while connecting to the database');
    throw err;
  }
};
