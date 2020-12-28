/* eslint-disable class-methods-use-this */
import { GraphQLRequestContext, ValueOrPromise } from 'apollo-server-types';
import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { IGraphQLContext } from '@graphmarket/interfaces';

export default class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  public constructor(
    config?: Partial<RemoteGraphQLDataSource<IGraphQLContext>> &
      object &
      ThisType<RemoteGraphQLDataSource<IGraphQLContext>>,
  ) {
    super(config);
  }

  public willSendRequest?({
    request,
    context,
  }: Pick<GraphQLRequestContext<IGraphQLContext>, 'request' | 'context'>): ValueOrPromise<void> {
    if (context.user) request.http?.headers.set('user', JSON.stringify(context.user));
  }
}
