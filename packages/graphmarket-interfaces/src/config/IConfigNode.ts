/**
 * Node configuration.
 */
export default interface IConfigNode {
  readonly ENV: 'production' | 'development' | 'test';
  readonly PORT: number;
}
