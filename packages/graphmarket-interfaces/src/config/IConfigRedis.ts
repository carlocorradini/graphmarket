/**
 * Redis configuration.
 */
export default interface IConfigRedis {
  readonly URL: string;
  readonly TOKEN_BLACKLIST?: string;
}
