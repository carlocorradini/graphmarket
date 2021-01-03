import {
  IConfigNode,
  IConfigGraphQL,
  IConfigDatabase,
  IConfigRedis,
  IConfigUploadAdapter,
} from '@graphmarket/interfaces';

/**
 * User service configuration.
 */
export default interface IConfigUserService {
  readonly NODE: IConfigNode;
  readonly GRAPHQL: IConfigGraphQL;
  readonly DATABASE: IConfigDatabase;
  readonly REDIS: IConfigRedis;
  readonly ADAPTERS: {
    readonly UPLOAD: IConfigUploadAdapter;
  };
}
