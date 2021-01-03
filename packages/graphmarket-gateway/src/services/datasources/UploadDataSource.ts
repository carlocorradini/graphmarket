import FileUploadDataSource from '@profusion/apollo-federation-upload';
import { FileUploadDataSourceArgs } from '@profusion/apollo-federation-upload/build/FileUploadDataSource';

export default class UploadDataSource extends FileUploadDataSource {
  public constructor(config?: FileUploadDataSourceArgs) {
    super(config);
  }
}
