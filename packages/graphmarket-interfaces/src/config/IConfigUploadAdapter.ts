/**
 * Upload adapter configuration.
 */
export default interface IConfigUploadAdapter {
  readonly CLOUD_NAME: string;
  readonly API_KEY: string;
  readonly API_SECRET: string;
  readonly FOLDER: string;
  readonly MAX_FILE_SIZE: number;
  readonly MAX_FILES: number;
}
