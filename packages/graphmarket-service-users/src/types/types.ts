export interface IConfig {
  readonly NODE: {
    readonly ENV: 'production' | 'development' | 'test';
    readonly PORT: number;
  };
  readonly DATABASE: {
    readonly TYPE: string;
    readonly URL: string;
    readonly SSL: boolean;
    readonly SYNCHRONIZE: boolean;
    readonly DROP_SCHEMA: boolean;
    readonly LOGGING: boolean;
  };
  readonly REDIS: {
    readonly URL: string;
    readonly TOKEN_BLOCKLIST: string;
  };
  readonly GRAPHQL: {
    readonly PATH: string;
    readonly PLAYGROUND: boolean;
  };
}
