import { ApolloServer } from 'apollo-server-express';
import { IBuildApolloServerOptions } from '@app/interfaces';
import { IGraphQLContext } from '@graphmarket/interfaces';

/**
 * Build apollo server given the options.
 *
 * @param options - Apollo server build options
 * @returns Apollo server instance
 */
const buildApolloServer = (options: IBuildApolloServerOptions): ApolloServer => {
  const server = new ApolloServer({
    schema: options.graphql.schema,
    playground: options.graphql.playground,
    uploads: false,
    subscriptions: false,
    context: ({ req }): IGraphQLContext => ({
      user: req.headers.user ? JSON.parse(req.headers.user as string) : undefined,
    }),
  });

  return server;
};

export default buildApolloServer;
