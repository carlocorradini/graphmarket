import path from 'path';
import { graphql, Source } from 'graphql';
import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import { AuthorizationMiddleware } from '../../src/middlewares';
import { IToken } from '../../src/types';

export type Maybe<T> = null | undefined | T;

export interface IGraphQlRequest {
  source: Source | string;
  variables?: Maybe<{ [key: string]: any }>;
  token?: Partial<IToken>;
}

const schema = buildSchemaSync({
  resolvers: [path.resolve(__dirname, '../../src/graphql/resolvers/**/*.ts')],
  authChecker: AuthorizationMiddleware,
  container: Container,
});

export default async ({ source, variables, token }: IGraphQlRequest) =>
  graphql(
    schema,
    source,
    undefined,
    {
      user: token,
    },
    variables,
  );
