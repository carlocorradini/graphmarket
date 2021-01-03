declare module 'express-jwt-blacklist' {
  interface IOptions {
    strict: boolean;
    store: {
      type: 'redis';
      url: string;
      keyPrefix?: string;
    };
  }

  export function configure(opts: IOptions): void;

  export function isRevoked(
    req: any,
    payload: any,
    done: (error: Error, revoked: boolean) => void,
  ): void;

  export function revoke(
    user: Object,
    lifetime?: number,
    callback?: (error: Error, revoked: boolean) => void,
  ): void;

  export function revoke(user: Object, callback?: (error: Error, revoked: boolean) => void): void;

  export function purge(
    user: Object,
    llifetime?: number,
    callback?: (error: Error, purged: boolean) => void,
  ): void;

  export function purge(user: Object, callback?: (error: Error, purged: boolean) => void): void;
}
