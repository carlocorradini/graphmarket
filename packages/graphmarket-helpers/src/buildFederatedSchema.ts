import { specifiedDirectives } from 'graphql';
import gql from 'graphql-tag';
import {
  printSchema,
  buildFederatedSchema as buildApolloFederationSchema,
} from '@apollo/federation';
import federationDirectives from '@apollo/federation/dist/directives';
import { addResolversToSchema, GraphQLResolverMap } from 'apollo-graphql';
import { buildSchema, BuildSchemaOptions, createResolversMap } from 'type-graphql';
import Container from 'typedi';
import { authorizationMiddleware } from '@graphmarket/middlewares';

const buildFederatedSchema = async (
  options: Omit<BuildSchemaOptions, 'skipCheck'>,
  referenceResolvers?: GraphQLResolverMap<any>,
) => {
  const schema = await buildSchema({
    ...options,
    directives: [...specifiedDirectives, ...federationDirectives, ...(options.directives || [])],
    skipCheck: true,
    authChecker: authorizationMiddleware,
    container: Container,
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
