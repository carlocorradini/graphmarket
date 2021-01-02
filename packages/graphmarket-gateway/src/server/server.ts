import { AddressInfo } from 'net';
import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { buildExpressApp } from '@graphmarket/helpers';
import { IGraphQLContext } from '@graphmarket/interfaces';
import config from '@app/config';
import { AuthenticatedUploadDataSource } from '@app/datasources';
import serviceList from './serviceList';

const gateway: ApolloGateway = new ApolloGateway({
  serviceList,
  buildService: ({ url }) => new AuthenticatedUploadDataSource({ url, useChunkedTransfer: true }),
  __exposeQueryPlanExperimental: false,
});

const server: ApolloServer = new ApolloServer({
  gateway,
  playground: config.GRAPHQL.PLAYGROUND,
  uploads: true,
  subscriptions: false,
  context: ({ req }): IGraphQLContext => ({
    user: req.user,
  }),
});

const app = buildExpressApp({
  graphql: { path: config.GRAPHQL.PATH },
  token: { secret: config.TOKEN.SECRET, algorithm: config.TOKEN.ALGORITHM },
  redis: { url: config.REDIS.URL },
});

server.applyMiddleware({
  app,
  path: config.GRAPHQL.PATH,
});

const listen = (port: number): Promise<AddressInfo> =>
  new Promise((resolve, reject) => {
    const serverGateway = app
      .listen(port, () => {
        resolve(serverGateway.address() as AddressInfo);
      })
      .on('error', (error) => {
        reject(error);
      });
  });

export default { listen };
