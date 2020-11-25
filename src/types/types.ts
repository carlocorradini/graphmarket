import { UserRoles } from '@app/entities/User';
import { Request, Response } from 'express';

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
    readonly LOGGING: boolean;
    readonly ENTITIES: string;
    readonly MIGRATIONS: string;
    readonly SUBSCRIBERS: string;
  };
  readonly REDIS: {
    readonly URL: string;
    readonly PASSWORD: string;
    readonly HOST: string;
    readonly PORT: number;
    readonly JWT_BLOCKLIST: string;
  };
  readonly JWT: {
    readonly SECRET: string;
    readonly ALGORITHM: string;
    readonly EXPIRATION_TIME: string;
  };
  readonly GRAPHQL: {
    readonly PATH: string;
    readonly PLAYGROUND: boolean;
    readonly RESOLVERS: string;
  };
}

/**
 * JWT custom payload
 */
export interface IJWTPayload {
  readonly id: string;
  readonly roles: UserRoles[];
}

/**
 * JWT full payload
 */
export interface IJWT extends IJWTPayload {
  readonly iat: number;
  readonly exp: number;
  readonly sub: string;
}

/**
 * GraphQL context
 */
export interface IContext {
  readonly req: Request;
  readonly res: Response;
  readonly user?: IJWT;
}
