import { graphql } from 'graphql';
import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import { UserResolver } from '../src/graphql/resolvers';
import { AuthorizationMiddleware } from '../src/middlewares';

const schema = buildSchemaSync({
  resolvers: [UserResolver],
  authChecker: AuthorizationMiddleware,
  container: Container,
});

const graphqlTestCall = async (query: any, variables?: any) => {
  return graphql(schema, query, undefined, {}, variables);
};

export default graphqlTestCall;
