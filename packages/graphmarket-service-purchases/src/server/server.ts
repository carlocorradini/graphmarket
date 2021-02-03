import { AddressInfo } from 'net';
import Container from 'typedi';
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { buildFederatedSchema, buildService } from '@graphmarket/helpers';
import {
  Inventory,
  Product,
  Purchase,
  User,
  UserExternal,
  Review,
  ReviewExternal,
} from '@graphmarket/entities';
import {
  PurchaseResolver,
  resolvePurchaseReference,
  ReviewPurchaseResolver,
  UserPurchaseResolver,
} from '@app/resolvers';
import config from '@app/config';
import { URL } from 'url';
import { EmailAdapter } from '@graphmarket/adapters';

/**
 * Federated GraphQL schema.
 */
const schema = buildFederatedSchema(
  {
    resolvers: [PurchaseResolver, UserPurchaseResolver, ReviewPurchaseResolver],
    orphanedTypes: [Purchase, UserExternal, ReviewExternal],
    container: Container,
  },
  {
    Inventory: { __resolveReference: resolvePurchaseReference },
  },
);

/**
 * Service instance.
 */
const app = buildService({
  graphql: {
    schema,
    path: config.GRAPHQL.PATH,
    playground: config.GRAPHQL.PLAYGROUND,
  },
});

/**
 * Start listening at the given port.
 *
 * @param port - Listening port
 * @returns Address information
 */
const listen = (port: number): Promise<AddressInfo> =>
  new Promise((resolve, reject) => {
    const server = app
      .listen(port, () => {
        resolve(server.address() as AddressInfo);
      })
      .on('error', (error) => {
        reject(error);
      });
  });

/**
 * Create and returns a connection with the database.
 *
 * @returns Database connection
 */
const connectDatabase = (): Promise<Connection> => {
  const redisURL = new URL(config.REDIS.URL);

  return createConnection(<ConnectionOptions>{
    type: config.DATABASE.TYPE,
    url: config.DATABASE.URL,
    extra: {
      ssl: config.DATABASE.SSL,
    },
    synchronize: config.DATABASE.SYNCHRONIZE,
    dropSchema: config.DATABASE.DROP_SCHEMA,
    logging: config.DATABASE.LOGGING,
    entities: [Purchase, User, Inventory, Product, Review],
    cache: {
      type: 'ioredis',
      options: {
        host: redisURL.hostname,
        port: redisURL.port,
        password: redisURL.password,
      },
    },
  });
};

/**
 * Initialize the adapters used in the service.
 */
const initAdapters = (): Promise<void> => {
  Container.get(EmailAdapter).init(config.ADAPTERS.EMAIL.API_KEY);

  return Promise.resolve();
};

export default { listen, connectDatabase, initAdapters };
