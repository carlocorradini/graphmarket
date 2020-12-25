import { ApolloServer, ServerInfo } from 'apollo-server';
import { createConnection, ConnectionOptions } from 'typeorm';
import { IContext, buildFederatedSchema } from '@graphmarket/commons';
import config from '@app/config';
import resolveUserReference from '../references/userReference';
import UserResolver from '../resolvers/UserResolver';
import User from '../entities/User';

const listen = async (port: number): Promise<ServerInfo> => {
  await createConnection(<ConnectionOptions>{
    type: config.DATABASE.TYPE,
    url: config.DATABASE.URL,
    extra: {
      ssl: config.DATABASE.SSL,
    },
    synchronize: config.DATABASE.SYNCHRONIZE,
    dropSchema: config.DATABASE.DROP_SCHEMA,
    logging: config.DATABASE.LOGGING,
    entities: [User],
    migrations: [],
    subscribers: [],
    cache: {
      type: 'ioredis',
      port: config.REDIS.URL,
    },
  });

  const schema = await buildFederatedSchema(
    {
      resolvers: [UserResolver],
      orphanedTypes: [User],
    },
    {
      User: { __resolveReference: resolveUserReference },
    },
  );

  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: config.GRAPHQL.PLAYGROUND,
    context: ({ req }) => {
      const context: IContext = {
        user: req.headers.user ? JSON.parse(req.headers.user as string) : undefined,
      };
      return context;
    },
  });

  return server.listen({ port });
};

export default { listen };
