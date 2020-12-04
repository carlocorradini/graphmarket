import { graphql, Source } from 'graphql';
import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import { UserResolver } from '../src/graphql/resolvers';
import { AuthorizationMiddleware } from '../src/middlewares';
import { IJWT } from '../src/types';

export type Maybe<T> = null | undefined | T;

const schema = buildSchemaSync({
  resolvers: [UserResolver],
  authChecker: AuthorizationMiddleware,
  container: Container,
});

const graphqlTestCall = async (
  source: Source | string,
  variables?: Maybe<{ [key: string]: any }>,
  token?: Partial<IJWT>,
) => {
  return graphql(
    schema,
    source,
    undefined,
    {
      user: token,
    },
    variables,
  );
};

export default graphqlTestCall;
