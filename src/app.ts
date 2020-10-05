import 'reflect-metadata';
import '@app/config/env';
import path from 'path';
import { createConnection, ConnectionOptions, useContainer } from 'typeorm';
import { ApolloServer } from 'apollo-server';
import { Container } from 'typedi';
import { buildSchema } from 'type-graphql';
import config from '@app/config';
import logger from '@app/logger';

const boostrap = async () => {
  try {
    useContainer(Container);

    const schema = await buildSchema({
      resolvers: [path.join(__dirname, config.GRAPHQL.RESOLVERS)],
      container: Container,
      validate: true,
    });

    logger.debug('GraphQL schema built');

    const server = new ApolloServer({
      schema,
      playground: config.GRAPHQL.PLAYGROUND,
    });

    logger.debug('Server configured');

    await createConnection(<ConnectionOptions>{
      type: config.DATABASE.TYPE,
      url: config.DATABASE.URL,
      extra: {
        ssl: config.DATABASE.SSL,
      },
      synchronize: config.DATABASE.SYNCHRONIZE,
      logging: config.DATABASE.LOGGING,
      entities: [path.join(__dirname, config.DATABASE.ENTITIES)],
      migrations: [path.join(__dirname, config.DATABASE.MIGRATIONS)],
      subscribers: [path.join(__dirname, config.DATABASE.SUBSCRIBERS)],
    });

    logger.debug('Database connected');

    const serverInfo = await server.listen(config.NODE.PORT);

    logger.info(`Server running at ${serverInfo.url} on port ${serverInfo.port}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

boostrap();
