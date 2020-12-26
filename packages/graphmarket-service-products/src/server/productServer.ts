import { ApolloServer, ServerInfo } from 'apollo-server';
import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { Product } from '@graphmarket/entities';
import { buildFederatedSchema } from '@graphmarket/helpers';
import { IGraphQLContext } from '@graphmarket/interfaces';
import config from '@app/config';
import resolveProductReference from '@app/references/productReference';
import ProductResolver from '@app/resolvers/ProductResolver';

const listen = async (port: number): Promise<ServerInfo> => {
  const schema = await buildFederatedSchema(
    {
      resolvers: [ProductResolver],
      orphanedTypes: [Product],
    },
    {
      Product: { __resolveReference: resolveProductReference },
    },
  );

  const server = new ApolloServer({
    schema,
    tracing: false,
    playground: config.GRAPHQL.PLAYGROUND,
    context: ({ req }): IGraphQLContext => ({
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
    entities: [Product],
    migrations: [],
    subscribers: [],
    cache: {
      type: 'ioredis',
      port: config.REDIS.URL,
    },
  });

export default { listen, connectDatabase };
