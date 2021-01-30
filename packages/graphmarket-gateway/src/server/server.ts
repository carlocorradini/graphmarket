import { AddressInfo } from 'net';
import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { buildExpressApp } from '@graphmarket/helpers';
import { IGraphQLContext } from '@graphmarket/interfaces';
import config from '@app/config';
import { services, buildServiceDatasource } from '@app/services';

/**
 * Express app instance.
 */
const app = buildExpressApp({
  graphql: { path: config.GRAPHQL.PATH },
  token: { secret: config.TOKEN.SECRET, algorithm: config.TOKEN.ALGORITHM },
  redis: { url: config.REDIS.URL },
});

/**
 * Start listening at the given port.
 *
 * @param port - Listening port
 * @returns Address information
 */
const listen = (port: number): Promise<AddressInfo> => {
  /**
   * Apollo gateway instance.
   */
  const gateway: ApolloGateway = new ApolloGateway({
    serviceList: services,
    buildService: ({ url }) => buildServiceDatasource(url),
    __exposeQueryPlanExperimental: false,
  });

  /**
   * Apollo server instance.
   */
  const server: ApolloServer = new ApolloServer({
    gateway,
    playground: config.GRAPHQL.PLAYGROUND,
    uploads: true,
    subscriptions: false,
    context: ({ req }): IGraphQLContext => ({
      user: req.user,
    }),
  });

  server.applyMiddleware({
    app,
    path: config.GRAPHQL.PATH,
  });

  return new Promise((resolve, reject) => {
    const serverGateway = app
      .listen(port, () => {
        resolve(serverGateway.address() as AddressInfo);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

export default { listen };
