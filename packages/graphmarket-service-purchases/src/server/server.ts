import { AddressInfo } from 'net';
import Container from 'typedi';
import { Connection, createConnection, ConnectionOptions } from 'typeorm';
import { buildFederatedSchema, buildService } from '@graphmarket/helpers';
import { Inventory, Product, Purchase, User } from '@graphmarket/entities';
import config from '@app/config';
import { PurchaseResolver, resolvePurchaseReference } from '@app/resolvers';

/**
 * Federated GraphQL schema.
 */
const schema = buildFederatedSchema(
  {
    resolvers: [PurchaseResolver],
    orphanedTypes: [Purchase],
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
    entities: [Purchase, User, Inventory, Product],
    cache: {
      type: 'ioredis',
      port: config.REDIS.URL,
    },
  });

export default { listen, connectDatabase };
