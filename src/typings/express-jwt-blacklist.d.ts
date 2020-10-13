declare module 'express-jwt-blacklist' {
  import express from 'express';

  interface TYPE {
    revoke: 'revoke';
    purge: 'purge';
  }

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
    done: (err: any, revoked?: boolean) => void,
  ): void;

  export function revoke(user: Object, lifetime?: number, callback?: Function): void;

  export function purge(user: Object, llifetime?: number, callback?: Function): void;
}
