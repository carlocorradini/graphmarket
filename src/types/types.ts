import { UserRoles } from '@app/entities/User';

/**
 * Configuration interface
 */
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
    readonly ENTITIES: string;
    readonly MIGRATIONS: string;
    readonly SUBSCRIBERS: string;
  };
  readonly REDIS: {
    readonly URL: string;
    readonly TOKEN_BLOCKLIST: string;
  };
  readonly TOKEN: {
    readonly SECRET: string;
    readonly ALGORITHM: string;
    readonly EXPIRATION_TIME: number;
  };
  readonly GRAPHQL: {
    readonly PATH: string;
    readonly PLAYGROUND: boolean;
    readonly RESOLVERS: string;
  };
  readonly SERVICES: {
    readonly PHONE: {
      readonly TWILIO_ACCOUNT_SID: string;
      readonly TWILIO_AUTH_TOKEN: string;
      readonly TWILIO_VERIFICATION_SID: string;
      readonly DEBUG: boolean;
    };
    readonly EMAIL: {
      readonly SENDGRID_API_KEY: string;
    };
    readonly UPLOAD: {
      readonly CLOUDINARY_CLOUD_NAME: string;
      readonly CLOUDINARY_API_KEY: string;
      readonly CLOUDINARY_API_SECRET: string;
      readonly CLOUDINARY_FOLDER: string;
    };
  };
}

/**
 * Token custom payload
 */
export interface ITokenPayload {
  readonly id: string;
  readonly roles: UserRoles[];
}

/**
 * Token full payload
 */
export interface IToken extends ITokenPayload {
  readonly iat: number;
  readonly exp: number;
  readonly sub: string;
}

/**
 * GraphQL context
 */
export interface IContext {
  readonly user?: IToken;
}
