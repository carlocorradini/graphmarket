import { ApolloServer } from 'apollo-server-express';
import { Express } from 'express';
import { IBuildServiceOptions } from '@app/interfaces';
import buildExpressApp from './buildExpressApp';
import buildApolloServer from './buildApolloServer';

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
