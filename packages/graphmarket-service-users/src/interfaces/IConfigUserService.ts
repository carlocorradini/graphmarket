import {
  IConfigNode,
  IConfigGraphQL,
  IConfigToken,
  IConfigDatabase,
  IConfigRedis,
} from '@graphmarket/interfaces';

/**
 * User service configuration.
 */
export default interface IConfigUserService {
  readonly NODE: IConfigNode;
  readonly GRAPHQL: IConfigGraphQL;
  readonly TOKEN: IConfigToken & {
    EXPIRATION_TIME: number;
  };
  readonly DATABASE: IConfigDatabase;
  readonly REDIS: IConfigRedis;
  readonly ADAPTERS: {
    readonly UPLOAD: {
      readonly MAX_FILE_SIZE: number;
      readonly MAX_FILES: number;
    };
  };
}
