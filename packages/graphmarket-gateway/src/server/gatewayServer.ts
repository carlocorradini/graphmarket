import { AddressInfo } from 'net';
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { buildExpressApp } from '@graphmarket/helpers';
import { IGraphQLContext } from '@graphmarket/interfaces';
import config from '@app/config';
import serviceList from './serviceList';

const listen = async (port: number): Promise<AddressInfo> => {
  const gateway = new ApolloGateway({
    serviceList,
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }: { request: any; context: IGraphQLContext }) {
          request.http.headers.set('user', context.user ? JSON.stringify(context.user) : null);
        },
      });
    },
    __exposeQueryPlanExperimental: false,
  });

  const server = new ApolloServer({
    gateway,
    playground: config.GRAPHQL.PLAYGROUND,
    uploads: false,
    subscriptions: false,
    context: ({ req }): IGraphQLContext => ({
      user: req.user,
    }),
  });

  const app = buildExpressApp({
    graphql: { path: config.GRAPHQL.PATH },
    token: { secret: config.TOKEN.SECRET, algorithm: config.TOKEN.ALGORITHM },
    redis: { url: config.REDIS.URL, tokenBlacklist: config.REDIS.TOKEN_BLACKLIST! },
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
