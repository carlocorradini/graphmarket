import {
  IConfigNode,
  IConfigGraphQL,
  IConfigDatabase,
  IConfigRedis,
} from '@graphmarket/interfaces';

/**
 * Inventories service configuration.
 */
export default interface IConfigInventoriesService {
  readonly NODE: IConfigNode;
  readonly GRAPHQL: IConfigGraphQL;
  readonly DATABASE: IConfigDatabase;
  readonly REDIS: IConfigRedis;
}
