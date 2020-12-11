import path from 'path';
import { graphql, Source } from 'graphql';
import { buildSchemaSync } from 'type-graphql';
import { Container } from 'typedi';
import { IToken } from '@app/types';
import { authorizationMiddleware } from '@app/middlewares';

export type Maybe<T> = null | undefined | T;

export interface IGraphQlRequest {
  source: Source | string;
  variables?: Maybe<{ [key: string]: any }>;
  token?: Partial<IToken>;
}

const schema = buildSchemaSync({
  resolvers: [path.resolve(__dirname, '../../src/graphql/resolvers/**/*.ts')],
  authChecker: authorizationMiddleware,
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
