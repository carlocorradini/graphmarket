/**
 * Token custom payload
 */
export interface ITokenPayload {
  readonly id: string;
  readonly roles: string[];
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
