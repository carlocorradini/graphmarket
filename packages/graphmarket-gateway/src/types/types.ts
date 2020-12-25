export interface IConfig {
  readonly NODE: {
    readonly ENV: 'production' | 'development' | 'test';
    readonly PORT: number;
  };
  readonly TOKEN: {
    readonly SECRET: string;
    readonly ALGORITHM: string;
  };
  readonly GRAPHQL: {
    readonly PATH: string;
    readonly PLAYGROUND: boolean;
    readonly TRACING: boolean;
  };
  readonly SERVICES: {
    readonly USERS: {
      URL: string;
    };
  };
}
