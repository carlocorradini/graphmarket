import { GraphQLSchema } from 'graphql';

/**
 * Build apollo server options.
 */
export default interface IBuildApolloServerOptions {
  graphql: {
    schema: GraphQLSchema;
    playground: boolean;
  };
}
