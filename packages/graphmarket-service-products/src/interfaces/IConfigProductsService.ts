import {
  IConfigNode,
  IConfigGraphQL,
  IConfigDatabase,
  IConfigRedis,
  IConfigUploadAdapter,
} from '@graphmarket/interfaces';

/**
 * Products service configuration.
 */
export default interface IConfigProductsService {
  readonly NODE: IConfigNode;
  readonly GRAPHQL: IConfigGraphQL;
  readonly DATABASE: IConfigDatabase;
  readonly REDIS: IConfigRedis;
  readonly ADAPTERS: {
    readonly UPLOAD: IConfigUploadAdapter;
  };
}
