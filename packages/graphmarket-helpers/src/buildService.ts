import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { IBuildServiceOptions } from '@app/interfaces';
import buildExpressApp from './buildExpressApp';
import buildApolloServer from './buildApolloServer';

/**
 * Build a service express application.
 * Internally uses express and apollo server to build the service.
 *
 * @param options - Service build options.
 * @see buildExpressApp
 * @see buildApolloServer
 */
const buildService = (options: IBuildServiceOptions): Express => {
  const app: Express = buildExpressApp({ ...options });
  const server: ApolloServer = buildApolloServer({ ...options });

  server.applyMiddleware({
    app,
    path: options.graphql.path,
  });

  return app;
};

export default buildService;
