import {
  IConfigNode,
  IConfigGraphQL,
  IConfigToken,
  IConfigRedis,
  IConfigPhoneAdapter,
  IConfigEmailAdapter,
  IConfigDatabase,
} from '@graphmarket/interfaces';

/**
 * Authentication service configuration.
 */
export default interface IConfigAuthenticationsService {
  readonly NODE: IConfigNode;
  readonly GRAPHQL: IConfigGraphQL;
  readonly TOKEN: IConfigToken & {
    EXPIRATION_TIME: number;
  };
  readonly DATABASE: IConfigDatabase;
  readonly REDIS: IConfigRedis;
  readonly ADAPTERS: {
    readonly PHONE: IConfigPhoneAdapter;
    readonly EMAIL: IConfigEmailAdapter;
  };
}
