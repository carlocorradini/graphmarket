export default async () => {
  process.env.DATABASE_URL = `postgres://${
    process.env.POSTGRES_USER ? process.env.POSTGRES_USER : 'postgres'
  }:${process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : 'password'}@${
    process.env.POSTGRES_HOST ? process.env.POSTGRES_HOST : 'localhost'
  }:${process.env.POSTGRES_PORT ? process.env.POSTGRES_PORT : 5432}/${
    process.env.POSTGRES_DB ? process.env.POSTGRES_DB : 'graphmarket-test'
  }`;

  process.env.REDIS_URL = `redis://:@${
    process.env.REDIS_HOST ? process.env.REDIS_HOST : 'localhost'
  }:${process.env.REDIS_PORT ? process.env.REDIS_PORT : 6379}/1`;

  process.env.JWT_SECRET = 'secret';
};
