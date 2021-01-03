import FileUploadDataSource from '@profusion/apollo-federation-upload';
import { FileUploadDataSourceArgs } from '@profusion/apollo-federation-upload/build/FileUploadDataSource';

/**
 * Upload datasource.
 * Used when a service needs upload support.
 */
export default class UploadDataSource extends FileUploadDataSource {
  /**
   * Construct a new upload datasource.
   *
   * @param config - Datasource configuration
   */
  public constructor(config?: FileUploadDataSourceArgs) {
    super(config);
  }
}
