import { UserRoles } from '@app/entities/User';
import { Request, Response } from 'express';

export interface IConfig {
  NODE: {
    ENV: 'production' | 'development' | 'test';
    PORT: number;
  };
  DATABASE: {
    TYPE: string;
    URL: string;
    SSL: boolean;
    SYNCHRONIZE: boolean;
    LOGGING: boolean;
    ENTITIES: string;
    MIGRATIONS: string;
    SUBSCRIBERS: string;
  };
  JWT: {
    SECRET: string;
    ALGORITHM: string;
    EXPIRATION_TIME: string;
  };
  GRAPHQL: {
    PATH: string;
    PLAYGROUND: boolean;
    RESOLVERS: string;
  };
}

export interface IJWTPayload {
  id: string;
  roles: UserRoles[];
}

export interface IContext {
  req: Request;
  res: Response;
  user?: IJWTPayload;
}
