import {
  IConfigNode,
  IConfigGraphQL,
  IConfigDatabase,
  IConfigRedis,
} from '@graphmarket/interfaces';

/**
 * Reviews service configuration.
 */
export default interface IConfigReviewsService {
  readonly NODE: IConfigNode;
  readonly GRAPHQL: IConfigGraphQL;
  readonly DATABASE: IConfigDatabase;
  readonly REDIS: IConfigRedis;
}
