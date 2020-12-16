import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import { IServerModule, IContext } from '@app/types';
import config from '@app/config';
import logger from '@app/logger';
import { EnvUtil } from '@app/utils';
import { authorizationMiddleware } from '@app/middlewares';

const apollo = new ApolloServer({
  schema: buildSchemaSync({
    resolvers: [path.join(__dirname, '../..', config.GRAPHQL.RESOLVERS)],
    authChecker: authorizationMiddleware,
    container: Container,
  }),
  playground: config.GRAPHQL.PLAYGROUND,
  uploads: false,
  tracing: !EnvUtil.isProduction(),
  context: ({ req }) => {
    const context: IContext = {
      user: req.user,
    };
    return context;
  },
});

const graphqlModule: IServerModule = {
  start(): Promise<void> {
    logger.debug('GraphQL module started');
    return Promise.resolve();
  },
  async stop(): Promise<void> {
    logger.debug('GraphQL module stopped');
    return Promise.resolve();
  },
};

export default graphqlModule;
export { apollo };
