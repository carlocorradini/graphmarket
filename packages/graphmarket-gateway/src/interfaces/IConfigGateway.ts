import {
  IConfigNode,
  IConfigGraphQL,
  IConfigToken,
  IConfigRedis,
  IConfigService,
} from '@graphmarket/interfaces';

/**
 * Gateway configuration.
 */
export default interface IConfigGateway {
  readonly NODE: IConfigNode;
  readonly GRAPHQL: IConfigGraphQL;
  readonly TOKEN: IConfigToken;
  readonly REDIS: IConfigRedis;
  readonly SERVICES: {
    readonly AUTHENTICATIONS: IConfigService;
    readonly USERS: IConfigService;
    readonly PRODUCTS: IConfigService;
    readonly INVENTORIES: IConfigService;
    readonly PURCHASES: IConfigService;
  };
}
