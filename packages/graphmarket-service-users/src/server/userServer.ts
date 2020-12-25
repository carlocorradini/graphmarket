import { ApolloServer, ServerInfo } from 'apollo-server';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { IContext, buildFederatedSchema } from '@graphmarket/commons';
import config from '@app/config';
import resolveUserReference from '../references/userReference';
import UserResolver from '../resolvers/UserResolver';
import User from '../entities/User';

const listen = async (port: number): Promise<ServerInfo> => {
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
    context: ({ req }): IContext => ({
      user: req.headers.user ? JSON.parse(req.headers.user as string) : undefined,
    }),
  });

  return server.listen({ port });
};

const connectDatabase = (): Promise<Connection> =>
  createConnection(<ConnectionOptions>{
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

export default { listen, connectDatabase };
