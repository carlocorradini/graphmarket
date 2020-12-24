declare module 'express-jwt-blacklist' {
  import express from 'express';

  interface IOptions {
    strict: boolean;
    store: {
      type: 'redis';
      url: string;
    };
  }

  export function configure(opts: IOptions): void;

  export function isRevoked(
    req: express.Request,
    payload: any,
    done: (error: Error, revoked: boolean) => void,
  ): void;

  export function revoke(
    user: Object,
    lifetime?: number,
    callback?: (error: Error, revoked: boolean) => void,
  ): void;

  export function purge(
    user: Object,
    llifetime?: number,
    callback?: (error: Error, purged: boolean) => void,
  ): void;
}
