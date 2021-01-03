/* eslint-disable class-methods-use-this */
import { GraphQLRequestContext, ValueOrPromise } from 'apollo-server-types';
import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { IGraphQLContext } from '@graphmarket/interfaces';

/**
 * Authenticated datasource.
 * Used when a service needs authentication support.
 */
export default class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  /**
   * Construct a new authenticated datasource.
   *
   * @param config - Datasource configuration
   */
  public constructor(
    config?: Partial<RemoteGraphQLDataSource<IGraphQLContext>> &
      object &
      ThisType<RemoteGraphQLDataSource<IGraphQLContext>>,
  ) {
    super(config);
  }

  /**
   * Modify each fetch request adding the user token (if present) before it's sent to the service.
   *
   * @param param0 - Request context
   */
  public willSendRequest?({
    request,
    context,
  }: Pick<GraphQLRequestContext<IGraphQLContext>, 'request' | 'context'>): ValueOrPromise<void> {
    if (context.user) request.http?.headers.set('user', JSON.stringify(context.user));
  }
}
