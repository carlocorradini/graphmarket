import { UserRoles } from '@app/entities/User';
import { Request, Response } from 'express';

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

export interface IJWTPayload {
  readonly id: string;
  readonly roles: UserRoles[];
}

export interface IContext {
  readonly req: Request;
  readonly res: Response;
  readonly user?: IJWTPayload;
}
