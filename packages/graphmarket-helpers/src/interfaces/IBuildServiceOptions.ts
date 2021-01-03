import { GraphQLSchema } from 'graphql';

/**
 * Build service options.
 */
export default interface IBuildServiceOptions {
  graphql: {
    schema: GraphQLSchema;
    path: string;
    playground: boolean;
  };
  upload?: {
    maxFileSize: number;
    maxFiles: number;
  };
}
