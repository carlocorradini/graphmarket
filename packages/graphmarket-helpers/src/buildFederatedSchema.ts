import { GraphQLSchema, specifiedDirectives } from 'graphql';
import gql from 'graphql-tag';
import {
  printSchema,
  buildFederatedSchema as buildApolloFederationSchema,
} from '@apollo/federation';
import federationDirectives from '@apollo/federation/dist/directives';
import { addResolversToSchema, GraphQLResolverMap } from 'apollo-graphql';
import { BuildSchemaOptions, buildSchemaSync, createResolversMap } from 'type-graphql';
import { authorizationMiddleware } from '@graphmarket/middlewares';

/**
 * Build federated schema given the options.
 * Optionally pass a resolve reference object.
 *
 * @param options - Federated schema build options
 * @param referenceResolvers - Resolve reference object
 * @returns GraphQL federated schema
 */
const buildFederatedSchema = (
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
  referenceResolvers?: GraphQLResolverMap<any>,
): GraphQLSchema => {
  const schema = buildSchemaSync({
    ...options,
    directives: [...specifiedDirectives, ...federationDirectives, ...(options.directives || [])],
    skipCheck: true,
    authChecker: authorizationMiddleware,
    container: options.container,
  });

  const federatedSchema = buildApolloFederationSchema({
    typeDefs: gql(printSchema(schema)),
    resolvers: createResolversMap(schema) as any,
  });

  if (referenceResolvers) {
    addResolversToSchema(federatedSchema, referenceResolvers);
  }

  return federatedSchema;
};

export default buildFederatedSchema;
