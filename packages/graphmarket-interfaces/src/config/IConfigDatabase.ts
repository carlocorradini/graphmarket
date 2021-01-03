/**
 * Database configuration.
 */
export default interface IConfigDatabase {
  readonly TYPE: string;
  readonly URL: string;
  readonly SSL: boolean;
  readonly SYNCHRONIZE: boolean;
  readonly DROP_SCHEMA: boolean;
  readonly LOGGING: boolean;
}
