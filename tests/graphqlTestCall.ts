import { graphql } from 'graphql';
import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import { UserResolver } from '../src/graphql/resolvers';
import { AuthorizationMiddleware } from '../src/middlewares';
import { IJWT } from '../src/types';

const schema = buildSchemaSync({
  resolvers: [UserResolver],
  authChecker: AuthorizationMiddleware,
  container: Container,
});

const graphqlTestCall = async (query: any, variables?: any, token?: Partial<IJWT>) => {
  return graphql(
    schema,
    query,
    undefined,
    {
      user: token,
    },
    variables,
  );
};

export default graphqlTestCall;
