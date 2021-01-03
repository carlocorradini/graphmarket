import { RemoteGraphQLDataSource } from '@apollo/gateway';
import IService from '@app/interfaces/IService';
import {
  AuthenticatedDataSource,
  AuthenticatedUploadDataSource,
  UploadDataSource,
} from './datasources';
import services from './services';

/**
 * Given a service url returns the corresponding datasource following the service configuration.
 *
 * @param url - Service url
 * @returns The service datasource
 * @see services
 */
const buildServiceDatasource = (url: string | undefined): RemoteGraphQLDataSource => {
  const service: IService | undefined = services.find((s) => s.url === url);
  let datasource: RemoteGraphQLDataSource = new RemoteGraphQLDataSource({ url });

  if (!service || !service.features) datasource = new RemoteGraphQLDataSource({ url });
  else if (service.features.authentication && service.features.upload)
    datasource = new AuthenticatedUploadDataSource({ url, useChunkedTransfer: true });
  else if (service.features.authentication) datasource = new AuthenticatedDataSource({ url });
  else if (service.features.upload)
    datasource = new UploadDataSource({ url, useChunkedTransfer: true });

  return datasource;
};

export default buildServiceDatasource;
