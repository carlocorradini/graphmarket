/* eslint-disable class-methods-use-this */
import { FileUploadDataSourceArgs } from '@profusion/apollo-federation-upload/build/FileUploadDataSource';
import { GraphQLRequestContext, ValueOrPromise } from 'apollo-server-types';
import { IGraphQLContext } from '@graphmarket/interfaces';
import UploadDataSource from './UploadDataSource';

export default class AuthenticatedUploadDataSource extends UploadDataSource {
  public constructor(config?: FileUploadDataSourceArgs) {
    super(config);
  }

  public willSendRequest?({
    request,
    context,
  }: Pick<GraphQLRequestContext<IGraphQLContext>, 'request' | 'context'>): ValueOrPromise<void> {
    if (context.user) request.http?.headers.set('user', JSON.stringify(context.user));
  }
}
