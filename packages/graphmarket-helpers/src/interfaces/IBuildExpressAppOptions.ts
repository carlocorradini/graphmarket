/**
 * Build express app options.
 */
export default interface IBuildExpressAppOptions {
  graphql: {
    path: string;
    playground?: boolean;
  };
  upload?: {
    maxFileSize: number;
    maxFiles: number;
  };
  token?: {
    secret: string;
    algorithm: string;
  };
  redis?: {
    url: string;
  };
}
