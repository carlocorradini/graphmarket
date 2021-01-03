/* eslint-disable class-methods-use-this */
import { FileUploadDataSourceArgs } from '@profusion/apollo-federation-upload/build/FileUploadDataSource';
import { GraphQLRequestContext, ValueOrPromise } from 'apollo-server-types';
import { IGraphQLContext } from '@graphmarket/interfaces';
import UploadDataSource from './UploadDataSource';

/**
 * Authenticated upload datasource.
 * Used when a service needs authenticattion and upload support.
 */
export default class AuthenticatedUploadDataSource extends UploadDataSource {
  /**
   * Construct a new authenticated upload datasource.
   *
   * @param config - Datasource configuration
   */
  public constructor(config?: FileUploadDataSourceArgs) {
    super(config);
  }

  /**
   * Modify each fetch request adding the user token (if present) and the upload file/s (if present/s) before it's sent to the service.
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
