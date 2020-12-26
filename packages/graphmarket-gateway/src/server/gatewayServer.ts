import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer, ServerInfo } from 'apollo-server';
import config from '@app/config';
import { IGatewayContext } from '@app/interfaces';
import serviceList from './serviceList';

const listen = async (port: number): Promise<ServerInfo> => {
  const gateway = new ApolloGateway({
    serviceList,
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }: { request: any; context: IGatewayContext }) {
          if (context.token) {
            request.http.headers.authorization = context.token;
          }
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
    context: ({ req }): IGatewayContext => ({
      token: req.headers.authorization,
    }),
  });

  return server.listen({ port });
};

export default { listen };
