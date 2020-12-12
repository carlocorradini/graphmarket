// --- ALWAYS FIRST
import config from '@app/config';
import IORedis from 'ioredis';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';

// --- END

/**
 * Attempts to connect to Redis, and then disconnects.
 */
async function testRedis() {
  return new Promise((resolve, reject) => {
    const redis = new IORedis(config.REDIS.URL);
    redis.on('connect', () => {
      redis.disconnect();
      resolve(undefined);
    });
    redis.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Attempts to connect to the database, and then disconnects.
 */
async function testDatabase() {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const conn: Connection = await createConnection(<ConnectionOptions>{
          type: 'postgres',
          url: config.DATABASE.URL,
          synchronize: false,
          dropSchema: false,
          logging: false,
          ssl: false,
        });
        await conn.close();
        resolve(undefined);
      } catch (e) {
        reject(e);
      }
    })();
  });
}

export default async () => {
  try {
    await testRedis();
    console.log('Redis can be connected.');
  } catch (err) {
    console.error('Error while connecting to Redis');
    throw err;
  }

  try {
    await testDatabase();
    console.log('Database can be connected');
  } catch (err) {
    console.error('Error while connecting to the database');
    throw err;
  }
};
